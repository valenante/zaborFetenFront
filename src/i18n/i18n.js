import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importa tus archivos de traducción
import enTranslations from './locales/en/translation.json';
import frTranslations from './locales/fr/translation.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslations,
    },
    fr: {
      translation: frTranslations,
    },
  },
  lng: 'en', // Idioma predeterminado
  fallbackLng: 'en', // Si la traducción no está disponible, usar el idioma predeterminado
  interpolation: {
    escapeValue: false, // No es necesario en React
  },
});

export default i18n;
