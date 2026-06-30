// src/components/CatchLanguageRedirect.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const CatchLanguageRedirect = () => {
  const { pathname, search, hash } = useLocation();
  // lingua principale del browser
  const browserLang = navigator.language?.split('-')[0] || 'en';
  const lang = ['it', 'en'].includes(browserLang) ? browserLang : 'en';

  // ricostruisco il nuovo URL con query+hash
  const to = `/${lang}${pathname}${search}${hash}`;
  return <Navigate to={to} replace />;
};

export default CatchLanguageRedirect;
