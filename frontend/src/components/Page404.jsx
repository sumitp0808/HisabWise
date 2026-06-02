import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

import configData from "../config.json";

export default function Page404() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="mb-4 text-4xl font-bold">
          Sorry, page not found!
        </h1>

        <p className="mb-8 text-gray-500">
          Sorry, we couldn't find the page you're looking for.
          Perhaps you've mistyped the URL? Be sure to check
          your spelling.
        </p>

        <img
          src="/static/illustrations/illustration_404.svg"
          alt="404 Illustration"
          className="mx-auto mb-10 h-64"
        />

        <Link
          to={configData.LOGIN_URL}
          className="inline-block rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
        >
          Go to Home
        </Link>

        <div className="mt-10 text-sm text-gray-500">
          <p className="flex items-center justify-center gap-1">
            © Sumit Prajapti | MNNIT
            <Heart
              size={16}
              className="fill-red-500 text-red-500"
            />
          </p>

          <a
            href="https://github.com/sumitp0808/HisabWise/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block font-medium text-blue-600 hover:underline"
          >
            [GitHub]
          </a>
        </div>
      </div>
    </div>
  );
}