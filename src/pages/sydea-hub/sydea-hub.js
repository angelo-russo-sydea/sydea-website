import React, { useState, useEffect, useMemo } from 'react';
import "./sydea-hub.scss";
import { Link, useSearchParams, useNavigate, useParams } from "react-router-dom";
import { MsalAuthenticationTemplate } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LoginIcon from '@mui/icons-material/Login';
import Typography from '@mui/material/Typography';
import FolderImage from '../../assets/image/folder-img.svg';
import Marquee from "react-fast-marquee";
import SydeaLogoNewsComm from '../../assets/logo/sydea-logo-news-comm.svg';
import SydeaLogoNewsCommCompact from '../../assets/logo/sydea-logo-news-comm-compact.svg';
import SharepointLogo from '../../assets/other/sharepoint.svg';
import OdooLogo from '../../assets/other/odoo.svg';
import EasyredmineLogo from '../../assets/other/easyredmine.svg';
import axios from "axios";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import news from "../../../src/template/hub-news.json";
import LanguageDropdown from '../../components/menu/menu';

const pathUrl = process.env.REACT_APP_BASE_URL;
// const testText = "<p>We are excited to welcome <b>Andrea Bozzaotra</b> and <b>Alex Tinella</b>, who join the Sydea family as of today!</p><p>Both join our team of <b>SAP consultants</b> in the Naples office. <br/>Andrea joins from Francesco Agrillo's team, while Alex will be managed by Pietro Natale</p><p>They both boast a young age, once again confirming Sydea's willingness to invest in young talent.</p><p>We are happy to have them with us and wish them a path full of growth and satisfaction.</p><div style='display:flex; gap: 2rem;'><div style='width:20%;'><img src='https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/a.bozzaotra.circle.png' style='width:100%'/><p style='text-align:center;'><b>Andrea Bozzaotra</b></p></div><div style='width:20%;'><img src='https://s3.eu-west-1.amazonaws.com/www.sydea.it/static/people/a.tinella.circle.png' style='width:100%'/><p style='text-align:center;'><b>Alex Tinella</b></p></div></div>";

