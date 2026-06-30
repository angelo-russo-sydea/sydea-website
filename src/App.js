import React, {useContext, useState, useMemo, useEffect} from 'react';
import './App.scss';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Home } from './pages/home/home';
import { Services } from './pages/services/services';
import { ServicesDetail } from './pages/services-detail/services-detail';
import { Industries } from './pages/industries/industries';
import { IndustriesDetail } from './pages/industries-detail/industries-detail';
import { About } from './pages/about/about';
import { Contacts } from './pages/contacts/contacts';
import { Insights } from './pages/insights/insights';
import { News } from './pages/news/news';
import { ClientStories } from './pages/client-stories/client-stories';
import { ClientStoriesDetail } from './pages/client-stories-detail/client-stories-detail';
import { Careers } from './pages/careers/careers';
import { TheRealSubmarine } from './pages/the-real-submarine/the-real-submarine';
import { RnD } from './pages/rnd/rnd';
import { NotFound } from './pages/not-found/not-found';
import { Partners } from './pages/partners/partners';
import { Roles } from './pages/roles/roles';
import { Admin } from './pages/admin/admin';
import { AppContext } from './services/translationContext';
import { Menu } from './components/menu/menu';

import { MsalProvider } from '@azure/msal-react';
import { Footer } from './components/footer/footer';
import { AdminLabels } from './pages/admin-labels/admin-labels';
import { AdminArticle } from './pages/admin-article/admin-article';
import { Certifications } from './pages/certifications/certifications';
import { PrivacyPolicy } from './pages/privacy-policy/privacy-policy';
import StyleNavbar from './components/style-navbar';
import { AdminList } from './pages/admin-list/admin-list';
import { NewsDetail } from './pages/news-detail/news-detail';
import { Sitemap } from './pages/sitemap/sitemap';
import { Products } from './pages/products/products';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AdminLabelsJson } from './pages/admin-labels-json/admin-labels-json';
import { SydeaInternalNews } from './pages/sydea-internal-news/sydea-internal-news';
import { SydeaHub } from './pages/sydea-hub/sydea-hub';
import { CookieBanner } from './components/cookie-banner/cookie-banner';
import { OrganizationalChart } from './pages/org-chart/org-chart';
import SydeaLogoLight from './assets/logo/sydea_w.svg';
import { SydeaWall } from './pages/sydea-wall/sydea-wall';
import { CorporateEvent } from './pages/corporate-event/corporate-event';
import SeoHelmet from './components/SeoHelmet';
import LanguageLayout from './services/languageLayout';
import DefaultLanguageRedirect from './services/defaultLanguageRedirect';
import { SydeaKnowledgeBase } from './pages/sydea-knowledge-base/sydea-knowledge-base';
import { SydeaKnowledgeBaseSharepoint } from './pages/sydea-knowledge-base/sydea-knowledge-base-sharepoint';
import { SalesTerms } from './pages/sales-terms/sales-terms';
import { AdminLabelsPreview } from './pages/admin-labels-preview/admin-labels-preview';
import { VirtualNoticeboard } from './components/virtual-noticeboard/virtual-noticeboard';
import { Events } from './pages/events/events';
import { SydeaKnowledgeBaseAdmin } from './pages/sydea-knowledge-base/sydea-knowledge-admin';
import { Solutions } from './pages/solutions/solutions';
import { SolutionsDetail } from './pages/solutions-detail/solutions-detail';
import { Meet } from './pages/meet/meet';
import { MeetEntry } from './components/meetentry';

const pathUrl = process.env.REACT_APP_BASE_URL;
const appOwner = process.env.REACT_APP_OWNER;

