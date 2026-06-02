import PropTypes from "prop-types";
import { CircleAlert, CircleCheck, Info } from "lucide-react";

AlertBanner.propTypes = {
  showAlert: PropTypes.bool,
  alertMessage: PropTypes.string,
  severity: PropTypes.string,
};

export default function AlertBanner({
  showAlert,
  alertMessage,
  severity = "error",
}) {
  if (!showAlert) return null;

  const styles = {
    error: {
      icon: <CircleAlert size={18} />,
      className:
        "border-red-200 bg-red-50 text-red-700",
    },
    success: {
      icon: <CircleCheck size={18} />,
      className:
        "border-green-200 bg-green-50 text-green-700",
    },
    info: {
      icon: <Info size={18} />,
      className:
        "border-blue-200 bg-blue-50 text-blue-700",
    },
    warning: {
      icon: <CircleAlert size={18} />,
      className:
        "border-yellow-200 bg-yellow-50 text-yellow-700",
    },
  };

  const current =
    styles[severity] || styles.error;

  return (
    <div
      className={`mb-4 flex items-center gap-2 rounded-lg border px-4 py-3 ${current.className}`}
    >
      {current.icon}
      <span>{alertMessage}</span>
    </div>
  );
}