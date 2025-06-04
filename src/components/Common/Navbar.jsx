import React, { useCallback, useEffect, useState } from 'react';
import { navMenus } from '../../utils/menuList';
import { Link, useLocation } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const path = useLocation();
  const isActive = (idx) => path.pathname === idx;
  const googleClientId = import.meta.env.VITE_AUTH_CLIENT_ID;
  const user = useSelector((state) => state.auth.authData);
  const dispatch = useDispatch();
  const { name } = user || {};
  const [isAuth, setIsAuth] = useState(!!name);

  // useCallback 사용 이유: 함수 재생성 방지, 성능 최적화
  const handleLoginSuccess = useCallback(
    (credentialResponse) => {
      try {
        const decoded = jwtDecode(credentialResponse.credential);
        dispatch(login({ authData: decoded }));
        setIsAuth(true);
      } catch (error) {
        console.error('Google Login Error', error);
      }
    },
    [dispatch]
  );

  const handleLogoutClick = () => {
    dispatch(logout());
    setIsAuth(false);
  };

  // useEffect(() => {
  //   const storedAuthData = JSON.parse(localStorage.getItem('authData'));
  //   console.log(storedAuthData);
  // }, [dispatch]);

  const handleLoginError = (error) => {
    console.log('Google Login Error', error);
  };
  return (
    <nav className="bg-[#212121] w-1/5 h-full rounded-sm border border-gray-500 py-10 px-4 flex flex-col justify-between items-center">
      <div className="logo-wrapper flex w-full items-center justify-center gap-8">
        <div className="logo"></div>
        <h2 className="font-semibold text-xl">
          <Link to="/">MARSHALL</Link>
        </h2>
      </div>
      <ul className="menus">
        {navMenus.map((menu, idx) => (
          <li
            key={idx}
            className={`rounded-sm mb-1 border border-gray-700 hover:bg-gray-950 transition-all duration-300 ${
              isActive(menu.to) ? 'bg-gray-950' : ''
            }`}
          >
            <Link to={menu.to} className="flex gap-x-4 items-center py-2 px-10">
              {menu.icon} {menu.label}
            </Link>
          </li>
        ))}
      </ul>

      {isAuth ? (
        <div className="w-4/5 flex items-center">
          <button
            className="flex justify-center items-center gap-2 bg-gray-300 text-gray-900 py-3 px-4 rounded-md w-full"
            onClick={handleLogoutClick}
          >
            <FcGoogle className="w-5 h-5" />
            <span className="text-sm">{name}님 로그아웃</span>
          </button>
        </div>
      ) : (
        <div className="auth-wrapper flex justify-center w-4/5 login-btn">
          <GoogleOAuthProvider clientId={googleClientId}>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
            />
            <button className="flex justify-center items-center gap-2 bg-gray-300 text-gray-900 py-3 px-4 rounded-md w-full">
              <FcGoogle className="w-5 h-5" />
              <span className="text-sm">Google Login</span>
            </button>
          </GoogleOAuthProvider>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