const Pages = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/syd-admin') || location.pathname.startsWith('/sydea-hub');
  
  const { services: {TranslationsService} } = useContext(AppContext);

  return (
    <>
      <Routes>
        {/* <Route path="/" element={<Navigate to="/en" replace />} /> */}
        <Route path="/" element={<DefaultLanguageRedirect />} />
        {/* <Route path="/" exact element={<Home />} /> */}
        <Route path="/meet" element={<MeetEntry />} />

        <Route path="/:lang" element={<LanguageLayout />}>
          <Route index element={<Home />} />

          {
            TranslationsService.sectionAvailable('services') &&
            <Route path="services">
              <Route index={true} exact element={<Services />}></Route>
              <Route path=":area_id/:service_id?" exact element={<ServicesDetail />} />
              <Route path=":area_id/:sub_area/:service_id?" exact element={<ServicesDetail />} />
            </Route>
          }
            <Route path="solutions">
              <Route index={true} exact element={<Solutions />}></Route>
              <Route path=":solution_id/" exact element={<SolutionsDetail />} />
            </Route>
          {
            TranslationsService.sectionAvailable('industries') &&
            <Route path="industries">
              <Route index={true} exact element={<Industries />}></Route>
              <Route path=":industries_id" exact element={<IndustriesDetail />} />
            </Route>
          }
          {
            TranslationsService.sectionAvailable('products') &&
            <Route path="products">
              <Route index={true} exact element={<Products />}></Route>
              {/* <Route path=":products_id" exact element={<ProductsDetail />} /> */}
            </Route>
          }
          {
            TranslationsService.sectionAvailable('about') &&
            <Route path="about">
              <Route index={true} exact element={<About />}></Route>
              {/* <Route path="the-real-submarine" exact element={<TheRealSubmarine />} /> */}
              {
                TranslationsService.childMenuAvailable('aboutSections.r&d') && 
                <Route path="rnd" exact element={<RnD />} />
              }
              {
                TranslationsService.childMenuAvailable('aboutSections.partners') && 
                <Route path="our-partners" exact element={<Partners />} />
              }
              {
                TranslationsService.childMenuAvailable('aboutSections.certifications') && 
                <Route path="our-certifications" exact element={<Certifications />} />
              }
            </Route>
          }
          {
            TranslationsService.sectionAvailable('contacts') &&
            <Route path="contacts" exact element={<Contacts />} />
          }
          {/* <Route path="sydea-blog">
            <Route index={true} exact element={<News />}></Route>
            <Route path=":news_id" exact element={<NewsDetail />} />
          </Route> */}
          {
            TranslationsService.sectionAvailable('insights') &&
            <Route path="insights">
              <Route index={true} exact element={<Insights />}></Route>
              {
                TranslationsService.childMenuAvailable('insightsSections.blog') && 
                <>
                  <Route path="blog" exact element={<News />} />
                  <Route path="blog/:news_id" exact element={<NewsDetail />} />
                </>
              }
                {/* <>
                  <Route path="blog" exact element={<News />} />
                  <Route path="blog/:news_id" exact element={<NewsDetail />} />
                </> */}
              {
                TranslationsService.childMenuAvailable('insightsSections.client-stories') && 
                <>
                  <Route path="client-stories" exact element={<ClientStories />} />
                  <Route path="client-stories/:story_id" exact element={<ClientStoriesDetail />} />
                </>
              }
              <Route path="events" exact element={<Events />} />
            </Route>
          }
          {
            TranslationsService.sectionAvailable('careers') &&
            <Route path="careers">
              <Route index={true} exact element={<Careers />}></Route>
              <Route path="roles" exact element={<Roles />} />
            </Route>
          }
          <Route path="meet">
            <Route index={true} exact element={<Meet />}></Route>
          </Route>
          <Route path="sales_terms">
            <Route index={true} exact element={<SalesTerms />}></Route>
          </Route>
          <Route path="syd-admin">
            <Route index={true} exact element={<Admin />}></Route>
            <Route path="dashboard" exact element={<AdminDashboard />} />
            <Route path="labels" exact element={<AdminLabels />} />
            <Route path="labels-json" exact element={<AdminLabelsJson />} />
            <Route path="labels-preview" exact element={<AdminLabelsPreview />} />
            <Route path="knowledge-base-admin" exact element={<SydeaKnowledgeBaseAdmin />} />
            {
              appOwner !== 'indastria' &&
                <>
                  <Route path=":id_group" exact element={<AdminList />} />
                  <Route path=":id_group/editor" exact element={<AdminArticle />} />
                </>
            }
          </Route>
          {
            appOwner === 'sydea' &&
            <Route path="sydea-hub">
              <Route index={true} exact element={<SydeaHub />}></Route>
              {/* <Route path="news-and-communications" exact element={<SydeaInternalNews />} /> */}
              {/* <Route path="news-and-communications/:news_id" exact element={<SydeaInternalNews />} /> */}
              <Route path="org-chart" exact element={<OrganizationalChart />} />
              {/* <Route path="sydea-wall" exact element={<SydeaWall />} /> */}
              {/* <Route path="sydea-knowledge-base" exact element={<SydeaKnowledgeBase />} /> */}
              <Route path="sydea-knowledge-base">
                <Route index element={<SydeaKnowledgeBase />} />
                <Route path=":category" element={<SydeaKnowledgeBase />} />
                <Route path=":category/:subcategory" element={<SydeaKnowledgeBase />} />
                <Route path=":category/:subcategory/:doc" element={<SydeaKnowledgeBase />} />
              </Route>
              <Route path="sydea-knowledge-base-sharepoint" exact element={<SydeaKnowledgeBaseSharepoint />} />
              <Route path="sydea-corporate-event" exact element={<CorporateEvent />} />
              <Route path="virtual-noticeboard" exact element={<VirtualNoticeboard />} />
            </Route>
          }
          
          {/* {
            TranslationsService.sectionAvailable('privacy') &&
            <Route path="privacy-policy" exact element={<PrivacyPolicy />} />
          } */}
          {
            TranslationsService.sectionAvailable('sitemap') &&
            <Route path="sitemap" exact element={<Sitemap />} />
          }
        </Route>

        <Route path='*' element={<NotFound />}/>
      </Routes>
      {/* {!isAdminRoute && <Footer />} */}
    </>
  );
};

