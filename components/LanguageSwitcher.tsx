import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../types';

interface Props {
  currentLang: Language;
  onToggle: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<Props> = ({ currentLang, onToggle }) => {
  return (
    <button
      onClick={() => onToggle(currentLang === 'en' ? 'ar' : 'en')}
      className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-colors"
    >
      <Globe size={16} />
      <span>{currentLang === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
};