import React, { useState, useEffect, useMemo } from 'react';
import "./sydea-internal-news.scss";
import { Link, useParams } from "react-router-dom";
import { MsalAuthenticationTemplate } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import SydeaLogoLightNoText from '../../assets/logo/sydea-white-no-text.svg';
import SydeaLogoNewsComm from '../../assets/logo/sydea-logo-news-comm.svg';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import Typography from '@mui/material/Typography';

const pathUrl = process.env.REACT_APP_BASE_URL;

export const SydeaInternalNews = () => {
  const { lang } = useParams();
  const { instance } = useMsal();
  let activeAccount;

  if (instance) {
    activeAccount = instance.getActiveAccount();
  }

  document.title = 'Sydea | News & Communications';

  const signOut = () => {
    instance.logoutRedirect();
  };

  const signIn = () => {
    instance.loginRedirect().catch((error) => console.log(error));
  };

  const [showFormNewIdea, setShowFormNewIdea] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [time, setTime] = useState('');
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${pathUrl}/static/internal-news/news.json?_cache_buster=${new Date().getTime()}`, {
        cache: 'no-store',
      });
      const data = await response.json();
      setNewsList(data);
    };
  
    fetchData();
  }, []);

  const handleCancel = () => {
    setSelectedNews(null);
    setShowFormNewIdea(false);
  };

  const showSelectedNews = (news) => {
    setSelectedNews(news);
    setShowFormNewIdea(true);
  }

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const getFormattedTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    // const seconds = String(now.getSeconds()).padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, '0') : '12';

    return `${hours}:${minutes} ${ampm}`;
    // return `${hours}:${minutes}:${seconds} ${ampm}`;
  };


  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getFormattedTime());
    }, 1000);
    setTime(getFormattedTime());
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  
  return (
    <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
      <div className='section-home position-relative'>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="fixed" style={{backgroundColor:'#141414'}}>
            <Toolbar className='justify-content-between'>
              <IconButton variant="outlined" style={{color:'#ffffff', borderColor:'#ffffff'}} className="me-3 showMobile">
                <Link to={`/${lang}/sydea-hub`} className="text-deco-none" style={{color:'#ffffff'}}>
                  <ArrowBackIosIcon/>
                </Link>
              </IconButton>
                <Button variant="outlined" startIcon={<ArrowBackIosIcon />} style={{color:'#ffffff', borderColor:'#ffffff'}} className="me-3 showDesktop">
                  <Link to={`/${lang}/sydea-hub`} className="text-deco-none" style={{color:'#ffffff'}}>
                    <span className='px-1'>Hub</span>
                  </Link>
                </Button>
                <div className='box-logo-news-communications d-flex justify-content-center'>
                  <img src={SydeaLogoNewsComm} className='logo-news-communications' alt='Sydea Logo News & Communications'></img>
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
            </Toolbar>
          </AppBar>
        </Box>
        <div style={{height:'60px'}}></div>
        
        {
          newsList && newsList.length > 0 &&
            <div className='box-all-news p-4'>
              <div className='box-logo-news-communications-mobile justify-content-center'>
                <img src={SydeaLogoNewsComm} alt='Sydea Logo News & Communications'></img>
              </div>

            <div className='row-main-news p-3 row d-flex align-items-stretch' onClick={() => showSelectedNews(newsList[0])}>
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
                  <p className='m-0 mt-4' style={{fontSize:'0.8rem'}}>{formatDate(newsList[0].date)}</p>
                </div>
              </div>
            </div>

            <p className='m-0 label-latest-news my-2 fw-bold fs-2'>All News</p>

            <div className='row'>
            {
              newsList.slice(1).map((news, index) => (
                <div key={index} className='col-sm-12 col-md-3 col-news-thumb' onClick={() => showSelectedNews(news)}>
                  <div className='thumbnail-news'>
                    <img src={news.imageLink} className='thumbnail-img'></img>
                  </div>
                  <div className='mt-3 p-2 text-center'>
                    <div className='d-flex justify-content-center'>
                      <p className='m-0 label-category-news fw-bold'>{(news.category)}</p>
                    </div>
                    <h3 className='title-news-thumb m-0 my-3 fw-bold text-uppercase fs-2'>{news.title}</h3>
                    <p className='desc-news-thumb m-0' dangerouslySetInnerHTML={{ __html: news.shortText }}></p>
                    <p className='desc-news-thumb m-0 mt-4' style={{fontSize:'0.8rem'}}>{formatDate(news.date)}</p>
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
        }
      </div>

    </MsalAuthenticationTemplate>
  );
};

