
export default function About() {
  return (
    <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 shadow-lg">
      {/* Header */}
      <div className="text-center">
        <img
          src="/logo.png"
          alt="HisabWise"
          className="mx-auto h-20 w-20"
        />

        <h1 className="mt-4 text-4xl font-bold">
          HisabWise
        </h1>

        <p className="mt-4 text-gray-600">
          Group Expense Splitting Application built
          using the MERN Stack.
        </p>
      </div>

      {/* Hero Image */}

      {/* Introduction */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">
          Introduction
        </h2>

        <p className="text-gray-700">
          HisabWise is a MERN-stack expense splitting
          app inspired by Splitwise. It helps
          groups track expenses, calculate balances,
          settle debts, and visualize spending
          patterns through analytics and charts.
        </p>
      </section>

      {/* Features */}
      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold">
          Key Features
        </h2>

        <ul className="list-disc space-y-2 pl-6">
          <li>Create and manage groups</li>
          <li>Track shared expenses</li>
          <li>Automatic balance settlement</li>
          <li>Expense analytics and graphs</li>
          <li>JWT authentication</li>
          <li>Multiple user accounts</li>
        </ul>
      </section>

      {/* Technologies */}
      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold">
          Technologies Used
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="mb-2 text-lg font-semibold">
              Frontend
            </h3>

            <ul className="list-disc pl-5">
              <li>React</li>
              <li>Tailwind CSS</li>
              <li>Axios</li>
              <li>Chart.js</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">
              Backend
            </h3>

            <ul className="list-disc pl-5">
              <li>Node.js</li>
              <li>Express.js</li>
              <li>JWT</li>
              <li>bcrypt</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">
              Database
            </h3>

            <ul className="list-disc pl-5">
              <li>MongoDB Atlas</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Setup */}
      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold">
          Local Setup
        </h2>

        <div className="rounded-lg bg-gray-100 p-4">
          <pre className="overflow-x-auto text-sm">
{`# Frontend
npm install
npm run dev

# Backend
npm install
npm start`}
          </pre>
        </div>
      </section>

      {/* License */}
      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold">
          License
        </h2>

        <p className="text-gray-700">
          This project is released under the MIT
          License.
        </p>
      </section>

      <div className="mt-12">
        <footer className="mt-12 border-t pt-6 text-center text-sm text-gray-500">
  <p>
    © Sumit Prajapati | MNNIT
  </p>
  <a
    href="https://github.com/sumitp0808@gmail.com/HisabWise"
    target="_blank"
    rel="noreferrer"
    className="mt-3 inline-block text-blue-600 hover:underline"
  >
    GitHub Repository
  </a>
</footer>
      </div>
    </div>
  );
}