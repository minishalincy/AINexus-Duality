'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { languages } from '@/lib/languages';
import '@/lib/i18n/config'; 
import { useTranslation } from 'react-i18next';

type LanguageContextType = {
    language: string;
    setLanguage: (lang: string) => void;
    t: (key: string) => string; 
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const { t, i18n } = useTranslation();

    
    const [language, setLanguageState] = useState('en');
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const storedLang = localStorage.getItem('preferredLanguage');
        console.log("LanguageContext: Loaded language from storage:", storedLang);
        if (storedLang) {
            setLanguageState(storedLang);
            i18n.changeLanguage(storedLang).then(() => {
                console.log("LanguageContext: i18n language changed to:", storedLang);
                setIsInitialized(true);
            });
        } else {
            setIsInitialized(true);
        }
    }, [i18n]);

    const setLanguage = (lang: string) => {
        setLanguageState(lang);
        localStorage.setItem('preferredLanguage', lang);
        document.cookie = `PREFERRED_LANGUAGE=${lang}; path=/; max-age=31536000`;
        i18n.changeLanguage(lang);
    };

    
    
    

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            <div key={language}>
                {children}
            </div>
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
