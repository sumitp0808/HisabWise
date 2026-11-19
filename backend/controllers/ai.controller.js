const { getGeminiClient } = require("../ai/gemini");
const toolDeclarations = require("../ai/tools");
const { executeTool } = require("../ai/toolHandlers");
const systemPrompt = require("../ai/systemPrompt");

const MODEL = "gemini-2.5-flash";
const MAX_TOOL_ROUNDS = 4;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_MESSAGES = 15;

const getHistory = (history) => {
  if (history == null) return [];
  if (!Array.isArray(history)) {
    const error = new Error("Conversation history must be a list of messages.");
    error.status = 400;
    throw error;
  }

  const recentHistory = history.slice(-MAX_HISTORY_MESSAGES);
  if (recentHistory.some((item) =>
    !item ||
    !["user", "assistant"].includes(item.role) ||
    typeof item.content !== "string"
  )) {
    const error = new Error("Conversation history contains an invalid message.");
    error.status = 400;
    throw error;
  }

  return recentHistory.flatMap((item) => {
    const text = item.content.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!text) return [];
    return [{ role: item.role === "assistant" ? "model" : "user", parts: [{ text }] }];
  });
};

const chat = async (req, res) => {
  try {
    const message = typeof req.body.message === "string" ? req.body.message.trim() : "";
    if (!message || message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        message: `Message is required and must be at most ${MAX_MESSAGE_LENGTH} characters.`,
      });
    }

    if (typeof req.user !== "string" || !req.user) {
      return res.status(401).json({ message: "A valid authenticated user is required." });
    }

    const contents = [
      ...getHistory(req.body.history),
      { role: "user", parts: [{ text: message }] },
    ];
    const ai = getGeminiClient();
    const config = {
      systemInstruction: systemPrompt,
      tools: [{ functionDeclarations: toolDeclarations }],
      temperature: 0.2,
    };

    let response;
    for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
      response = await ai.models.generateContent({
        model: MODEL,
        contents,
        config,
      });

      const functionCalls = response.functionCalls || [];
      if (functionCalls.length === 0) break;

      const modelContent = response.candidates?.[0]?.content;
      if (modelContent) contents.push(modelContent);

      const functionResponses = [];
      for (const call of functionCalls) {
        if (!call.name) {
          functionResponses.push({
            functionResponse: {
              name: "unknown",
              response: { error: "The requested tool call did not include a name." },
            },
          });
          continue;
        }

        const result = await executeTool(call.name, call.args, req.user);
        functionResponses.push({
          functionResponse: {
            name: call.name,
            ...(call.id ? { id: call.id } : {}),
            response: { output: result },
          },
        });
      }

      contents.push({ role: "user", parts: functionResponses });
    }

    if (response?.functionCalls?.length) {
      response = await ai.models.generateContent({
        model: MODEL,
        contents,
        config: {
          systemInstruction: systemPrompt,
          toolConfig: { functionCallingConfig: { mode: "NONE" } },
          temperature: 0.2,
        },
      });
    }

    const answer = typeof response?.text === "string" ? response.text.trim() : "";
    if (!answer) {
      return res.status(502).json({ message: "The financial assistant returned an empty response. Please try again." });
    }

    return res.status(200).json({ answer });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ message: error.message });
    }

    if (error.code === "GEMINI_API_KEY_MISSING") {
      return res.status(503).json({ message: error.message });
    }

    if (error.status === 401 || error.status === 403) {
      return res.status(502).json({
        message: "Gemini rejected the backend API key or project access. Verify GEMINI_API_KEY and Gemini API access in backend/.env.",
      });
    }

    if (error.status === 429) {
      return res.status(503).json({
        message: "The Gemini request limit has been reached. Please try again shortly.",
      });
    }

    return res.status(502).json({
      message: "The financial assistant could not complete your request. Please try again.",
    });
  }
};

module.exports = {
  chat,
};