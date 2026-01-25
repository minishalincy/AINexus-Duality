'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { languages } from '@/lib/languages';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LanguageSelection() {
  const { setLanguage } = useLanguage();
  const router = useRouter();

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode);
    router.push('/teacher/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="relative h-24 w-80 mx-auto mb-4">
          <Image
            src="/images/logo.png"
            alt="Assist AI"
            fill
            className="object-contain"
            priority
          />
        </div>
        <p className="text-gray-600 text-lg">Teacher's Assistant Platform for Government Schools</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl"
      >
        <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
          Choose your preferred Language
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {languages.map((lang, index) => (
            <motion.button
              key={lang.code}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleLanguageSelect(lang.code)}
              className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-transparent hover:border-primary-500 bg-gray-50 hover:bg-primary-50 transition-all duration-300 group cursor-pointer"
            >
              <span className="text-xl font-bold text-gray-800 group-hover:text-primary-700 mb-1">
                {lang.nativeName}
              </span>
              <span className="text-sm text-gray-500 group-hover:text-primary-600">
                {lang.name}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
