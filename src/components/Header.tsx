// Header.tsx
import React from 'react';
import MegaMenu, { MenuItem } from './MegaMenu';
import { UserMenu } from './UserMenu';
import './Header.css';
import { timelineImages } from './images';


const menuData: MenuItem[] = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'Commissions',
    submenu: [
      {
        title: 'Moroccan Politics',
        description: 'Engaging with political developments and civic participation',
        image: timelineImages['mplogo.webp'],
        path: '/commissions#mp',
      },
      {
        title: 'International Relations',
        description: 'Fostering global partnerships and diplomatic engagement',
        image: timelineImages['irlogo.webp'],
        path: '/commissions#ir',
      },
      {
        title: 'Social Development',
        description: 'Advancing education, healthcare, and community welfare',
        image: timelineImages['sdlogo.webp'],
        path: '/commissions#sd',
      },
    ],
  },
  {
    label: 'DecryptMundi',
    path: '/decryptmundi',
  },
  {
    label: 'Gallery',
    path: '/gallery',
  },
  {
    label: 'Sponsors',
    path: '/sponsor',
  },
  {
    label: 'Contact',
    path: '/contact',
  },
];

const Header: React.FC = () => {
  return (
    <header className="header">
      <MegaMenu items={menuData} />
      <div className="header__spacer" />
      <UserMenu />
    </header>
  );
};

export default Header;