const App = ({ instance }) => {
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const { services: {TranslationsService} } = useContext(AppContext);
  const [language, setLanguage] = useState('it');  // Stato per la lingua


  // useEffect(() => {
  //   fetch(`${pathUrl}/static/style.json?_cache_buster=${new Date().getTime()}`)
  //   .then(response => response.json())
  //   .then(data => {
  //    TranslationsService.setMainDataStyle(data);
  //  });
  //   fetch(`${pathUrl}/static/label.json?_cache_buster=${new Date().getTime()}`)
  //  .then(response => response.json())
  //  .then(data => {
  //   TranslationsService.setLabelsList(data);
  //   setLoading(true);
  //   if (TranslationsService.isShowCookie()) {
  //     setShowCookieBanner(true);
  //   }
  // });
  // }, [TranslationsService]);

  useEffect(() => {
    // const savedLanguage = localStorage.getItem('language') || 'it';
    // setLanguage(savedLanguage);  // Impostiamo la lingua
    // TranslationsService.setLanguage(savedLanguage);
    
    const baseUrl = window.location.origin;
    let currentPathUrl = pathUrl;

    if (baseUrl === 'https://www.sydea.com') {
      currentPathUrl = baseUrl;
    }
    setLoading(true);
    setShowAll(false);
    fetch(`${currentPathUrl}/static/style.json?_cache_buster=${new Date().getTime()}`)
    .then(response => response.json())
    .then(data => {
     TranslationsService.setMainDataStyle(data);
   });
    fetch(`${currentPathUrl}/static/label.json?_cache_buster=${new Date().getTime()}`)
   .then(response => response.json())
   .then(data => {
    TranslationsService.setLabelsList(data);
    // setLoading(true);
    setTimeout(() => {
      setShowAll(true);
    }, 200);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    if (TranslationsService.isShowCookie()) {
      setShowCookieBanner(true);
    }
  });
  }, [TranslationsService]);

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/syd-admin') || location.pathname.startsWith('/sydea-hub');
  
  return (
      <MsalProvider instance={instance}>
        <div className={`loader-sydea ${loading ? '':'hidden'}`}>
          <div className="box-loader-intro">
            <img src={SydeaLogoLight} style={{width:'20vw'}} alt='Sydea Logo'></img>
            <div className="loader"></div>
          </div>
        </div>
        {
          showAll && (
            <>
              {/* <SeoHelmet
                title="Sydea S.r.l. – ERP Consulting and Digital Solutions"
                description="Sydea S.r.l. provides ERP consulting and digital solutions to support businesses in their digital transformation journey."
              /> */}
              {/* {!isAdminRoute && <Menu />}
              {!isAdminRoute && <StyleNavbar />} */}
              {/* <ScrollButton /> */}
              {showCookieBanner && <CookieBanner />}
              <Pages />
            </>
          )
        }


      </MsalProvider>
  );
};

export default App;
