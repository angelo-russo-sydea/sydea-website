import React, { useEffect, useContext } from 'react';
import { Outlet, Navigate, useParams, useLocation } from 'react-router-dom';
import { Menu } from '../components/menu/menu';
import StyleNavbar from '../components/style-navbar';

import SeoHelmet from '../components/SeoHelmet';
import { Footer } from '../components/footer/footer';
import { AppContext } from './translationContext';

const LanguageLayout = () => {
  const { lang } = useParams();

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith(`/${lang}/syd-admin`) || location.pathname.startsWith(`/${lang}/sydea-hub`);

  const { services: {TranslationsService} } = useContext(AppContext);

  useEffect(() => {
    document.documentElement.lang = lang;
    TranslationsService.setLanguageFromRouter(lang);
  }, [lang, TranslationsService]);

  // Se il parametro non è 'en' o 'it', redirigi alla lingua di default (ad es. 'en')
  if (lang !== 'en' && lang !== 'it') {
    return <Navigate to="/en" replace />;
  }

  // Titoli e description basati sulla lingua corrente
  const title =
    lang === 'it'
      ? "Sydea S.r.l. – Consulenza ERP e Soluzioni Digitali"
      : "Sydea S.r.l. – ERP Consulting and Digital Solutions";
  const description =
    lang === 'it'
      ? "Sydea S.r.l. offre consulenza ERP e soluzioni digitali a supporto delle imprese nella trasformazione digitale."
      : "Sydea S.r.l. provides ERP consulting and digital solutions to support businesses in their digital transformation journey.";

  return (
    <>
      <SeoHelmet title={title} description={description} />
      {!isAdminRoute && <Menu />}
      {!isAdminRoute && <StyleNavbar />}

      {/* Renderizza le route annidate */}
      <Outlet />

      {!isAdminRoute && <Footer />}
    </>
  );
};

export default LanguageLayout;
