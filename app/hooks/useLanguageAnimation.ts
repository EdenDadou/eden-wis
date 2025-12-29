import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Hook qui détecte les changements de langue et retourne un état
 * pour déclencher des animations sur les textes
 */
export function useLanguageAnimation() {
  const { i18n } = useTranslation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const handleLanguageChange = () => {
      setIsAnimating(true);
      setAnimationKey(prev => prev + 1);

      // Reset après l'animation
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 400);

      return () => clearTimeout(timer);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return { isAnimating, animationKey, language: i18n.language };
}
