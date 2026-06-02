import PropTypes from "prop-types";

UserDetails.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  emailId: PropTypes.string,
};

export default function UserDetails({
  firstName,
  lastName,
  emailId,
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            First Name
          </label>

          <input
            type="text"
            value={firstName || ""}
            disabled
            className="
              w-full rounded-lg border border-gray-300
              bg-gray-100 px-4 py-3
              text-gray-600 cursor-not-allowed
            "
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Last Name
          </label>

          <input
            type="text"
            value={lastName || ""}
            disabled
            className="
              w-full rounded-lg border border-gray-300
              bg-gray-100 px-4 py-3
              text-gray-600 cursor-not-allowed
            "
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Email Address
        </label>

        <input
          type="email"
          value={emailId || ""}
          disabled
          className="
            w-full rounded-lg border border-gray-300
            bg-gray-100 px-4 py-3
            text-gray-600 cursor-not-allowed
          "
        />
      </div>
    </div>
  );
}