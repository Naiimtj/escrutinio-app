import { useTranslation } from 'react-i18next';
import NavMenu from '../components/NavMenu';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="flex justify-between items-center pb-4">
        {/* Logo/Title */}
        <div className="text-xl font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-darkPrimary" onClick={() => navigate('/')}>
          {t('app.title')}
        </div>

        {/* Menu (Theme + Language) */}
        <div className="flex items-center gap-4">
          <NavMenu />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
