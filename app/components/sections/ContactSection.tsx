import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useLanguageAnimation } from "../../hooks/useLanguageAnimation";

interface ContactSectionProps {
  section: number;
  showCard: boolean;
  targetSection: number | null;
  isNavigating: boolean;
}

// Contact Modal Component
function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t } = useTranslation("common");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative max-w-lg w-full pointer-events-auto">
              {/* Glass Container */}
              <div className="relative overflow-hidden rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.1)]">
                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0 opacity-50"
                  animate={{
                    background: [
                      "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(6, 182, 212, 0.2) 0%, transparent 50%), radial-gradient(ellipse 60% 80% at 80% 60%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)",
                      "radial-gradient(ellipse 80% 50% at 80% 30%, rgba(139, 92, 246, 0.2) 0%, transparent 50%), radial-gradient(ellipse 60% 80% at 20% 70%, rgba(6, 182, 212, 0.2) 0%, transparent 50%)",
                      "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(6, 182, 212, 0.2) 0%, transparent 50%), radial-gradient(ellipse 60% 80% at 80% 60%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)",
                    ],
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Glass base */}
                <div
                  className="absolute inset-0 backdrop-blur-2xl"
                  style={{
                    background: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.8) 100%)",
                  }}
                />

                {/* Top highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                {/* Content */}
                <div className="relative p-6 md:p-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{t("contact.title")}</h2>
                      <p className="text-white/60 text-sm mt-1">{t("contact.subtitle")}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>

                  {/* Success State */}
                  <AnimatePresence mode="wait">
                    {isSuccess ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="py-12 text-center"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.1 }}
                          className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center"
                        >
                          <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                        <p className="text-white text-lg font-medium">{t("contact.success")}</p>
                        <p className="text-white/60 text-sm mt-1">{t("contact.successMessage")}</p>
                      </motion.div>
                    ) : (
                      <motion.form
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit}
                        className="space-y-4"
                      >
                        {/* Name & Email Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-white/70 text-sm mb-2">{t("contact.name")}</label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
                              placeholder={t("contact.namePlaceholder")}
                            />
                          </div>
                          <div>
                            <label className="block text-white/70 text-sm mb-2">{t("contact.email")}</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
                              placeholder={t("contact.emailPlaceholder")}
                            />
                          </div>
                        </div>

                        {/* Subject */}
                        <div>
                          <label className="block text-white/70 text-sm mb-2">{t("contact.subject")}</label>
                          <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
                            placeholder={t("contact.subjectPlaceholder")}
                          />
                        </div>

                        {/* Message */}
                        <div>
                          <label className="block text-white/70 text-sm mb-2">{t("contact.message")}</label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all resize-none"
                            placeholder={t("contact.messagePlaceholder")}
                          />
                        </div>

                        {/* Submit Button */}
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="relative w-full group overflow-hidden rounded-xl"
                        >
                          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-violet-500/30 to-cyan-500/30 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                          <div className="relative px-6 py-4 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 backdrop-blur-md rounded-xl border border-white/20 group-hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-3">
                            {isSubmitting ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                              />
                            ) : (
                              <>
                                <span className="text-white font-semibold">{t("contact.send")}</span>
                                <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                              </>
                            )}
                          </div>
                        </motion.button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function ContactSection({ section, showCard, targetSection, isNavigating }: ContactSectionProps) {
  const { t } = useTranslation("common");
  const { animationKey } = useLanguageAnimation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Contact is section 13
  const isVisible = section === 13 && (targetSection === null || showCard) && !isNavigating;

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              transition: { duration: 0.5, delay: 0.1 }
            }}
            exit={{
              opacity: 0,
              filter: "blur(8px)",
              transition: { duration: 0.3 }
            }}
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          >
            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  duration: 0.7,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: 0.15
                }
              }}
              exit={{
                opacity: 0,
                y: -30,
                scale: 0.95,
                transition: { duration: 0.3, ease: [0.4, 0, 1, 1] }
              }}
              className="max-w-md w-full mx-4 pointer-events-auto"
            >
              {/* Glass Container */}
              <div className="relative overflow-hidden rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.1)]">
                {/* Animated liquid gradient */}
                <motion.div
                  className="absolute inset-0 opacity-60"
                  animate={{
                    background: [
                      "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 80% at 80% 60%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
                      "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 80% at 30% 70%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)",
                      "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 80% at 80% 60%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
                    ],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Glass base */}
                <div
                  className="absolute inset-0 backdrop-blur-2xl"
                  style={{
                    background: "linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.65) 100%)",
                  }}
                />

                {/* Top highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                {/* Inner glow */}
                <div className="absolute inset-0 rounded-[2.5rem] shadow-[inset_0_0_80px_rgba(255,255,255,0.02)]" />

                {/* Content */}
                <div className="relative p-8 md:p-10 text-center">
                  {/* Paper plane icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                    className="w-20 h-20 mx-auto mb-6 relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-violet-500/20 rounded-2xl blur-xl" />
                    <div className="relative w-full h-full bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                      <svg className="w-10 h-10 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                    </div>
                  </motion.div>

                  {/* Title */}
                  <AnimatePresence mode="wait">
                    <motion.h2
                      key={`heading-${animationKey}`}
                      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                      transition={{ duration: 0.3 }}
                      className="text-3xl font-bold mb-3"
                      style={{
                        background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {t("contact.heading")}
                    </motion.h2>
                  </AnimatePresence>

                  {/* Description */}
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={`desc-${animationKey}`}
                      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                      transition={{ duration: 0.3, delay: 0.05 }}
                      className="text-white/60 mb-8 leading-relaxed"
                    >
                      {t("contact.description")}
                    </motion.p>
                  </AnimatePresence>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.button
                      onClick={() => setIsModalOpen(true)}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative w-full group overflow-hidden rounded-2xl"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-violet-500/30 to-cyan-500/30 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                      <div className="relative px-6 py-4 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 backdrop-blur-md rounded-2xl border border-white/20 group-hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-3">
                        <span className="text-white font-semibold text-lg">{t("contact.cta")}</span>
                        <motion.svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </motion.svg>
                      </div>
                    </motion.button>
                  </motion.div>

                  {/* Social links */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center justify-center gap-4 mt-6"
                  >
                    {[
                      { icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z", label: "LinkedIn" },
                      { icon: "M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z", label: "GitHub" },
                      { icon: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z", label: "Twitter" },
                    ].map((social, i) => (
                      <motion.a
                        key={i}
                        href="#"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all"
                      >
                        <svg className="w-5 h-5 text-white/60 hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                          <path d={social.icon} />
                        </svg>
                      </motion.a>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
