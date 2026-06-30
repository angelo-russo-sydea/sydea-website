import React, { useContext } from 'react';
import './footer.scss';
import SydeaLogoLight from '../../assets/logo/sydea_w.svg';
import IndastriaLogoLight from '../../assets/logo/indastria-color-outline.svg';
import SydeaLogoLight10thAnniversary from '../../assets/logo/10th-anniversary-light.svg';
import { Link, useParams } from "react-router-dom";
import { AppContext } from '../../services/translationContext';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';

const currentYear = new Date().getFullYear();
const appOwner = process.env.REACT_APP_OWNER;

export const Footer = () => {
  const { lang } = useParams();

  const { services: {TranslationsService} } = useContext(AppContext);

  // const setSelectedLangue = (languSel) =>{
  //   TranslationsService.setLanguage(languSel);
  // }

  const { instance } = useMsal();
  // let activeAccount;

  // if (instance) {
  //   activeAccount = instance.getActiveAccount();
  // }

  const isAuthenticated = useIsAuthenticated();

  const signIn = () => {
    instance.loginRedirect().catch((error) => console.log(error));
    // instance.loginPopup().catch((error) => console.log(error));
  };

  return (
    <div className="footer p-3">

      <div className='container p-4 pb-0'>
        <div className='d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-center'>
          {
            appOwner === 'sydea' ?
            (
              <img src={SydeaLogoLight} className='footer-logo' alt={`${TranslationsService.getMainInfoCompany('name')} Logo`}></img>
              // <img src={SydeaLogoLight10thAnniversary} className='footer-logo' alt={`${TranslationsService.getMainInfoCompany('name')} Logo`}></img>
            )
            :
            (
              <img src={IndastriaLogoLight} className='footer-logo-indastria' alt={`${TranslationsService.getMainInfoCompany('name')} Logo`}></img>
            )
          }
          
          <div>
            <div className='d-flex flex-column gap-3'>
              {/* <div className="dropdown">
                <span className="btn-language text-deco-none dropdown-toggle px-3 py-2 d-flex gap-2 align-items-center dark-mode-text transition-03s-eio" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                  <span className={`fi fi-${TranslationsService.getGlobalValue(`available_language']['${TranslationsService.getCurrentLanguage()}']['flag`)}`}></span>
                  <span>{TranslationsService.getGlobalValue(`available_language']['${TranslationsService.getCurrentLanguage()}']['name`)}</span>
                </span>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  {
                    Object.keys(TranslationsService.getGlobalValue('available_language')).map((_langu,i) =>(
                      <li key={i} onClick={() => setSelectedLangue(_langu)}>
                        <span className="dropdown-item d-flex gap-2 align-items-center transition-03s-eio">
                          <span className={`fi fi-${TranslationsService.getGlobalValue(`available_language']['${_langu}']['flag`)}`}></span>
                          <span>{TranslationsService.getGlobalValue(`available_language']['${_langu}']['name`)}</span>
                        </span>
                      </li>
                    ))
                  }
                </ul>
              </div> */}
              {
                TranslationsService.itemFooter('email.show') &&
                <a href={`mailto:${TranslationsService.itemFooter('email.mail')}`} className="text-deco-none transition-03s-eio ref-offices-footer">{TranslationsService.itemFooter('email.mail')}</a>
              }
            </div>
          </div>
        </div>
        
        <div className='d-flex flex-column flex-sm-row py-3 justify-content-between'>
          <ul id='footer-items' className='d-flex flex-column flex-sm-row align-items-start align-items-sm-center m-0 p-0 gap-4'>
            {
              TranslationsService.itemFooter('elements.about') &&
              <li>
                <Link to={`/${lang}/about`} className='text-deco-none transition-03s-eio'>{TranslationsService.labels(`menu.about.label`)}</Link>
              </li>
            }
            {
              TranslationsService.itemFooter('elements.services') &&
              <li>
                <Link to={`/${lang}/services`} className='text-deco-none transition-03s-eio'>{TranslationsService.labels(`menu.services.label`)}</Link>
              </li>
            }
            {
              TranslationsService.itemFooter('elements.products') &&
              <li>
                <Link to={`/${lang}/products`} className='text-deco-none transition-03s-eio'>{TranslationsService.labels(`menu.products.label`)}</Link>
              </li>
            }
            {
              TranslationsService.itemFooter('elements.industries') &&
              <li>
                <Link to={`/${lang}/industries`} className='text-deco-none transition-03s-eio'>{TranslationsService.labels(`menu.industries.label`)}</Link>
              </li>
            }
            {
              TranslationsService.itemFooter('elements.insights') &&
              <li>
                <Link to={`/${lang}/insights`} className='text-deco-none transition-03s-eio'>Insights</Link>
              </li>
            }
            {
              TranslationsService.itemFooter('elements.careers') &&
              <li>
                <Link to={`/${lang}/careers`} className='text-deco-none transition-03s-eio'>{TranslationsService.labels(`menu.careers.label`)}</Link>
              </li>
            }
            {
              TranslationsService.itemFooter('elements.contacts') &&
              <li>
                <Link to={`/${lang}/contacts`} className='text-deco-none transition-03s-eio'>{TranslationsService.labels(`menu.contact-us.label`)}</Link>
              </li>
            }
            {
              TranslationsService.itemFooter('elements.privacy') &&
              <li>
                {/* <Link to='privacy-policy' className='text-deco-none transition-03s-eio'>Privacy Policy</Link> */}
                <a href={TranslationsService.getLinkCookieAndPrivacy('privacy')} target='_blank' className='transition-03s-eio'>Privacy Policy</a>
              </li>
            }
            {
              TranslationsService.itemFooter('elements.cookie') && TranslationsService.isShowCookie() &&
              <li>
                <a href={TranslationsService.getLinkCookieAndPrivacy('cookie')} target='_blank' className='transition-03s-eio'>Cookie Policy</a>
              </li>
            }
            {
                TranslationsService.sectionAvailable('sitemap') && TranslationsService.itemFooter('elements.sitemap') &&
                <li>
                  <Link to={`/${lang}/sitemap`} className='text-deco-none transition-03s-eio'>Sitemap</Link>
                </li>
            }
            {
              appOwner === 'sydea' && !isAuthenticated &&
              <li>
                <p className='text-deco-none transition-03s-eio m-0 link-footer-area' onClick={signIn}>Restricted Area</p>
              </li>
            }
          </ul>
          <div className='d-flex py-3 gap-3'>
          {
              TranslationsService.itemFooter('socialContacts.linkedin.status') &&
              <a href={TranslationsService.itemFooter('socialContacts.linkedin.link')} target='_blank' rel="noreferrer" className='social-link'>
                <img src={require('../../assets/social/linkedin.png')} className='logo-social' alt='Linkedin logo'></img>
              </a>
            }
            {
              TranslationsService.itemFooter('socialContacts.facebook.status') &&
              <a href={TranslationsService.itemFooter('socialContacts.facebook.link')} target='_blank' rel="noreferrer" className='social-link'>
                <img src={require('../../assets/social/facebook.png')} className='logo-social' alt='Facebook logo'></img>
              </a>
            }
            {
              TranslationsService.itemFooter('socialContacts.instagram.status') &&
              <a href={TranslationsService.itemFooter('socialContacts.instagram.link')} target='_blank' rel="noreferrer" className='social-link'>
                <img src={require('../../assets/social/instagram.png')} className='logo-social' alt='Instagram logo'></img>
              </a>
            }
            {
              TranslationsService.itemFooter('socialContacts.x.status') &&
              <a href={TranslationsService.itemFooter('socialContacts.x.link')} target='_blank' rel="noreferrer" className='social-link'>
                <img src={require('../../assets/social/x-logo.png')} className='logo-social' alt='X logo'></img>
              </a>
            }
            {
              TranslationsService.itemFooter('socialContacts.tiktok.status') &&
              <a href={TranslationsService.itemFooter('socialContacts.tiktok.link')} target='_blank' rel="noreferrer" className='social-link'>
                <img src={require('../../assets/social/tiktok.png')} className='logo-social' alt='TikTok logo'></img>
              </a>
            }
          </div>
        </div>

        {
           TranslationsService.itemFooter('showOffice') &&
           <div className='pt-3 d-flex gap-3 aling-items-center justify-content-center text-footer'>
            {
            TranslationsService.getOffice().map((office, ind) => (
              <div key={ind}>
                <a href={office.mapsLink || undefined} target='_blank' rel="noreferrer" className="text-deco-none transition-03s-eio ref-offices-footer">
                  {office.name}
                </a>
                {
                  TranslationsService.getOffice()?.length > (ind + 1) && 
                  <span className="px-2">|</span>
                }
              </div>
            ))}
           </div>
        }
        <div className='pt-3'>
          <p className='syd-paragraph text-center m-0 text-footer'>© {currentYear} { TranslationsService.itemFooter('text') }</p>
        </div>
      </div>
    </div>
  );
};