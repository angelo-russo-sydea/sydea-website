import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SeoHelmet = ({ title, description }) => {
  const location = useLocation();
  const currentLang = location.pathname.startsWith('/it') ? 'it' : 'en';
  const currentPath = location.pathname;

  const noIndexSuffixes = [
    '/title',
    '/desc',
    '/meta-title',
    '/meta-description',
    '/orderMenu'
  ];

  const isNoIndexPage = noIndexSuffixes.some(suffix => currentPath.endsWith(suffix));

  return (
    <Helmet>
      <html lang={currentLang} />
      <title>{title}</title>
      <meta name="description" content={description} />

      <link rel="alternate" hreflang="en" href="https://www.sydea.com/en" />
      <link rel="alternate" hreflang="it" href="https://www.sydea.com/it" />
      <link rel="alternate" hreflang="x-default" href="https://www.sydea.com/en" />

      {isNoIndexPage && <meta name="robots" content="noindex" />}
    </Helmet>
  );
};

export default SeoHelmet;


