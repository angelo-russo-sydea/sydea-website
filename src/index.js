import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { AppProvider } from './services/translationContext';
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { msalConfig } from "./authConfig.js";
import { CookieBanner } from './components/cookie-banner/cookie-banner.js';
import { HelmetProvider } from 'react-helmet-async';
import "./pdfConfig";

const msalInstance = new PublicClientApplication(msalConfig);

if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

msalInstance.addEventCallback((event) => {
  if (
      (event.eventType === EventType.LOGIN_SUCCESS ||
        event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
        event.eventType === EventType.SSO_SILENT_SUCCESS) &&
        event.payload.account
  ) {
      msalInstance.setActiveAccount(event.payload.account);
  }
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
     <HelmetProvider>
        <AppProvider>
          <ScrollToTop/>
          <App instance={msalInstance}/>
          {/* <Footer /> */}
          {/* <CookieBanner /> */}
        </AppProvider>
      </HelmetProvider>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
