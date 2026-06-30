import React, { useContext, useEffect, useState } from "react";
import "./cookie-banner.scss";
import { AppContext } from "../../services/translationContext";

export const CookieBanner = () => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const hasAcceptedCookies = document.cookie.split(';').some((item) => item.trim().startsWith('acceptedCookies='));
        setShowBanner(!hasAcceptedCookies);
        // if (hasAcceptedCookies) {
        //   setShowBanner(false);
        // }
      }, []);

  const { services: { TranslationsService } } = useContext(AppContext);

  const allowCookies = () => {
    setCookie('acceptedCookies', 'true', 365);
    setShowBanner(false);  
  }

  const declineCookies = () => {
    setCookie('acceptedCookies', 'false', 365);
    setShowBanner(false);
  }

  const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  };

  return (
    <>
    {
        showBanner && 
        <div id="main-banner-cookie">
          <div className="wrapper-cookie">
            <div className="cookie-banner">
              <svg id="cookieSvg" viewBox="0 0 526.27 539.57">
                <ellipse cx="260.51" cy="522.67" rx="176.84" ry="16.9" style={{fill:'#d1d0d1', strokeWidth:'0px'}}/>
                <circle cx="365.3" cy="45.75" r="35.62" style={{fill:'#de824a', strokeWidth:'0px'}}/>
                <circle cx="376.43" cy="146.24" r="21.15" style={{fill:'#de824a', strokeWidth:'0px'}}/>
                <circle cx="501.03" cy="153.06" r="23.2" style={{fill:'#de824a', strokeWidth:'0px'}}/>
                <path d="M501.03,272.35c0,4.07-.11,8.21-.33,12.43l-.04.59v.23c-3.68,68.77-34.75,129.55-82.11,172.37-44.57,40.33-103.62,64.7-167.79,64.7-4.27,0-8.57-.11-12.88-.33l-.59-.04h-.23c-68.77-3.68-129.55-34.75-172.37-82.11C24.38,395.58,0,336.51,0,272.24c0-4.22.11-8.46.32-12.72l.04-.59v-.23c3.72-68.68,35.84-129.73,84.24-172.87,43.77-39.04,100.86-63.35,162.21-65.31,2.36-.08,4.2,1.99,3.88,4.33-2.13,15.4-.92,29.89,3.47,42.52,5.02,14.36,14,26.21,26.84,34.36,1.36.86,2,2.49,1.64,4.06-6.15,26.7-5.17,50.9,1.46,71.36,5.04,15.56,13.29,28.94,24.13,39.69,10.84,10.75,24.23,18.74,39.51,23.5,20.24,6.29,43.79,6.95,69.11.7,1.43-.35,2.94.12,3.87,1.26,11.44,14.12,24.38,23.57,39.12,27.53,11.42,3.1,23.52,2.84,36.33-1.12,2.41-.75,4.87,1.07,4.87,3.6,0,.02,0,.04,0,.05Z" style={{fill:'#de824a', strokeWidth:'0px'}}/>
                <path d="M511.03,251.83c0,4.07-.11,8.21-.33,12.43l-.04.59v.23c-3.68,68.77-34.75,129.55-82.11,172.37-44.57,40.33-103.62,64.7-167.79,64.7-4.27,0-8.57-.11-12.88-.33l-.59-.04h-.23c-68.77-3.68-129.55-34.75-172.37-82.11C34.38,375.06,10,315.99,10,251.72c0-4.22.11-8.46.32-12.72l.04-.59v-.23c3.72-68.68,35.84-129.73,84.24-172.87C138.37,26.27,195.45,1.96,256.81,0c2.36-.08,4.2,1.99,3.88,4.33-2.13,15.4-.92,29.89,3.47,42.52,5.02,14.36,14,26.21,26.84,34.36,1.36.86,2,2.49,1.64,4.06-6.15,26.7-5.17,50.9,1.46,71.36,5.04,15.56,13.29,28.94,24.13,39.69,10.84,10.75,24.23,18.74,39.51,23.5,20.24,6.29,43.79,6.95,69.11.7,1.43-.35,2.94.12,3.87,1.26,11.44,14.12,24.38,23.57,39.12,27.53,11.42,3.1,23.52,2.84,36.33-1.12,2.41-.75,4.87,1.07,4.87,3.6,0,.02,0,.04,0,.05Z" style={{fill:'#f5b059', strokeWidth:'0px'}}/>
                <circle cx="208.19" cy="216.7" r="43.79" style={{fill:'#6d4310', strokeWidth:'0px'}}/>
                <circle cx="393.15" cy="356" r="37.46" style={{fill:'#6d4310', strokeWidth:'0px'}}/>
                <circle cx="97.34" cy="307.53" r="26.06" style={{fill:'#6d4310', strokeWidth:'0px'}}/>
                <circle cx="126.95" cy="138.08" r="11.66" style={{fill:'#6d4310', strokeWidth:'0px'}}/>
                <circle cx="203.82" cy="405.12" r="11.66" style={{fill:'#6d4310', strokeWidth:'0px'}}/>
                <circle cx="275.03" cy="318.55" r="14.52" style={{fill:'#6d4310', strokeWidth:'0px'}}/>
                <circle cx="369.97" cy="44.56" r="35.03" style={{fill:'#f5b059', strokeWidth:'0px'}}/>
                <circle cx="380.91" cy="143.39" r="20.8" style={{fill:'#f5b059', strokeWidth:'0px'}}/>
                <circle cx="503.45" cy="150.09" r="22.82" style={{fill:'#f5b059', strokeWidth:'0px'}}/>
              </svg>
              <p className="cookie-description" dangerouslySetInnerHTML={{ __html: TranslationsService.getCookieBannerText() }}></p>
              <div className="d-flex gap-4">
                <button className="accept-button fw-bold" onClick={allowCookies}>{TranslationsService.labels('allow')}</button>
                <button className="decline-button fw-bold" onClick={declineCookies}>{TranslationsService.labels('decline')}</button>
              </div>
            </div>
          </div>
        </div>
    }
    </>
  );
};
