import { useTranslation } from 'react-i18next';
import NavMenu from '../components/NavMenu';
import { useNavigate } from 'react-router-dom';
import { BaseIcon } from './base';

const NavBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="flex justify-between items-center pb-4">
        {/* Logo/Title */}
        <div
          className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-darkPrimary group"
          onClick={() => navigate('/')}
        >
          <BaseIcon
            icon="logo"
            size="md"
            className="fill-gray-900 dark:fill-white group-hover:fill-darkPrimary"
          />
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
