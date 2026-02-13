import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlagES, FlagUSA } from '../assets/icons';

const LANGS = [
  {
    value: 'en',
    label: 'English',
    icon: FlagUSA,
  },
  {
    value: 'es',
    label: 'Spanish',
    icon: FlagES,
  },
];

const SelectLanguage = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { t, i18n } = useTranslation();
  const [valueLang, setValueLang] = useState(i18n.language);

  const toggleMenu = () => {
    setOpen(!open);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  // Close menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY) {
        setOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Update language
  useEffect(() => {
    if (valueLang !== i18n.language) {
      localStorage.setItem('language', JSON.stringify(valueLang));
      i18n.changeLanguage(valueLang);
    }
  }, [i18n, valueLang]);

  const CurrentLang =
    i18n.language && LANGS.find((lang) => lang.value === i18n.language);

  const handleChangeLanguage = (language) => {
    setOpen(false);
    if (language) {
      setValueLang(language);
    }
  };

  return (
    <div className="relative ml-2 flex items-center" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="md:hover:scale-125 transition duration-300 cursor-pointer"
        aria-label={`${t('navigation.changeLanguageTo')} ${
          CurrentLang?.label || ''
        }`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <img
          src={CurrentLang?.icon}
          alt={`${t('navigation.currentLanguage')} ${CurrentLang?.label || ''}`}
          className="w-9 md:w-auto"
        />
      </button>

      {/* Language dropdown menu */}
      {open && (
        <div
          className="absolute right-0 top-8 z-10 mt-1 w-32 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none "
          role="menu"
          aria-orientation="vertical"
        >
            {LANGS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleChangeLanguage(item.value)}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 hover:rounded-md px-4 py-2 text-base text-gray-700 dark:text-gray-200 cursor-pointer w-full text-right flex items-center gap-2 transition-colors duration-150"
                role="menuitem"
                aria-label={`${t('navigation.changeLanguageTo')} ${item.label}`}
              >
                <img
                  src={item.icon}
                  alt={`${item.label} ${t('navigation.flag')}`}
                  className="w-6 h-4"
                />
                {t(`navigation.${item.label.toLowerCase()}`)}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default SelectLanguage;
