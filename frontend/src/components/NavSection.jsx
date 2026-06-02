import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

export default function NavSection({ navConfig }) {
  return (
    <nav className="space-y-1">
      {navConfig.map((item) => (
        <NavLink
          key={item.title}
          to={item.path}
          className={({ isActive }) =>
            `
            flex items-center gap-3
            rounded-lg px-4 py-3
            transition-colors
            ${
              isActive
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }
          `
          }
        >
          {item.icon}

          <span>{item.title}</span>

          {item.info && (
            <span className="ml-auto">
              {item.info}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

NavSection.propTypes = {
  navConfig: PropTypes.array.isRequired,
};