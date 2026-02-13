import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Briefcase, Code, MobileMenu, ProfileCheck } from '../assets/icons';
import NavMenu from '../components/NavMenu';

function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

const NavBar = () => {
  const [t] = useTranslation('translation');
  const [activeSection, setActiveSection] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollPosition = window.scrollY + windowHeight / 2;

      const experienceSection = document.getElementById('experience');
      const projectsSection = document.getElementById('projects');
      const aboutMeSection = document.getElementById('about-me');

      if (
        experienceSection &&
        experienceSection.offsetTop <= scrollPosition &&
        experienceSection.offsetTop + experienceSection.offsetHeight >
          scrollPosition
      ) {
        setActiveSection('experience');
      } else if (
        projectsSection &&
        projectsSection.offsetTop <= scrollPosition &&
        projectsSection.offsetTop + projectsSection.offsetHeight >
          scrollPosition
      ) {
        setActiveSection('projects');
      } else if (
        aboutMeSection &&
        aboutMeSection.offsetTop <= scrollPosition &&
        aboutMeSection.offsetTop + aboutMeSection.offsetHeight > scrollPosition
      ) {
        setActiveSection('about-me');
      } else {
        setActiveSection(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const currentScreenWidth = window.innerWidth;
  const [screenWidth, setScreenWidth] = useState(currentScreenWidth < 767);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 767 && !screenWidth) {
        setScreenWidth(true);
      } else if (window.innerWidth >= 767 && screenWidth) {
        setScreenWidth(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [screenWidth]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled =
        currentScreenWidth < 767 ? window.scrollY > 0 : window.scrollY > 70;
      setScrolled(isScrolled);
      if (window.scrollY) {
        setMenuOpen(false); // Here the menu closes when you scroll down
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const menuButtonRef = useRef(null);
  // Add an event handler to close the menu when clicked out of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };
    // Add the event handler to the document
    document.addEventListener('click', handleClickOutside);
    // Clearing the event handler when unmounting the component
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuButtonRef]);
  return (
    <div className="relative">
      {screenWidth ? (
        <div
          className={`absolute z-50 md:hidden flex gap-6 mt-5 backdrop-blur-md ${
            activeSection
              ? 'dark:bg-transparent bg-transparent md:dark:bg-black/25 md:bg-white/25'
              : ''
          } py-2 rounded-xl`}
        >
          <NavMenu />
        </div>
      ) : null}
      <div className="fixed z-40 top-0 left-0 md:right-0 right-5 md:pt-4">
        <div className="flex justify-end md:justify-center items-center">
          <div
            className={`flex items-center backdrop-blur-md ${
              scrolled
                ? 'dark:bg-black/25 bg-white/25'
                : `md:dark:bg-transparent md:bg-transparent ${
                    menuOpen ? 'dark:bg-black/25 bg-white/25' : ''
                  }`
            } md:p-2 md:mt-0 mt-5 rounded-xl `}
          >
            <nav
              className="text-right flex justify-end items-center"
              ref={screenWidth && menuOpen ? menuButtonRef : null}
            >
              <div className="flex flex-wrap items-center justify-end max-w-7xl mx-auto md:p-4">
                <div className="flex items-center md:order-2 space-x-1 md:space-x-2 rtl:space-x-reverse">
                  <button
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden dark:text-gray-400 "
                    onClick={() => setMenuOpen(!menuOpen)}
                    alt={menuOpen ? t('Close main menu') : t('Open main menu')}
                  >
                    <span className="sr-only">
                      {menuOpen ? t('Close main menu') : t('Open main menu')}
                    </span>
                    <MobileMenu />
                  </button>
                </div>
                {/* // - MENU */}
                <div
                  className={`items-center justify-between ${
                    !menuOpen ? 'hidden' : ''
                  } w-full md:flex md:w-auto md:order-1 pr-4 md:pr-0`}
                >
                  <ul className="flex flex-col my-4 font-medium md:flex-row md:my-0 md:space-x-8 rtl:space-x-reverse items-end">
                    <li>
                      <Link
                        className={`${
                          activeSection === 'experience'
                            ? 'dark:text-lilaPortfolio font-bold text-lilaLightPortfolio'
                            : 'dark:text-grayPortfolio text-grayLightPortfolio '
                        } text-base md:text-base lg:text-xl md:pr-4 my-2 md:my-0 hover:text-black dark:hover:text-lilaPortfolio transition duration-300 flex items-center`}
                        onClick={() => scrollToSection('experience')}
                        alt={t('Button to Section Work Experience')}
                      >
                        <Briefcase className="size-6 mr-1" />
                        {t('Work Experience')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`${
                          activeSection === 'projects'
                            ? 'dark:text-lilaPortfolio font-bold text-lilaLightPortfolio'
                            : 'dark:text-grayPortfolio text-grayLightPortfolio '
                        } text-base md:text-base lg:text-xl md:pr-4 my-2 md:my-0 hover:text-black dark:hover:text-lilaPortfolio transition duration-300 flex items-center`}
                        onClick={() => scrollToSection('projects')}
                        alt={t('Button to Section Projects')}
                      >
                        <Code className="size-6 mr-1" />
                        {t('Projects')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`${
                          activeSection === 'about-me'
                            ? 'dark:text-lilaPortfolio font-bold text-lilaLightPortfolio'
                            : 'dark:text-grayPortfolio text-grayLightPortfolio '
                        } text-base md:text-base lg:text-xl md:pr-4 my-2 md:my-0 hover:text-black dark:hover:text-lilaPortfolio transition duration-300 flex items-center`}
                        onClick={() => scrollToSection('about-me')}
                        alt={t('Button to About Me')}
                      >
                        <ProfileCheck className="size-6 mr-1" />
                        {t('About Me')}
                      </Link>
                    </li>
                  </ul>
                  {window.scrollY > 70 ? (
                    <div className="md:hidden flex justify-end gap-6 pb-4">
                      <NavMenu isMobileMenu />
                    </div>
                  ) : null}
                </div>
              </div>
            </nav>
            {!screenWidth ? (
              <div className="flex items-center gap-8 pr-4">
                <NavMenu />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
