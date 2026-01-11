'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { languages } from '@/lib/languages';
import '@/lib/i18n/config'; // Init i18n
import { useTranslation } from 'react-i18next';

type LanguageContextType = {
    language: string;
    setLanguage: (lang: string) => void;
    t: (key: string) => string; // Placeholder for translation function
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState('en');
    const { t, i18n } = useTranslation();

    // Load language from localStorage on mount
    useEffect(() => {
        const storedLang = localStorage.getItem('preferredLanguage');
        if (storedLang) {
            setLanguageState(storedLang);
            i18n.changeLanguage(storedLang);
        }
    }, [i18n]);

    const setLanguage = (lang: string) => {
        setLanguageState(lang);
        localStorage.setItem('preferredLanguage', lang);
        i18n.changeLanguage(lang);
        // Ideally set a cookie here too for server-side if needed
        document.cookie = `PREFERRED_LANGUAGE=${lang}; path=/; max-age=31536000`;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
