import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import PixelHeart from "../PixelHeart";

interface TopNavProps {
  section: number;
  onNavigate: (section: number) => void;
}

export function TopNav({ section, onNavigate }: TopNavProps) {
  const { t, i18n } = useTranslation("common");

  const changeLanguage = () => {
    i18n.changeLanguage(i18n.language === "fr" ? "en" : "fr");
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-transparent"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo/Name - Click to go back to intro */}
        <motion.button
          onClick={() => onNavigate(0)}
          className="flex items-center gap-2 text-white/90 font-bold text-lg tracking-tight cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PixelHeart size={20} />
          EW
        </motion.button>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <NavLink
            label={t("nav.about")}
            isActive={section === 15}
            onClick={() => onNavigate(15)}
          />
          <NavLink
            label={t("nav.skills")}
            isActive={section >= 1 && section <= 12}
            onClick={() => onNavigate(1)}
          />
          <NavLink
            label={t("nav.experience")}
            isActive={section === 13}
            onClick={() => onNavigate(13)}
          />
          <NavLink
            label={t("nav.portfolio")}
            isActive={section === 14}
            onClick={() => onNavigate(14)}
          />

          {/* Language Switcher */}
          <div className="relative ml-4">
            <motion.button
              className="group flex items-center gap-1 px-3 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={changeLanguage}
            >
              <svg
                className="w-4 h-4 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3.6 9h16.8M3.6 15h16.8"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9Z"
                />
              </svg>
              <AnimatePresence mode="wait">
                <motion.span
                  key={i18n.language}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium text-white/90 min-w-6"
                >
                  {i18n.language === "fr" ? "FR" : "EN"}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

interface NavLinkProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavLink({ label, isActive, onClick }: NavLinkProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`text-sm font-medium tracking-wide transition-colors duration-300 cursor-pointer ${
        isActive ? "text-cyan-400" : "text-white/70 hover:text-cyan-400"
      }`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      {label}
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="h-0.5 bg-cyan-400 mt-1 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.button>
  );
}
