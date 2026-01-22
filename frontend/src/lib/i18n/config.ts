'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import kn from './locales/kn/translation.json';
import hi from './locales/hi/translation.json';
import bn from './locales/bn/translation.json';
import mr from './locales/mr/translation.json';
import te from './locales/te/translation.json';
import ta from './locales/ta/translation.json';
import gu from './locales/gu/translation.json';
import or from './locales/or/translation.json';
import ml from './locales/ml/translation.json';
import pa from './locales/pa/translation.json';
import as from './locales/as/translation.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            kn: { translation: kn },
            hi: { translation: hi },
            bn: { translation: bn },
            mr: { translation: mr },
            te: { translation: te },
            ta: { translation: ta },
            gu: { translation: gu },
            or: { translation: or },
            ml: { translation: ml },
            pa: { translation: pa },
            as: { translation: as },
        },
        // lng: 'en', // Removed to allow dynamic change
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
