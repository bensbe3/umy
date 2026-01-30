// MegaMenu.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './MegaMenu.css';

export interface SubMenuItem {
  title: string;
  description: string;
  image: string;
  path: string;
}

export interface MenuItem {
  label: string;
  path?: string;
  submenu?: SubMenuItem[];
}

interface MegaMenuProps {
  items: MenuItem[];
}

const MegaMenu: React.FC<MegaMenuProps> = ({ items }) => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    if (items[index].submenu && window.innerWidth > 768) {
      setActiveMenu(index);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 768) {
      setActiveMenu(null);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setMobileSubmenuOpen(null);
  };

  const toggleMobileSubmenu = (index: number) => {
    setMobileSubmenuOpen(mobileSubmenuOpen === index ? null : index);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileSubmenuOpen(null);
  };

  return (
    <nav className="mega-menu">
      <div className="mega-menu__container">
        {/* Logo/Brand */}
        <div className="mega-menu__brand">
          <Link to="/" className="mega-menu__logo">
            <img 
              src="/images/logoUmy.png" 
              alt="United Moroccan Youth - UMY" 
              className="mega-menu__logo-image"
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className="mega-menu__list mega-menu__list--desktop">
          {items.map((item, index) => (
            <li
              key={index}
              className="mega-menu__item"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              {item.submenu ? (
                <>
                  <button className="mega-menu__link mega-menu__link--button">
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`mega-menu__chevron ${
                        activeMenu === index ? 'mega-menu__chevron--rotated' : ''
                      }`}
                      size={16}
                    />
                  </button>

                  <AnimatePresence>
                    {activeMenu === index && (
                      <motion.div
                        className="mega-menu__dropdown-wrapper"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                          type: 'spring',
                          mass: 0.5,
                          damping: 11.5,
                          stiffness: 100,
                        }}
                      >
                        <div className="mega-menu__dropdown-content">
                          <div className="mega-menu__grid">
                            {item.submenu.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                to={subItem.path}
                                className="mega-menu__grid-item"
                              >
                                <div className="mega-menu__grid-item-image">
                                  <img
                                    src={subItem.image}
                                    alt={subItem.title}
                                    loading="lazy"
                                  />
                                </div>
                                <div className="mega-menu__grid-item-content">
                                  <h3 className="mega-menu__grid-item-title">
                                    {subItem.title}
                                  </h3>
                                  <p className="mega-menu__grid-item-description">
                                    {subItem.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link to={item.path || '#'} className="mega-menu__link">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger Button */}
        <button
          className="mega-menu__mobile-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mega-menu__mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="mega-menu__mobile-list">
              {items.map((item, index) => (
                <li key={index} className="mega-menu__mobile-item">
                  {item.submenu ? (
                    <>
                      <button
                        className="mega-menu__mobile-link mega-menu__mobile-link--button"
                        onClick={() => toggleMobileSubmenu(index)}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`mega-menu__chevron ${
                            mobileSubmenuOpen === index ? 'mega-menu__chevron--rotated' : ''
                          }`}
                          size={18}
                        />
                      </button>

                      <AnimatePresence>
                        {mobileSubmenuOpen === index && (
                          <motion.div
                            className="mega-menu__mobile-submenu"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.submenu.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                to={subItem.path}
                                className="mega-menu__mobile-subitem"
                                onClick={closeMobileMenu}
                              >
                                <div className="mega-menu__mobile-subitem-image">
                                  <img
                                    src={subItem.image}
                                    alt={subItem.title}
                                    loading="lazy"
                                  />
                                </div>
                                <div className="mega-menu__mobile-subitem-content">
                                  <h4 className="mega-menu__mobile-subitem-title">
                                    {subItem.title}
                                  </h4>
                                  <p className="mega-menu__mobile-subitem-description">
                                    {subItem.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={item.path || '#'}
                      className="mega-menu__mobile-link"
                      onClick={closeMobileMenu}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default MegaMenu;