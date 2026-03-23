import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import locale files
import en from './locales/en';
import hi from './locales/hi';
import mr from './locales/mr';
import ta from './locales/ta';
import te from './locales/te';
import bn from './locales/bn';
import gu from './locales/gu';
import ml from './locales/ml';
import pa from './locales/pa';
import or from './locales/or';
import as from './locales/as';
import ur from './locales/ur';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
  ta: { translation: ta },
  te: { translation: te },
  bn: { translation: bn },
  gu: { translation: gu },
  ml: { translation: ml },
  pa: { translation: pa },
  or: { translation: or },
  as: { translation: as },
  ur: { translation: ur },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
