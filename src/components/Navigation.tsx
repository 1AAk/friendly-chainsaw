import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NAV_ITEMS = [
  { to: "/", key: "navigation.home" },
  { to: "/library", key: "navigation.library" },
] as const;

export default function Navigation() {
  const { t } = useTranslation("components");

  return (
    <nav className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em]">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            `rounded-full border px-3 py-1 font-semibold transition ${
              isActive
                ? "border-amber-300/60 bg-amber-400/20 text-amber-100"
                : "border-slate-800 text-slate-300 hover:border-slate-600"
            }`
          }
        >
          {t(item.key)}
        </NavLink>
      ))}
    </nav>
  );
}
