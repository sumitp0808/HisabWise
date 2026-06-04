import { Link } from "react-router-dom";
import configData from "../config.json";

export default function Logo({disabledLink = false, className = ""}) {
  const logo = (
    <img
      src="/static/logo.png"
      alt="HisabWise"
      className={`h-14 w-auto object-contain ${className}`}
    />
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link to={configData.DASHBOARD_URL}>
      {logo}
    </Link>
  );
}