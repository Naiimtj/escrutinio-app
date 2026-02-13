import ThemeToggle from './ThemeToggle';
import SelectLanguage from './SelectLanguage';

const NavMenu = ({ isMobileMenu = false }) => {
  return (
    <div className={`flex items-center gap-4 ${isMobileMenu ? 'flex-col' : ''}`}>
      <ThemeToggle />
      <div className="z-50">
        <SelectLanguage isMobileMenu={isMobileMenu} />
      </div>
    </div>
  );
};

export default NavMenu;
