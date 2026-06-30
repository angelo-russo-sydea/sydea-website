import React, { useContext, useState, useCallback, useRef, useEffect } from "react";
import './corporate-event.scss';
import { AppContext } from '../../services/translationContext';
import { MsalAuthenticationTemplate } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link, useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IconButton, useMediaQuery } from "@mui/material";
import NewspaperIcon from '@mui/icons-material/Newspaper';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import InfoIcon from '@mui/icons-material/Info';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import heroVideo from '../../assets/video/hero-11.mp4';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { useTheme } from "@emotion/react";

const NewsModal = ({ open, handleClose, news }) => {
  if (!news) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      className="news-modal"
    >
      <DialogTitle className="modal-header">
        <div className="modal-title">
          <span className="news-tag">{news.tag}</span>
          <h2>{news.title}</h2>
          <span className="news-date">{news.date}</span>
        </div>
        <IconButton onClick={handleClose} className="close-button">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="modal-content">
        {news.image && (
          <div className="news-hero-image" style={{backgroundImage: `url(${news.image})`}} />
        )}
        <div className="news-body" dangerouslySetInnerHTML={{ __html: news.content }} />
      </DialogContent>
    </Dialog>
  );
};

export const CorporateEvent = () => {
  const { lang } = useParams();
  const { services: { TranslationsService } } = useContext(AppContext);
  const [activeSection, setActiveSection] = useState('news');

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  
  const { instance, accounts } = useMsal();
  let activeAccount;

  if (instance) {
    activeAccount = instance.getActiveAccount();
  }

  document.title = 'Sydea X Perience';

  const signOut = () => {
    instance.logoutRedirect();
  };

  const signIn = () => {
    instance.loginRedirect().catch((error) => console.log(error));
  };

  const scrollToContent = () => {
    const contentElement = document.querySelector('.content-container');
    if (contentElement) {
      const headerHeight = 64;
      const navHeight = 72;
      const offset = headerHeight + navHeight;
      
      const elementPosition = contentElement.offsetTop;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    scrollToContent();
    window.location.hash = section;
  };

  const [selectedNews, setSelectedNews] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const newsData = [
    // {
    //   id: 0,
    //   tag: "Highlights - Band",
    //   title: "Duria Lake",
    //   date: "18 Jul 2025",
    //   image: 'https://d3t3s6w5yvhc3g.cloudfront.net/media/sydea-xperience-2025/duria-lake-logo.png',
    //   excerpt: "We had a band. Now we also have a name!",
    //   content: `
    //     <div>
    //     <p class="m-0"><i>&quot;We had a band, yes. But we were missing a name that could speak for us, something that could capture our essence.<br/><br/><b>Duria</b> Lake is that name. A deep and mysterious lake, like the thoughts we turn into songs. A key that opens doors, memories, hidden stories.<br/>Today we also have a logo that represents us. A simple yet powerful symbol: a circle that holds our world, a key and a lake that tell who we are&quot;.<br/><br/><b>Or maybe not?</b></i><br/><br/>We’re ready to take you on this journey.<br/><b>Welcome to Duria Lake.</b></p>
    //     <div style='width:100%; display:flex; margin:auto; padding-top:2rem'><img src='https://d3t3s6w5yvhc3g.cloudfront.net/media/sydea-xperience-2025/duria-lake-logo.png' style='width:50%; margin:auto;'></div>
    //     </div>
    //   `
    // },
    // {
    //   id: 3,
    //   tag: "Band",
    //   title: "Sydea Band",
    //   date: "21 Mar 2025",
    //   image: "https://d3t3s6w5yvhc3g.cloudfront.net/images/event-2025/x-perience-band.png",
    //   excerpt: "We are looking for Musicians and Singers!",
    //   content: `
    //     <div>
    //     <p class="m-0">For our corporate event, we have a special idea: create the Sydea Band!</p>
    //     <br/><p class="m-0">If you play an instrument or sing, this is your chance to perform! To apply, reply to this email or contact us as you prefer.</p>
    //     <br/><p class="m-0">Based on the entries, we will organize the tests and define the details. Participation means having fun, but also commitment, so join in enthusiastically!</p>
    //     </div>
    //   `
    // },
    // {
    //   id: 2,
    //   tag: "Photo",
    //   title: "Sydea Photos",
    //   date: "19 Mar 2025",
    //   image: "https://d3t3s6w5yvhc3g.cloudfront.net/images/event-2025/x-perience-photo.png",
    //   excerpt: "Let's tell the story of Sydea!",
    //   content: `
    //     <div>
    //     <p class="m-0">We are collecting photos that tell the story of Sydea, from the early years to the present day.</p>
    //     <br/><p class="m-0">We would like to collect images that represent significant moments lived in the company: events, trips, days at the office, dinners or any other memory that can help tell our journey.</p>
    //     <br/><p class="m-0">If you have photos that you like to share, you can send them to <a href="mailto:angelo.russo@sydea.com?subject=Sydea Photo">Angelo Russo</a> or <a href="mailto:gianni.nardone@sydea.it?subject=Sydea Photo">Gianni Nardone</a> as you prefer (email, chat, etc.).</p>
    //     </div>
    //   `
    // },
    //     {
    //   id: 1,
    //   tag: "Announcement",
    //   title: "Sydea X Perience",
    //   date: "5 Feb 2025",
    //   image: "https://d3t3s6w5yvhc3g.cloudfront.net/images/event-2025/x-perience-hero.png",
    //   excerpt: "10 years of Sydea",
    //   content: `
    //     <div>
    //     <p class="m-0">This year Sydea celebrates a special milestone: 10 years of shared innovation, growth and success and, as usual, we will organize a special event that will involve all our offices.</p>
    //     </div>
    //     <br/>
    //     <div>
    //     <p class="m-0">📅 When? <b>27-28 September 2025</b></p>
    //     <p class="m-0">📍 Where? <b>Naples</b></p>
    //     </div>
    //     <br/>
    //     <div>
    //     <p class="m-0">Additional information about the event will be shared shortly.</p>
    //     <br/>
    //     <p class="m-0">ℹ️ For all people not working in the Naples office, including those in the Bologna and Skopje offices, we will send specific communications with details regarding travel (26 and 29 September) and other logistical information.</p>
    //     <br/>
    //     <p class="m-0">Mark the date in your calendar, it will be an unmissable occasion to celebrate our first 10 years!</p>
    //     </div>
    //     </div>
    //     <div>
    //     <p class="m-0">This year Sydea celebrates a special milestone: 10 years of shared innovation, growth and success and, as usual, we will organize a special event that will involve all our offices.</p>
    //     </div>
    //     <br/>
    //     <div>
    //     <p class="m-0">📅 When? <b>27-28 September 2025</b></p>
    //     <p class="m-0">📍 Where? <b>Naples</b></p>
    //     </div>
    //     <br/>
    //     <div>
    //     <p class="m-0">Additional information about the event will be shared shortly.</p>
    //     <br/>
    //     <p class="m-0">ℹ️ For all people not working in the Naples office, including those in the Bologna and Skopje offices, we will send specific communications with details regarding travel (26 and 29 September) and other logistical information.</p>
    //     <br/>
    //     <p class="m-0">Mark the date in your calendar, it will be an unmissable occasion to celebrate our first 10 years!</p>
    //     </div>
    //     </div>
    //   `
    // }
  ];

  const band = [
    {
      id: 1,
      name: "-",
      role: "Vocals",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSje3g3yV5VWU9avi7ctwxMGYqQCmytodAK0Q&s",
    },
    {
      id: 2,
      name: "-",
      role: "Drums",
      image: "https://static.vecteezy.com/system/resources/previews/024/570/246/large_2x/young-man-playing-drums-on-a-stage-in-a-dark-room-with-dramatic-lighting-a-drummer-in-full-rear-view-playing-drums-ai-generated-free-photo.jpg",
    },
    {
      id: 3,
      name: "-",
      role: "Bass",
      image: "https://media.istockphoto.com/id/911329282/photo/electric-bass-guitar-black-and-white-photo.jpg?s=612x612&w=0&k=20&c=oo5CYZCQEqTjkRDnNWh6uhv2kKkpCVwHttGXl-mDYjs=",
    },
    {
      id: 4,
      name: "-",
      role: "Guitar",
      image: "https://i.pinimg.com/736x/3a/8a/dd/3a8add74f5a24f57fa42e90d725d034f.jpg",
    },
  ];

  const images = [
    'https://d3t3s6w5yvhc3g.cloudfront.net/images/event-2025/x-perience-hero.png',
    // 'https://d3t3s6w5yvhc3g.cloudfront.net/media/sydea-xperience-2025/duria-lake-logo.png',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/conferenza-0.jpg',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/conferenza-1.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/conferenza-2.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/conferenza-3.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/conferenza-4.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/conferenza-5.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/conferenza-6.JPG',

    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/conferenza-8.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/conferenza-9.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/duria-lake-0.jpg',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/duria-lake-1.jpg',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/duria-lake-2.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/duria-lake-3.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/duria-lake-4.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/duria-lake-5.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/duria-lake-6.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/duria-lake-7.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/duria-lake-8.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/duria-lake-9.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/duria-lake-10.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/duria-lake-11.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/go-kart-0.jpg',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/go-kart-1.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/go-kart-2.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/go-kart-3.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/go-kart-4.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/go-kart-5.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/go-kart-6.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/go-kart-7.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/go-kart-8.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/go-kart-9.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/go-kart-10.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/go-kart-11.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/go-kart-12.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/go-kart-13.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/go-kart-14.jpg',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/go-kart-15.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/live-painting-1.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/live-painting-2.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/live-painting-3.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/live-painting-4.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/live-painting-5.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/live-painting-6.JPG',
    'https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/live-painting-7.JPG'

  ];

  const handleOpenNews = (news) => {
    setSelectedNews(news);
    setModalOpen(true);
  };

  const handleCloseNews = () => {
    setModalOpen(false);
    setSelectedNews(null);
  };

  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);

  const handleStart = async () => {
    if (started) return; 

    setTimeout(async () => {
      const container = containerRef.current;
      const video = videoRef.current;

      if (container && video) {
        try {
          container.style.display = "block";
          
          if (container.requestFullscreen) {
            await container.requestFullscreen();
          } else if (container.webkitRequestFullscreen) {
            await container.webkitRequestFullscreen();
          } else if (container.msRequestFullscreen) {
            await container.msRequestFullscreen();
          }

          await video.play();
          setStarted(true);
        } catch (err) {
          console.error("Errore fullscreen o play:", err);
        }
      }
    }, 100);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullScreen =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;

      if (!isFullScreen && containerRef.current && videoRef.current) {
        videoRef.current.pause();
        containerRef.current.style.display = "none";
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['news', 'band', 'photos', 'info'].includes(hash)) {
        // setActiveSection(hash);
        handleSectionChange(hash)
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
      <div className='event-page'>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="fixed" style={{backgroundColor:'#141414'}}>
            <Toolbar className='justify-content-between'>
              <IconButton variant="outlined" style={{color:'#ffffff', borderColor:'#ffffff'}} className="me-3 showMobile">
                <Link to={`/${lang}/sydea-hub`} className="text-deco-none" style={{color:'#ffffff'}}>
                  <ArrowBackIosIcon/>
                </Link>
              </IconButton>
              
              <Link to={`/${lang}/sydea-hub`} className="text-deco-none showDesktop" style={{color:'#ffffff'}}>
                <Button variant="outlined" startIcon={<ArrowBackIosIcon />} style={{color:'#ffffff', borderColor:'#ffffff'}} className="me-3">
                  <span className='px-1'>Hub</span>
                </Button>
              </Link>

              <div className='d-flex gap-3 align-items-center'>
                {activeAccount && 
                  <div>
                    <Typography variant="p" component="div" sx={{ flexGrow: 1 }}>
                      <p className='fw-bold text-uppercase m-0 fs-sm-6 fs-md-5 p-0' style={{lineHeight:'normal'}}>{activeAccount.name}</p>
                      <p className='m-0 p-0 fs-6' style={{lineHeight:'normal'}}>{activeAccount.username}</p>
                    </Typography>
                  </div>
                }
                <div>
                  {activeAccount ?
                    (<IconButton aria-label="delete" style={{color:'#ffffff'}} onClick={signOut}>
                      <LogoutIcon />
                    </IconButton>)
                    :
                    (<IconButton aria-label="delete" style={{color:'#ffffff'}} onClick={signIn}>
                      <LoginIcon />
                    </IconButton>)
                  }
                </div>
              </div>
            </Toolbar>
          </AppBar>
        </Box>

        <div className="hero-section">
          <video 
            className="hero-video" 
            autoPlay 
            loop 
             
            playsInline
            src={heroVideo}
          />
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-text-xperience">
              <p className="event-desc">This year Sydea celebrates 11 years of shared innovation, growth and success and, as usual, we will organize a special event that will involve all our offices.</p>
              <p className="event-date">19-20 September 2025</p>
              <div className="event-location">
                <span className="location-dot"></span>
                Castello di Baccaresca, Gubbio, Italy
              </div>
            </div>
          </div>
        </div>

        <div className="nav-container">
          <div className="nav-tabs">
            <button 
              className={`nav-tab ${activeSection === 'news' ? 'active' : ''}`}
              onClick={() => handleSectionChange('news')}
            >
              <NewspaperIcon />
              <span>News</span>
            </button>
            {/* <button 
              className={`nav-tab ${activeSection === 'band' ? 'active' : ''}`}
              onClick={() => {handleSectionChange('band')}}
            >
              <MusicNoteIcon />
              <span>Band</span>
            </button> */}
            <button 
              className={`nav-tab ${activeSection === 'photos' ? 'active' : ''}`}
              onClick={() => handleSectionChange('photos')}
            >
              <PhotoLibraryIcon />
              <span>Photo & Video</span>
            </button>
            <button 
              className={`nav-tab ${activeSection === 'info' ? 'active' : ''}`}
              onClick={() => handleSectionChange('info')}
            >
              <InfoIcon />
              <span>Info</span>
            </button>
          </div>
        </div>

        <div className="content-container"> 
          {activeSection === 'news' && (
            <div className="news-grid">
              {newsData.map((news) => (
                <div 
                  key={news.id} 
                  className={`news-card ${news.id === 0 ? 'featured' : ''}`}
                  onClick={() => handleOpenNews(news)}
                >
                  <div className="news-image" style={{backgroundImage: `url(${news.image})`}}></div>
                  <div className="news-content">
                    <span className="news-tag">{news.tag}</span>
                    <h3>{news.title}</h3>
                    <p>{news.excerpt}</p>
                    <span className="news-date">{news.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'band' && (
            <div className="p-3">
              <div className="band-info d-flex gap-3">
                {/* <h3>Duria Lake</h3> */}
                {/* <div className="band-social">
                  sjlkdsjlk
                </div> */}
                <div className="photo-width-30">
                  <img style={{width: '100%', height: 'auto'}} src="https://d3t3s6w5yvhc3g.cloudfront.net/media/sydea-xperience-2025/duria-lake-logo.png" alt="Duria Lake logo"></img>
                </div>

                {/* {!isMobile && (
                  <div className="w-full h-screen bg-black flex justify-center items-center">
                    <div
                      ref={containerRef}
                      style={{ display: "none", width: "100%", height: "100%", backgroundColor: "black", textAlign: 'center' }}
                    >
                      <video
                        ref={videoRef}
                        className="h-screen w-auto h-100"
                        src="https://d3t3s6w5yvhc3g.cloudfront.net/media/video/sydea-band-teaser.mov"
                        type="video/mp4"
                        controls={true}
                        muted={false}
                        playsInline
                        loop
                      />
                    </div>
                  </div>
                )} */}

                <div className="photo-width-20" style={{position:'relative', display:'flex', borderRadius:'20px', overflow: 'hidden', boxShadow:'0 8px 24px rgba(0, 0, 0, 0.4)'}}>
                  <video controls autoPlay muted={false} loop style={{display:'block', borderRadius:'20px', width:'100%', height:'auto'}}>
                    <source src='https://d3t3s6w5yvhc3g.cloudfront.net/media/video/sydea-band-teaser.mov' type='video/mp4'></source>
                    Your browser does not support the video tag.
                  </video>
                </div>

                <div className="photo-width-25">
                  <img style={{width: '100%', height: 'auto'}} src="https://d3t3s6w5yvhc3g.cloudfront.net/media/sydea-xperience-2025/duria-lake-lineup.png" alt="Duria Lake logo"></img>
                </div>
                <div className="photo-width-25">
                  <img style={{width: '100%', height: 'auto'}} src="https://d3t3s6w5yvhc3g.cloudfront.net/media/sydea-xperience-2025/duria-lake-moto.jpg" alt="Duria Lake logo"></img>
                </div>
                {/* <img src="https://d3t3s6w5yvhc3g.cloudfront.net/media/sydea-xperience-2025/duria-lake-lineup.png" style={{width: '100%', height: 'auto'}} alt="Duria Lake logo"></img>
                <img src="https://d3t3s6w5yvhc3g.cloudfront.net/media/sydea-xperience-2025/duria-lake-moto.jpg" style={{width: '100%', height: 'auto'}} alt="Duria Lake logo"></img> */}
              </div>

              {/* <div className="band-grid">
              {band.map((bandGroup) => (
                 <div className="band-card p-3" key={bandGroup.id}>
                  <div className="avatar-band">
                    <img src={bandGroup.image}></img>
                  </div>
                  <p className="m-0 text-center mt-2 fw-bold" style={{fontSize:'1.5rem'}}>{bandGroup.name}</p>
                  <p className="m-0 text-center" style={{color:'#fece2f'}}>{bandGroup.role}</p>
                 </div>
              ))}
              </div> */}
            </div>
          )}

          {activeSection === 'photos' && (
            <>
            {/* <PhotoProvider maskOpacity={0.8} 
              toolbarRender={({ rotate, onRotate, onScale, scale, index }) => {
                return (
                  <>
                    <svg className="PhotoView-Slider__toolbarIcon" onClick={() => onScale(scale + 1)} 
                      width="44"
                      height="44"
                      viewBox="0 0 768 768"
                      fill="white">
                        <path d="M384 640.5q105 0 180.75-75.75t75.75-180.75-75.75-180.75-180.75-75.75-180.75 75.75-75.75 180.75 75.75 180.75 180.75 75.75zM384 64.5q132 0 225.75 93.75t93.75 225.75-93.75 225.75-225.75 93.75-225.75-93.75-93.75-225.75 93.75-225.75 225.75-93.75zM415.5 223.5v129h129v63h-129v129h-63v-129h-129v-63h129v-129h63z" />
                    </svg>
                    <svg className="PhotoView-Slider__toolbarIcon" onClick={() => onScale(scale - 1)}
                        width="44"
                        height="44"
                        viewBox="0 0 768 768"
                        fill="white"
                      >
                        <path d="M384 640.5q105 0 180.75-75.75t75.75-180.75-75.75-180.75-180.75-75.75-180.75 75.75-75.75 180.75 75.75 180.75 180.75 75.75zM384 64.5q132 0 225.75 93.75t93.75 225.75-93.75 225.75-225.75 93.75-225.75-93.75-93.75-225.75 93.75-225.75 225.75-93.75zM223.5 352.5h321v63h-321v-63z" />
                    </svg>
                    <svg className="PhotoView-Slider__toolbarIcon" onClick={() => onRotate(rotate + 90)} 
                        width="44"
                        height="44"
                        viewBox="0 0 768 768"
                        fill="white"
                      >
                        <path d="M565.5 202.5l75-75v225h-225l103.5-103.5c-34.5-34.5-82.5-57-135-57-106.5 0-192 85.5-192 192s85.5 192 192 192c84 0 156-52.5 181.5-127.5h66c-28.5 111-127.5 192-247.5 192-141 0-255-115.5-255-256.5s114-256.5 255-256.5c70.5 0 135 28.5 181.5 75z" />
                    </svg>
                  </>
                );
              }}
            >
              <div className="photo-grid">
                <div className="photo-width-20 mb-3 p-2" style={{position:'relative', display:'flex', borderRadius:'20px', overflow: 'hidden', boxShadow:'0 8px 24px rgba(0, 0, 0, 0.4)'}}>
                  <video controls muted={false} loop style={{display:'block', borderRadius:'20px', width:'100%', height:'auto'}} poster="https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/Sydea-Xperience-2025-Movie-copertina.png" >
                    <source src='https://d3t3s6w5yvhc3g.cloudfront.net/static/company-events/sydea-xperience-2025/Sydea-Xperience-2025-Movie-Napoli.mp4' type='video/mp4'></source>
                    Your browser does not support the video tag.
                  </video>
                </div>
                {images.map((item, index) => (
                  <PhotoView key={index} src={item}>
                    <img src={item} alt="" className="img-viewer-syd"/>
                  </PhotoView>
                ))}
              </div>
            </PhotoProvider> */}
            <a className="input-div m-3" href="https://sydea.sharepoint.com/Shared%20Documents/Forms/AllItems.aspx?id=%2FShared%20Documents%2FPublic%2F2025%2FMedia" target="_blank">
              <div className="input"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24" strokeWidth="2" fill="none" stroke="currentColor" className="icon"><polyline points="16 16 12 12 8 16"></polyline><line y2="21" x2="12" y1="12" x1="12"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>
              <p className="m-0">UPLOAD</p>
            </a>
            </>
          )}

          {activeSection === 'info' && (
            <div className="info-section">
              <div className="info-card location">
                <h3>Location</h3>
                <div className="map-container">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2904.0535102829035!2d12.698327776175208!3d43.292201071121646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132c315d366cfe5f%3A0x7d697867ca6850cd!2sCastello%20di%20Baccaresca!5e0!3m2!1sit!2sit!4v1782724327663!5m2!1sit!2sit" width="600" height="450" style={{border:0}}allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
                </div>
                <div className="location-details">
                  <h3 style={{fontSize:'1.2rem'}}><b>Castello di Baccaresca, Località Baccaresca, 06024 Gubbio PG</b></h3>
                </div>
              </div>
              <div className="info-card schedule">
                <h3>Agenda</h3>
                <div className="timeline">
                  <p className="m-0 fw-bold">📅 19 September 2026</p>
                  <div className="timeline-item">
                    <span className="time">To be defined</span>
                  </div>
                  {/* <div className="timeline-item">
                    <span className="time">10:00</span>
                    <span className="event" style={{display: 'flex', flexDirection: 'column'}}>
                      <span>Conference</span>
                      <span style={{fontSize: '12px'}}><a href="https://maps.app.goo.gl/FYwwjJ6A5Hnh8gZA8" target="_blank" style={{color:'#fece2f', textDecoration: 'none'}}>📌 HOTEL TIEMPO, Conference Room, Via Sannio, 19, 80146 Napoli NA</a></span>
                    </span>
                  </div>
                  <div className="timeline-item">
                    <span className="time">13:00</span>
                    <span className="event" style={{display: 'flex', flexDirection: 'column'}}>
                      <span>Lunch</span>
                      <span style={{fontSize: '12px'}}><a href="https://maps.app.goo.gl/FYwwjJ6A5Hnh8gZA8" target="_blank" style={{color:'#fece2f', textDecoration: 'none'}}>📌 HOTEL TIEMPO, Restaurant, Via Sannio, 19, 80146 Napoli NA</a></span>
                    </span>
                  </div>
                  <div className="timeline-item">
                    <span className="time">16:30</span>
                    <span className="event" style={{display: 'flex', flexDirection: 'column'}}>
                      <span>City Tour</span>
                    </span>
                  </div>
                  <div className="timeline-item">
                    <span className="time">20:00</span>
                    <span className="event" style={{display: 'flex', flexDirection: 'column'}}>
                      <span>Duria Lake Band Evening</span>
                      <span style={{fontSize: '12px'}}><a href="https://maps.app.goo.gl/2eRq9454woNVGraZ6" target="_blank" style={{color:'#fece2f', textDecoration: 'none'}}>📌 SLASH +, Via Vincenzo Gemito, 20, 80127 Napoli N</a></span>
                    </span>
                  </div> */}
                 
                  <p className="m-0 fw-bold mt-4">📅 20 September 2025</p>
                  <div className="timeline-item">
                    <span className="time">To be defined</span>
                  </div>
                  {/* <div className="timeline-item">
                    <span className="time">10:00</span>
                    <span className="event" style={{display: 'flex', flexDirection: 'column'}}>
                      <span>Bus departure</span>
                      <span style={{fontSize: '12px'}}><a href="https://maps.app.goo.gl/FYwwjJ6A5Hnh8gZA8" target="_blank" style={{color:'#fece2f', textDecoration: 'none'}}>📌 HOTEL TIEMPO, Via Sannio, 19, 80146 Napoli NA</a></span>
                    </span>
                  </div>
                  <div className="timeline-item">
                    <span className="time">11:30</span>
                    <span className="event" style={{display: 'flex', flexDirection: 'column'}}>
                      <span>Team building & Go-kart</span>
                      <span style={{fontSize: '12px'}}><a href="https://maps.app.goo.gl/m3vJ5Ueqv9c4atny9" target="_blank" style={{color:'#fece2f', textDecoration: 'none'}}>📌 PISTA CAUDINA MONTESARCHIO, Via Giustino Fortunato, 1, 82016 Montesarchio BN</a></span>
                    </span>
                  </div>
                  <div className="timeline-item">
                    <span className="time">13:00</span>
                    <span className="event" style={{display: 'flex', flexDirection: 'column'}}>
                      <span>Lunch</span>
                      <span style={{fontSize: '12px'}}><a href="https://maps.app.goo.gl/m3vJ5Ueqv9c4atny9" target="_blank" style={{color:'#fece2f', textDecoration: 'none'}}>📌 PISTA CAUDINA MONTESARCHIO, Via Giustino Fortunato, 1, 82016 Montesarchio BN</a></span>
                    </span>
                  </div>
                  <div className="timeline-item">
                    <span className="time">16:00</span>
                    <span className="event" style={{display: 'flex', flexDirection: 'column'}}>
                      <span>Bus departure</span>
                      <span style={{fontSize: '12px'}}><a href="https://maps.app.goo.gl/m3vJ5Ueqv9c4atny9" target="_blank" style={{color:'#fece2f', textDecoration: 'none'}}>📌 PISTA CAUDINA MONTESARCHIO, Via Giustino Fortunato, 1, 82016 Montesarchio BN</a></span>
                    </span>
                  </div>
                  <div className="timeline-item">
                    <span className="time">20:30</span>
                    <span className="event" style={{display: 'flex', flexDirection: 'column'}}>
                      <span>Dinner</span>
                      <span style={{fontSize: '12px'}}><a href="https://maps.app.goo.gl/CcB4MTCMCZchYLvy8" target="_blank" style={{color:'#fece2f', textDecoration: 'none'}}>📌 LA DRAGONARA, Via Dragonara, 10, 80070 Bacoli NA</a></span>
                    </span>
                  </div>*/}
                </div> 
              </div>
            </div>
          )}
        </div>

        <NewsModal 
          open={modalOpen}
          handleClose={handleCloseNews}
          news={selectedNews}
        />
      </div>
    </MsalAuthenticationTemplate>
  );
};