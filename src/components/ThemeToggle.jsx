import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Moon, Sun } from '../assets/icons';

const ThemeToggle = () => {
  const { t } = useTranslation();
  const initTheme =
    typeof localStorage !== 'undefined' && localStorage.getItem('theme')
      ? localStorage.getItem('theme')
      : 'dark';
  const [theme, setTheme] = useState(initTheme);

  const changeTheme = (selectedTheme) => {
    localStorage.setItem('theme', selectedTheme);
    setTheme(selectedTheme);
  };

  // Aplicar el tema cuando cambie
  useEffect(() => {
    const isDark = theme === 'dark';

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Actualizar colores del scrollbar cuando cambie el tema
  useEffect(() => {
    const isDarkMode = theme === 'dark';
    const scrollbarTrackColor = isDarkMode ? 'rgb(2 6 23)' : 'rgb(249 250 251)';
    const scrollbarThumbColor = isDarkMode
      ? 'linear-gradient(rgb(2 6 23), rgb(75, 142, 161), rgb(2 6 23))'
      : 'linear-gradient(rgb(249 250 251), rgb(75, 142, 161), rgb(249 250 251))';

    document.documentElement.style.setProperty(
      '--scrollbar-track-color',
      scrollbarTrackColor,
    );
    document.documentElement.style.setProperty(
      '--scrollbar-thumb-color',
      scrollbarThumbColor,
    );
  }, [theme]);

  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    changeTheme(newTheme);
  };

  const ThemeMenuIcon =
    theme === 'light' ? (
      <Sun
        id="light"
        className="theme-toggle-icon size-7 md:size-5 transition-all"
      />
    ) : (
      <Moon
        id="dark"
        className="theme-toggle-icon size-7 md:size-5 transition-all text-white"
      />
    );

  return (
    <div className="relative">
      <button
        id="theme-toggle-btn"
        className="appearance-none border-none flex hover:scale-125 transition duration-300 cursor-pointer"
        onClick={handleToggleTheme}
        aria-label={`${t('navigation.changeTheme')} ${
          theme === 'dark' ? t('light') : t('dark')
        }`}
      >
        <span className="sr-only">{t('navigation.selectTheme')}</span>
        {ThemeMenuIcon}
      </button>
    </div>
  );
};

export default ThemeToggle;