export const SydeaHub = () => {
  const { lang } = useParams();
  const { instance, accounts } = useMsal();
  let activeAccount;

  if (instance) {
    activeAccount = instance.getActiveAccount();
  }

  document.title = 'Sydea Hub';

  const signOut = () => {
    instance.logoutRedirect();
  };

  const signIn = () => {
    instance.loginRedirect().catch((error) => console.log(error));
  };

  const [marqueeNews, setMarqueeNews] = useState({});
  const [newsList, setNewsList] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showFormNewIdea, setShowFormNewIdea] = useState(false);
  const [userData, setUserData] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState('2026');
  const [years, setYears] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${pathUrl}/static/internal-news/news-int.json?_cache_buster=${new Date().getTime()}`, {
        cache: 'no-store',
      });
      const data = await response.json();
      const list = data[lang];
      setNewsList(list);
      const titlesAndDates = list.map(item => ` <div style='height:20px; width:3px; background-color:#fece2f; margin: 0 20px;'></div> <span><span style='text-transform:uppercase'><b>${item.title}</b></span> - ${formatDate(item.date)}</span>`).join('  ');
      setMarqueeNews(titlesAndDates);

      const uniqueYears = Array.from(new Set(list.map(item => {
        const [, , year] = item.date.split('/');
        return year;
      }))).sort((a,b) => b - a);
      setYears(uniqueYears);
    };
  
    fetchData();
  }, [pathUrl, lang]);

  const filteredNews = useMemo(() => {
  //   return newsList.filter(news => {
  //     const [, , year] = news.date.split('/');
  //     const matchYear = selectedYear === 'All' || year === selectedYear;
  //     const matchLocation = userData?.officeLocation ? news.group.includes(userData.officeLocation) : true;
  //     return matchYear && matchLocation;
  //   });
  // }, [newsList, selectedYear, userData]);
    if (!newsList.length) return [];

    // 1️⃣ Trova l'anno più recente presente in tutte le news
    const allYears = newsList.map(n => n.date.split('/')[2]); // ["2026", "2025", ...]
    const mostRecentYear = allYears.sort((a,b) => b - a)[0];  // "2026"

    // 2️⃣ Trova le news dell'anno più recente
    const newsMostRecentYear = newsList.filter(n => n.date.split('/')[2] === mostRecentYear);

    // 3️⃣ Trova la news più recente in quell'anno (per data)
    const mostRecentNews = newsMostRecentYear.sort((a,b) => {
      // Converto in formato YYYYMMDD per confronto semplice
      const aDate = a.date.split('/').reverse().join(''); // "20260209"
      const bDate = b.date.split('/').reverse().join('');
      return bDate.localeCompare(aDate);
    })[0];

    return newsList.filter(news => {
      const [, , year] = news.date.split('/');
      const matchYear = selectedYear === 'All' || year === selectedYear;
      const matchLocation = userData?.officeLocation
        ? news.group.some(g => g.toLowerCase() === userData.officeLocation.toLowerCase())
        : true;

      // const isMostRecentNews = mostRecentNews && news.id === mostRecentNews.id;

      // return matchYear && matchLocation && !isMostRecentNews;
      return matchYear && matchLocation;
    });
  }, [newsList, selectedYear, userData]);

  useEffect(() => {
    const newsId = searchParams.get("newsid");
    if (newsId) {
      const newsItem = newsList.find((item) => item.id === newsId);
      if (newsItem) {
        setSelectedNews(newsItem);
        setShowFormNewIdea(true);
      } else {
        setSelectedNews(null);
        setShowFormNewIdea(false);
      }
    } else {
      setSelectedNews(null);
      setShowFormNewIdea(false);
    }
  }, [searchParams, newsList]);

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    const date = new Date(`${year}-${month}-${day}`);
    const locale = lang === 'it' ? 'it-IT' : 'en-GB';
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const showSelectedNews = (news) => {
    navigate(`?newsid=${news.id}`);
  }

  const handleCancel = () => {
    setSelectedNews(null);
    setShowFormNewIdea(false);
    navigate(window.location.pathname, { replace: true });
  };

  useEffect(() => {
    if (accounts.length > 0) {
      getUserData();
    }
  }, [accounts]);

  const getUserData = async () => {
    if (accounts.length > 0) {
      const request = {
        scopes: ["User.Read"],
        account: accounts[0]
      };
  
      try {
        const authResult = await instance.acquireTokenSilent(request);
        const response = await axios.get(
          "https://graph.microsoft.com/v1.0/me",
          { headers: { Authorization: `Bearer ${authResult.accessToken}` } }
        );
        const user = response.data;
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };
  
  return (
    <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
      <div className='section-home light position-relative p-4'>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="fixed" style={{backgroundColor:'#141414'}}>
            <Toolbar className='justify-content-between'>
              <IconButton variant="outlined" style={{color:'#ffffff', borderColor:'#ffffff'}} className="me-3 showMobile">
                <Link to={`/${lang}`}  className="text-deco-none" style={{color:'#ffffff'}}>
                  <ArrowBackIosIcon/>
                </Link>
              </IconButton>
                
              <Link to={`/${lang}`}  className="text-deco-none showDesktop" style={{color:'#ffffff'}}>
                <Button variant="outlined" startIcon={<ArrowBackIosIcon />} style={{color:'#ffffff', borderColor:'#ffffff'}} className="me-3">
                  <span className='px-1'>Home</span>
                </Button>
              </Link>
              <div className='d-flex gap-4 align-items-center'>
                <div className='drop-langu-admin'>
                  <LanguageDropdown />
                </div>

                  <div className='d-flex gap-3 align-items-center'>
                  {
                  activeAccount && 
                    <div>
                      <Typography variant="p" component="div" sx={{ flexGrow: 1 }}>
                        <p className='fw-bold text-uppercase m-0 fs-sm-6 fs-md-5 p-0' style={{lineHeight:'normal'}}>{activeAccount.name}</p>
                        <p className='m-0 p-0 fs-6' style={{lineHeight:'normal'}}>{activeAccount.username}</p>
                      </Typography>
                    </div>
                  }
                  <div>
                    {
                      activeAccount ?
                      (
                        <IconButton aria-label="delete" style={{color:'#ffffff'}} onClick={signOut}>
                          <LogoutIcon />
                        </IconButton>
                      )
                      :
                      (
                        <IconButton aria-label="delete" style={{color:'#ffffff'}} onClick={signIn}>
                          <LoginIcon />
                        </IconButton>
                      )
                    }
                  </div>
                </div>
              </div>
            </Toolbar>
          </AppBar>
        </Box>
        <div style={{height:'60px'}}></div>

        {/* <div className='container-marquee-news'>
          <div className='position-relative'>
            <div className='box-news-marquee'>
              <img src={SydeaLogoNewsCommCompact} alt='Sydea Logo News & Communications'></img>
            </div>
            <Marquee autoFill={true} gradient={true} pauseOnHover={true} gradientColor='#f6f6f6' speed={30} className='news-marquee'>
              <div dangerouslySetInnerHTML={{ __html: marqueeNews }} className='d-flex align-items-center'></div>
            </Marquee>
          </div>
        </div> */}

        <div className='row gap-3'>
          <a className='folder-hub folder-var-3 py-2 px-3' href='https://sydea.sharepoint.com/Shared%20Documents/Forms/AllItems.aspx' target='_blank'>
            <div className='d-flex align-items-center gap-2'>
              <img src={SharepointLogo} className='service-hub-logo'></img>
            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20px" height="20px" viewBox="0 0 32 32">
              <path d="M27 21.75c-0.795 0.004-1.538 0.229-2.169 0.616l0.018-0.010-2.694-2.449c0.724-1.105 1.154-2.459 1.154-3.913 0-1.572-0.503-3.027-1.358-4.212l0.015 0.021 3.062-3.062c0.57 0.316 1.249 0.503 1.971 0.508h0.002c2.347 0 4.25-1.903 4.25-4.25s-1.903-4.25-4.25-4.25c-2.347 0-4.25 1.903-4.25 4.25v0c0.005 0.724 0.193 1.403 0.519 1.995l-0.011-0.022-3.062 3.062c-1.147-0.84-2.587-1.344-4.144-1.344-0.868 0-1.699 0.157-2.467 0.443l0.049-0.016-0.644-1.17c0.726-0.757 1.173-1.787 1.173-2.921 0-2.332-1.891-4.223-4.223-4.223s-4.223 1.891-4.223 4.223c0 2.332 1.891 4.223 4.223 4.223 0.306 0 0.605-0.033 0.893-0.095l-0.028 0.005 0.642 1.166c-1.685 1.315-2.758 3.345-2.758 5.627 0 0.605 0.076 1.193 0.218 1.754l-0.011-0.049-0.667 0.283c-0.78-0.904-1.927-1.474-3.207-1.474-2.334 0-4.226 1.892-4.226 4.226s1.892 4.226 4.226 4.226c2.334 0 4.226-1.892 4.226-4.226 0-0.008-0-0.017-0-0.025v0.001c-0.008-0.159-0.023-0.307-0.046-0.451l0.003 0.024 0.667-0.283c1.303 2.026 3.547 3.349 6.1 3.349 1.703 0 3.268-0.589 4.503-1.574l-0.015 0.011 2.702 2.455c-0.258 0.526-0.41 1.144-0.414 1.797v0.001c0 2.347 1.903 4.25 4.25 4.25s4.25-1.903 4.25-4.25c0-2.347-1.903-4.25-4.25-4.25v0zM8.19 5c0-0.966 0.784-1.75 1.75-1.75s1.75 0.784 1.75 1.75c0 0.966-0.784 1.75-1.75 1.75v0c-0.966-0.001-1.749-0.784-1.75-1.75v-0zM5 22.42c-0.966-0.001-1.748-0.783-1.748-1.749s0.783-1.749 1.749-1.749c0.966 0 1.748 0.782 1.749 1.748v0c-0.001 0.966-0.784 1.749-1.75 1.75h-0zM27 3.25c0.966 0 1.75 0.784 1.75 1.75s-0.784 1.75-1.75 1.75c-0.966 0-1.75-0.784-1.75-1.75v0c0.001-0.966 0.784-1.749 1.75-1.75h0zM11.19 16c0-0.001 0-0.002 0-0.003 0-2.655 2.152-4.807 4.807-4.807 1.328 0 2.53 0.539 3.4 1.409l0.001 0.001 0.001 0.001c0.87 0.87 1.407 2.072 1.407 3.399 0 2.656-2.153 4.808-4.808 4.808s-4.808-2.153-4.808-4.808c0-0 0-0 0-0v0zM27 27.75c-0.966 0-1.75-0.784-1.75-1.75s0.784-1.75 1.75-1.75c0.966 0 1.75 0.784 1.75 1.75v0c-0.001 0.966-0.784 1.749-1.75 1.75h-0z"/>
            </svg> */}
              <p className='m-0 fw-bold title-folder'>Sharepoint</p>
              <svg viewBox="0 0 7.48 11.59" className='icon-arrow arrow-folder ms-2'><polyline className="arrow-all transition-03s-eio" stroke='currentColor' points="1 1 6.48 5.8 1 10.59"/></svg>
            </div>
          </a>
          <a className='folder-hub folder-var-2 py-2 px-3' href='https://erm.sydea.it' target='_blank'>
            <div className='d-flex align-items-center gap-2'>
              <img src={EasyredmineLogo} className='service-hub-logo'></img>
              {/* <svg fill="currentColor" width="20px" height="20px" viewBox="0 0 567.23 595.71">
                <rect x="14.35" y="14.35" width="538.52" height="567" style={{fill:'none', stroke:'#000', strokeMiterlimit:10, strokeWidth:'40px'}}/>
                <line x1="13.48" y1="312.35" x2="555.48" y2="312.35" style={{fill:'none', stroke:'#000', strokeMiterlimit:10, strokeWidth:'29.85px'}} />
                <line x1="13.48" y1="154.35" x2="555.48" y2="154.35" style={{fill:'none', stroke:'#000', strokeMiterlimit:10, strokeWidth:'29.85px'}} />
                <path d="M74.48,448.92c0-21.22,17.07-38.44,38.44-38.44s38.44,17.07,38.44,38.44-17.07,38.44-38.44,38.44-38.44-17.07-38.44-38.44Z"/></svg> */}
              <p className='m-0 fw-bold title-folder'>Redmine</p>
              <svg viewBox="0 0 7.48 11.59" className='icon-arrow arrow-folder ms-2'><polyline className="arrow-all transition-03s-eio" stroke='currentColor' points="1 1 6.48 5.8 1 10.59"/></svg>
            </div>
          </a>
          <a className='folder-hub folder-var-1 py-2 px-3' href='https://erp.sydea.it/web#cids=1&action=menu' target='_blank'>
            <div className='d-flex align-items-center gap-2'>
              <img src={OdooLogo} className='service-hub-logo'></img>
              {/* <svg fill="currentColor" width="20px" height="20px" viewBox="0 0 567.23 595.71">
                <rect x="14.35" y="14.35" width="538.52" height="567" style={{fill:'none', stroke:'#000', strokeMiterlimit:10, strokeWidth:'40px'}}/>
                <line x1="13.48" y1="312.35" x2="555.48" y2="312.35" style={{fill:'none', stroke:'#000', strokeMiterlimit:10, strokeWidth:'29.85px'}} />
                <line x1="13.48" y1="154.35" x2="555.48" y2="154.35" style={{fill:'none', stroke:'#000', strokeMiterlimit:10, strokeWidth:'29.85px'}} />
                <path d="M74.48,448.92c0-21.22,17.07-38.44,38.44-38.44s38.44,17.07,38.44,38.44-17.07,38.44-38.44,38.44-38.44-17.07-38.44-38.44Z"/></svg> */}
              <p className='m-0 fw-bold title-folder'>Odoo</p>
              <svg viewBox="0 0 7.48 11.59" className='icon-arrow arrow-folder ms-2'><polyline className="arrow-all transition-03s-eio" stroke='currentColor' points="1 1 6.48 5.8 1 10.59"/></svg>
            </div>
          </a>
          <Link className='folder-hub folder-var-4 py-2 px-3' to='org-chart'>
            <div className='d-flex align-items-center gap-2'>
              <svg width="20px" height="20px" viewBox="0 0 830.54 599.71" fill="currentColor">
                <rect x="291.22" y="14.35" width="248.1" height="166.01" style={{fill:'none', stroke:'#000', strokeLinecap:'round', strokeLinejoin:'round', strokeWidth:'40px'}} />
                <rect x="14.35" y="463.21" width="182.55" height="122.15" style={{fill:'none', stroke:'#000', strokeLinecap:'round', strokeLinejoin:'round', strokeWidth:'40px'}} />
                <rect x="323.99" y="463.21" width="182.55" height="122.15" style={{fill:'none', stroke:'#000', strokeLinecap:'round', strokeLinejoin:'round', strokeWidth:'40px'}} />
                <rect x="633.63" y="463.21" width="182.55" height="122.15" style={{fill:'none', stroke:'#000', strokeLinecap:'round', strokeLinejoin:'round', strokeWidth:'40px'}} />
                <line x1="415.27" y1="180.36" x2="415.27" y2="457.99" style={{fill:'none', stroke:'#000', strokeLinecap:'round', strokeLinejoin:'round', strokeWidth:'40px'}} />
                <line x1="105.63" y1="463.71" x2="105.63" y2="319.17" style={{fill:'none', stroke:'#000', strokeLinecap:'round', strokeLinejoin:'round', strokeWidth:'40px'}} />
                <polyline points="724.91 463.71 724.91 319.17 415.27 319.17 105.63 319.17" style={{fill:'none', stroke:'#000', strokeLinecap:'round', strokeLinejoin:'round', strokeWidth:'40px'}} />
                </svg>
              <p className='m-0 fw-bold title-folder'>Org Chart</p>
              <svg viewBox="0 0 7.48 11.59" className='icon-arrow arrow-folder ms-2'><polyline className="arrow-all transition-03s-eio" stroke='currentColor' points="1 1 6.48 5.8 1 10.59"/></svg>
            </div>
          </Link>
          <Link className='folder-hub folder-var-6 py-2 px-3' to='sydea-knowledge-base'>
            <div className='d-flex align-items-center gap-2'>
              <svg viewBox="0 0 400 395.06" width="20px" height="20px" fill="currentColor">
                <path id="path16718" d="M36.09,0v274.98l163.27,78.08,162.98-78.03V.17l-164.86,80.56L36.09,0ZM0,34.84v263.38l200.53,96.84,199.47-98.15V36.09h-21.89v247.24l-177.81,87.41L21.89,284.33V34.84H0ZM340.45,35.23v225.89l-130.28,61.86V99.72l130.28-64.49ZM57.99,35.4l130.28,64.31v223.26l-130.28-61.81V35.4Z"/>
              </svg>
              <p className='m-0 fw-bold title-folder'>Knowledge Base</p>
              <svg viewBox="0 0 7.48 11.59" className='icon-arrow arrow-folder ms-2'><polyline className="arrow-all transition-03s-eio" stroke='currentColor' points="1 1 6.48 5.8 1 10.59"/></svg>
            </div>
          </Link>
          {/* <Link className='folder-hub folder-var-5 py-2 px-3' to='sydea-wall'>
            <div className='d-flex align-items-center gap-2'>
              <svg width="20px" height="20px" viewBox="0 0 472.43 411.58" fill="currentColor">
                <path d="M47.8,0C21.48,0,0,21.49,0,47.81v296.08c0,37.35,30.37,67.69,67.73,67.69h373.99c3.49,0,6.84-.62,9.98-1.72,7.02-.51,12.46-5.29,15.65-10.63,2.1-3.52,3.48-7.55,4.28-11.85.08-.35.13-.71.19-1.06.11-.69.24-1.36.32-2.06.11-.98.16-1.99.18-3,0-.12.02-.22.02-.33.02-.55.1-1.07.1-1.63v-224.7h-.1v-89.57c0-16.39-13.12-29.87-29.35-30.54C437.19,14.62,418.8,0,397.1,0H47.8ZM47.8,18h349.3c16.67,0,29.81,13.14,29.81,29.81v296.08h.1v35.42c0,5.12.85,9.91,2.45,14.27h-213.3s-148.43,0-148.43,0c-27.7,0-49.74-22-49.74-49.7V47.81c0-16.67,13.14-29.81,29.81-29.81ZM60.88,47.48c-7.16,0-12.92,9.65-12.92,21.64v90.56c0,11.98,5.76,21.64,12.92,21.64h110.22c7.16,0,12.93-9.65,12.93-21.64v-90.56c0-11.98-5.77-21.64-12.93-21.64H60.88ZM248.84,47.48c-7.16,0-12.92,5.99-12.92,13.43s5.76,13.42,12.92,13.42h137.03c7.16,0,12.93-5.98,12.93-13.42s-5.77-13.43-12.93-13.43h-137.03ZM444.91,52.81c5.52,1.37,9.43,6.19,9.43,12.23v315.77c0,.12-.02.25-.03.38,0,.63-.08,1.25-.18,1.85-.05.32-.12.61-.18.92-.75,3.22-2.65,5.91-5.31,7.62-.27-.28-.65-.75-1.15-1.58-1.3-2.17-2.52-6.14-2.52-10.69v-224.7h-.07V52.81ZM248.84,100.96c-7.16,0-12.92,5.99-12.92,13.43s5.76,13.43,12.92,13.43h137.03c7.16,0,12.93-5.99,12.93-13.43s-5.77-13.43-12.93-13.43h-137.03ZM248.84,154.45c-7.16,0-12.92,5.99-12.92,13.43s5.76,13.43,12.92,13.43h137.03c7.16,0,12.93-5.99,12.93-13.43s-5.77-13.43-12.93-13.43h-137.03ZM61.12,223.63c-7.29,0-13.16,5.98-13.16,13.42s5.87,13.43,13.16,13.43h324.53c7.29,0,13.16-5.99,13.16-13.43s-5.87-13.42-13.16-13.42H61.12ZM61.39,282.25c-7.44,0-13.43,5.98-13.43,13.42s5.99,13.43,13.43,13.43h109.21c7.44,0,13.42-5.99,13.42-13.43s-5.98-13.42-13.42-13.42H61.39ZM248.84,282.25c-7.16,0-12.92,5.98-12.92,13.42s5.76,13.43,12.92,13.43h137.03c7.16,0,12.93-5.99,12.93-13.43s-5.77-13.42-12.93-13.42h-137.03ZM61.39,340.86c-7.44,0-13.43,5.99-13.43,13.43s5.99,13.43,13.43,13.43h109.21c7.44,0,13.42-5.99,13.42-13.43s-5.98-13.43-13.42-13.43H61.39ZM248.84,340.86c-7.16,0-12.92,5.99-12.92,13.43s5.76,13.43,12.92,13.43h137.03c7.16,0,12.93-5.99,12.93-13.43s-5.77-13.43-12.93-13.43h-137.03Z"/>
              </svg>
              <p className='m-0 fw-bold'>Sydea Wall</p>
              <svg viewBox="0 0 7.48 11.59" className='icon-arrow arrow-folder ms-2'><polyline className="arrow-all transition-03s-eio" stroke='currentColor' points="1 1 6.48 5.8 1 10.59"/></svg>
            </div>
          </Link> */}
          <Link className='folder-hub folder-var-5 py-2 px-3' to='sydea-corporate-event'>
            <div className='d-flex align-items-center gap-2'>
              <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 297.42 187.44" width="20px" height="20px"><polygon points="143.98 187.44 81.57 187.44 81.77 47.01 0 47.01 143.98 0 143.98 187.44" fill="#feca21"/><polygon points="153.44 0 297.42 47.01 215.65 47.01 215.85 187.44 153.44 187.44 153.44 0" fill="#feca21"/></svg>
              <p className='m-0 fw-bold title-folder'>Sydea 11</p>
              <svg viewBox="0 0 7.48 11.59" className='icon-arrow arrow-folder ms-2'><polyline className="arrow-all transition-03s-eio" stroke='currentColor' points="1 1 6.48 5.8 1 10.59"/></svg>
            </div>
          </Link>
          {/* <Link className='folder-hub folder-var-4 py-2 px-3' to='news-and-communications'>
            <div className='d-flex align-items-center gap-2'>
              <svg width="20px" height="20px" viewBox="0 0 472.43 411.58" fill="currentColor">
                <path d="M47.8,0C21.48,0,0,21.49,0,47.81v296.08c0,37.35,30.37,67.69,67.73,67.69h373.99c3.49,0,6.84-.62,9.98-1.72,7.02-.51,12.46-5.29,15.65-10.63,2.1-3.52,3.48-7.55,4.28-11.85.08-.35.13-.71.19-1.06.11-.69.24-1.36.32-2.06.11-.98.16-1.99.18-3,0-.12.02-.22.02-.33.02-.55.1-1.07.1-1.63v-224.7h-.1v-89.57c0-16.39-13.12-29.87-29.35-30.54C437.19,14.62,418.8,0,397.1,0H47.8ZM47.8,18h349.3c16.67,0,29.81,13.14,29.81,29.81v296.08h.1v35.42c0,5.12.85,9.91,2.45,14.27h-213.3s-148.43,0-148.43,0c-27.7,0-49.74-22-49.74-49.7V47.81c0-16.67,13.14-29.81,29.81-29.81ZM60.88,47.48c-7.16,0-12.92,9.65-12.92,21.64v90.56c0,11.98,5.76,21.64,12.92,21.64h110.22c7.16,0,12.93-9.65,12.93-21.64v-90.56c0-11.98-5.77-21.64-12.93-21.64H60.88ZM248.84,47.48c-7.16,0-12.92,5.99-12.92,13.43s5.76,13.42,12.92,13.42h137.03c7.16,0,12.93-5.98,12.93-13.42s-5.77-13.43-12.93-13.43h-137.03ZM444.91,52.81c5.52,1.37,9.43,6.19,9.43,12.23v315.77c0,.12-.02.25-.03.38,0,.63-.08,1.25-.18,1.85-.05.32-.12.61-.18.92-.75,3.22-2.65,5.91-5.31,7.62-.27-.28-.65-.75-1.15-1.58-1.3-2.17-2.52-6.14-2.52-10.69v-224.7h-.07V52.81ZM248.84,100.96c-7.16,0-12.92,5.99-12.92,13.43s5.76,13.43,12.92,13.43h137.03c7.16,0,12.93-5.99,12.93-13.43s-5.77-13.43-12.93-13.43h-137.03ZM248.84,154.45c-7.16,0-12.92,5.99-12.92,13.43s5.76,13.43,12.92,13.43h137.03c7.16,0,12.93-5.99,12.93-13.43s-5.77-13.43-12.93-13.43h-137.03ZM61.12,223.63c-7.29,0-13.16,5.98-13.16,13.42s5.87,13.43,13.16,13.43h324.53c7.29,0,13.16-5.99,13.16-13.43s-5.87-13.42-13.16-13.42H61.12ZM61.39,282.25c-7.44,0-13.43,5.98-13.43,13.42s5.99,13.43,13.43,13.43h109.21c7.44,0,13.42-5.99,13.42-13.43s-5.98-13.42-13.42-13.42H61.39ZM248.84,282.25c-7.16,0-12.92,5.98-12.92,13.42s5.76,13.43,12.92,13.43h137.03c7.16,0,12.93-5.99,12.93-13.43s-5.77-13.42-12.93-13.42h-137.03ZM61.39,340.86c-7.44,0-13.43,5.99-13.43,13.43s5.99,13.43,13.43,13.43h109.21c7.44,0,13.42-5.99,13.42-13.43s-5.98-13.43-13.42-13.43H61.39ZM248.84,340.86c-7.16,0-12.92,5.99-12.92,13.43s5.76,13.43,12.92,13.43h137.03c7.16,0,12.93-5.99,12.93-13.43s-5.77-13.43-12.93-13.43h-137.03Z"/>
              </svg>
              <p className='m-0 fw-bold'>News & Communications</p>
              <svg viewBox="0 0 7.48 11.59" className='icon-arrow arrow-folder ms-2'><polyline className="arrow-all transition-03s-eio" stroke='currentColor' points="1 1 6.48 5.8 1 10.59"/></svg>
            </div>
          </Link> */}
        </div>

        {/* <div className='mt-3 row gap-3'> 
          <a className='card-folder-dashboard d-flex flex-column align-items-center gap-2' href='https://sydea.sharepoint.com/Shared%20Documents/Forms/AllItems.aspx?id=%2FShared%20Documents%2FMarketing%2FBrand%2FLogo&viewid=c11bcbcc%2D3a72%2D49c0%2Da7c3%2Dc2e3de00d51f' target='_blank'>
            <img src={FolderImage} className='folder-img'/>
            <span className="card-folder-title">Logo</span>
          </a>
          <a className='card-folder-dashboard d-flex flex-column align-items-center gap-2' href='https://sydea.sharepoint.com/Shared%20Documents/Forms/AllItems.aspx?id=%2FShared%20Documents%2FMarketing%2FBrand%2FLogo&viewid=c11bcbcc%2D3a72%2D49c0%2Da7c3%2Dc2e3de00d51f' target='_blank'>
            <img src={FolderImage} className='folder-img'/>
            <span className="card-folder-title">Company<br/> Profile & <br/>Resources</span>
          </a>
          <a className='card-folder-dashboard d-flex flex-column align-items-center gap-2' href='https://sydea.sharepoint.com/Shared%20Documents/Forms/AllItems.aspx?id=%2FShared%20Documents%2FMarketing%2FBrand%2FLogo&viewid=c11bcbcc%2D3a72%2D49c0%2Da7c3%2Dc2e3de00d51f' target='_blank'>
            <img src={FolderImage} className='folder-img'/>
            <span className="card-folder-title">Document <br/>Template</span>
          </a>
        </div> */}
        
        {
          newsList && newsList.length > 0 &&
            <div className='box-all-news my-4'>
              
              {userData?.officeLocation && newsList[0].group.includes(userData.officeLocation) &&
                <div className='row-main-news py-2 row d-flex align-items-stretch' onClick={() => showSelectedNews(newsList[0])}>
                  <div className='col-sm-12 col-md-6 d-flex'>
                    <div
                      className='box-img-main-news col-sm-12 col-md-6 d-flex align-items-center'
                      style={{ backgroundImage: `url(${newsList[0].imageLink})` }}
                    ></div>
                  </div>
                  <div className='col-sm-12 col-md-6'>
                    <div className='context-main-news w-100 col-sm-12 col-md-6'>
                      <div className='row-cagtegory-main'>
                        <p className='m-0 label-category-news fw-bold'>{newsList[0].category}</p>
                      </div>
                      <h2 className='title-main-news m-0 my-3 fs-1 fw-bold'>{newsList[0].title}</h2>
                      <p className='desc-main-news m-0 mb-2' dangerouslySetInnerHTML={{ __html: newsList[0].shortText }}></p>
                      <p className='label-date-mobile label-date-mobile-main fw-bold mt-1'><CalendarTodayIcon sx={{fontSize: '0.66rem', lineHeight: '0.77rem'}}/> {formatDate(newsList[0].date)}</p>
                    </div>
                  </div>
                </div>
              }

            <p className='m-0 label-latest-news my-2 fw-bold fs-2'>All News</p>

            <div className="mb-3 d-flex gap-2 flex-wrap">
              <button
                className={`btn btn-sm ${selectedYear === 'All' ? 'btn-year-hub selected' : 'btn-year-hub'}`}
                onClick={() => setSelectedYear('All')}
              >
                All
              </button>
              {years.map(year => (
                <button
                  key={year}
                  className={`btn btn-sm ${selectedYear === year ? 'btn-year-hub selected' : 'btn-year-hub'}`}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </button>
              ))}
            </div>

            <div className='row'>
            {
              // newsList.slice(1).map((news, index) => (
              filteredNews.map((news, index) => (
                userData?.officeLocation && news.group.includes(userData.officeLocation) &&
                <div key={index} className='col-sm-12 col-md-3 col-news-thumb' onClick={() => showSelectedNews(news)}>
                  <div>
                    <div className='thumbnail-news'>
                      <img src={news.imageLink} className='thumbnail-img'></img>
                    </div>
                    <div className='mt-2'>
                      <p className='m-0 label-category-news fw-bold'>{(news.category)}</p>
                      <h3 className='title-news-thumb m-0 my-1 fw-bold fs-5'>{news.title}</h3>
                      <p className='desc-news-thumb m-0 my-2' dangerouslySetInnerHTML={{ __html: news.shortText }}></p>
                      <p className='label-date-mobile fw-bold mt-1'><CalendarTodayIcon sx={{fontSize: '0.66rem', lineHeight: '0.77rem'}}/> {formatDate(news.date)}</p>
                    </div>
                  </div>
                </div>
            ))}
            </div> 
            {
              showFormNewIdea &&
              <div className='overlay-detail-news' onClick={handleCancel}>
                <div className='box-detail-news' onClick={stopPropagation}>
                  <div className='header-detail-news d-flex justify-content-end p-2'>
                    <div style={{width:'40px', cursor:'pointer'}} onClick={handleCancel}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                        <path d="M10.0303 8.96965C9.73741 8.67676 9.26253 8.67676 8.96964 8.96965C8.67675 9.26255 8.67675 9.73742 8.96964 10.0303L10.9393 12L8.96966 13.9697C8.67677 14.2625 8.67677 14.7374 8.96966 15.0303C9.26255 15.3232 9.73743 15.3232 10.0303 15.0303L12 13.0607L13.9696 15.0303C14.2625 15.3232 14.7374 15.3232 15.0303 15.0303C15.3232 14.7374 15.3232 14.2625 15.0303 13.9696L13.0606 12L15.0303 10.0303C15.3232 9.73744 15.3232 9.26257 15.0303 8.96968C14.7374 8.67678 14.2625 8.67678 13.9696 8.96968L12 10.9393L10.0303 8.96965Z" fill="currentColor"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                  <div className='p-3'>
                    <div className='header-news-detail p-3 mb-3' style={{ backgroundImage: `url(${selectedNews.imageLink})` }}>
                      <div className='overlay-news-detail w-100 h-100'></div>
                      <div className='body-news-detail d-flex flex-column justify-content-center'>
                        <p className='m-0 label-category-news fw-bold'>{(selectedNews.category)}</p>
                        <h3 className='fs-1 fw-bold my-3'>{selectedNews.title}</h3>
                        {/* <h3 className='fs-6 mb-4'>{formatDate(selectedNews.date)}</h3> */}
                        <h3 className='fw-bold fs-6 mb-4 d-flex align-items-center gap-1'><CalendarTodayIcon sx={{fontSize: '1rem', lineHeight: '1.2rem'}}/> {formatDate(selectedNews.date)}</h3>
                      </div>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: selectedNews.longText }}></div>
                  </div>
                </div>
              </div>
            }
          </div>
        }


        {/* {
          newsList && newsList.length > 0 &&
            <div className='box-all-news my-4'>
              
              {userData?.officeLocation && newsList[0].group.includes(userData.officeLocation) &&
                <div className='row-main-news py-2 row d-flex align-items-stretch' onClick={() => showSelectedNews(newsList[0])}>
                  <div className='col-sm-12 col-md-6 d-flex'>
                    <div
                      className='box-img-main-news col-sm-12 col-md-6 d-flex align-items-center'
                      style={{ backgroundImage: `url(${newsList[0].imageLink})` }}
                    ></div>
                  </div>
                  <div className='col-sm-12 col-md-6'>
                    <div className='context-main-news w-100 col-sm-12 col-md-6'>
                      <div className='row-cagtegory-main'>
                        <p className='m-0 label-category-news fw-bold'>{newsList[0].category}</p>
                      </div>
                      <h2 className='title-main-news m-0 my-3 fs-1 fw-bold text-uppercase'>{newsList[0].title}</h2>
                      <p className='desc-main-news m-0' dangerouslySetInnerHTML={{ __html: newsList[0].shortText }}></p>
                      <p className='m-0 mt-4 fw-bold' style={{fontSize:'0.8rem'}}>{formatDate(newsList[0].date)}</p>
                    </div>
                  </div>
                </div>
              }

              <p className='m-0 label-latest-news my-2 fw-bold fs-2'>All News</p>

            <div className='row'>
            {
              newsList.slice(1).map((news, index) => (
                userData?.officeLocation && news.group.includes(userData.officeLocation) &&
                <div key={index} className='col-sm-12 col-md-3 col-news-thumb' onClick={() => showSelectedNews(news)}>
                  <div className='content-news-card p-3'>
                    <div className='thumbnail-news'>
                      <img src={news.imageLink} className='thumbnail-img'></img>
                    </div>
                    <div className='mt-3 p-2 text-center'>
                      <div className='d-flex justify-content-center'>
                        <p className='m-0 label-category-news fw-bold'>{(news.category)}</p>
                      </div>
                      <h3 className='title-news-thumb m-0 my-3 fw-bold text-uppercase fs-5'>{news.title}</h3>
                      <p className='desc-news-thumb m-0' dangerouslySetInnerHTML={{ __html: news.shortText }}></p>
                      <p className='desc-news-thumb m-0 mt-4 fw-bold' style={{fontSize:'0.8rem'}}>{formatDate(news.date)}</p>
                    </div>
                  </div>
                </div>
            ))}
            </div>

            {
              showFormNewIdea &&
              <div className='overlay-detail-news' onClick={handleCancel}>
                <div className='box-detail-news' onClick={stopPropagation}>
                  <div className='header-detail-news d-flex justify-content-end p-2'>
                    <div style={{width:'40px', cursor:'pointer'}} onClick={handleCancel}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                        <path d="M10.0303 8.96965C9.73741 8.67676 9.26253 8.67676 8.96964 8.96965C8.67675 9.26255 8.67675 9.73742 8.96964 10.0303L10.9393 12L8.96966 13.9697C8.67677 14.2625 8.67677 14.7374 8.96966 15.0303C9.26255 15.3232 9.73743 15.3232 10.0303 15.0303L12 13.0607L13.9696 15.0303C14.2625 15.3232 14.7374 15.3232 15.0303 15.0303C15.3232 14.7374 15.3232 14.2625 15.0303 13.9696L13.0606 12L15.0303 10.0303C15.3232 9.73744 15.3232 9.26257 15.0303 8.96968C14.7374 8.67678 14.2625 8.67678 13.9696 8.96968L12 10.9393L10.0303 8.96965Z" fill="currentColor"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                  <div className='p-3'>
                    <div className='header-news-detail p-3 mb-3' style={{ backgroundImage: `url(${selectedNews.imageLink})` }}>
                      <div className='overlay-news-detail w-100 h-100'></div>
                      <div className='body-news-detail d-flex flex-column justify-content-center'>
                        <p className='m-0 label-category-news fw-bold'>{(selectedNews.category)}</p>
                        <h3 className='fs-1 text-uppercase fw-bold my-3'>{selectedNews.title}</h3>
                        <h3 className='fs-6 mb-4'>{formatDate(selectedNews.date)}</h3>
                      </div>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: selectedNews.longText }}></div>
                  </div>
                </div>
              </div>
            }
          </div>
        } */}


      </div>
    </MsalAuthenticationTemplate>
  );
};
