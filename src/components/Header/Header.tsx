import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import Categories from '../Utils/Categories';
import { GAEvent } from '../Utils/GA-Tracker';
import { ReactComponent as Logo } from '../../logo.svg';
import { ReactComponent as Title } from '../../assets/title.svg';
import Profiles from './Profiles';

interface headerProps {}

const Header: React.FunctionComponent<headerProps> = (_props: headerProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  // updating the url in browser's url bar if url is changed manually or page is refreshed
  // `useLocation` gives browser url
  const updateCategory = (categoryTag: string) => {
    navigate(`/${categoryTag}`);
    GAEvent('Header', 'Navigate_to', `/${categoryTag}`);
  };

  const routeCategoryTag = location.pathname.split('/')[1].trim();

  return (
    <header className='mcHeader'>
      <NavLink to='/' className='logoSection' aria-label='link to home page'>
        <Logo className='logo' />
        <Title className='brand-title' />
      </NavLink>
      <div className='actionSection'>
        <Categories
          onSelectCategory={updateCategory}
          routeCategoryTag={routeCategoryTag}
        />
        <Profiles />
      </div>
    </header>
  );
};

export default Header;
