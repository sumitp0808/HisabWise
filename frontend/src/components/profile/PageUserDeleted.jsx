import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

import configData from "../../config.json";

export default function PageUserDeleted() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-5xl text-center">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-center md:text-left">
          
          <div>
            <h1 className="mb-4 text-4xl font-bold">
              User Account Deleted!
            </h1>

            <p className="text-gray-500">
              Thank you for using HisabWise!
            </p>
          </div>

          <img
            src="/static/avatars/avatar_default.png"
            alt="User Deleted"
            className="h-64 object-contain"
          />
        </div>

        <div className="mt-8">
          <Link
            to={configData.LOGIN_URL}
            className="inline-block rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Go to Home
          </Link>
        </div>

        <div className="mt-10 text-sm text-gray-500">
          <p className="flex items-center justify-center gap-1">
            © Sumit Prajapati | MNNIT
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