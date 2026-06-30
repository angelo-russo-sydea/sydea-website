// // src/components/DefaultLanguageRedirect.js
// import React, { useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';

// const DefaultLanguageRedirect = () => {
//   const [lang, setLang] = useState(null);

//   useEffect(() => {
//     // Solo in client
//     if (typeof navigator === 'undefined') return;

//     // Prendi la lingua del browser, fallback su "en"
//     const browserLang = navigator.language?.split('-')[0] || 'en';
//     const chosen = ['it', 'en'].includes(browserLang) ? browserLang : 'en';

//     console.log('[i] browserLang:', browserLang, '→ redirect to', chosen);
//     setLang(chosen);
//   }, []);

//   // Fino a quando non abbiamo deciso, non renderizzo nulla
//   if (!lang) return null;

//   return <Navigate to={`/${lang}`} replace />;
// };

// export default DefaultLanguageRedirect;
// src/components/DefaultLanguageRedirect.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const DefaultLanguageRedirect = () => {
  const [lang, setLang] = useState(null);

  useEffect(() => {
    const browserLang = navigator.language?.split('-')[0] || 'en';
    const chosen = ['it', 'en'].includes(browserLang) ? browserLang : 'en';
    setLang(chosen);
  }, []);

  if (!lang) return null;           // aspetta il browserLang
  return <Navigate to={`/${lang}`} replace />;
};

export default DefaultLanguageRedirect;
