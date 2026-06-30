import React, { useState, useContext, useEffect } from 'react';
import "./admin.scss";
import { Link, useParams } from "react-router-dom";
import { Editor } from 'react-draft-wysiwyg';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Buffer } from 'buffer';
import { AppContext } from '../../services/translationContext';
import { MsalAuthenticationTemplate } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { InteractionStatus } from "@azure/msal-browser"; 
// import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LoginIcon from '@mui/icons-material/Login';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import imgDashboard from "../../assets/image/admin-dash/dashboard.svg";
import imgLabelsJson from "../../assets/image/admin-dash/labels-json.svg";
import imgLabels from "../../assets/image/admin-dash/label-image.svg";
import imgKb from "../../assets/image/admin-dash/kb.svg";
import { 
  Alert,
  Container
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import imgClientStories from "../../assets/image/admin-dash/client-stories.svg";
import imgNews from "../../assets/image/admin-dash/news.svg";
import KbAdminList from '../../components/kb/admin-list';
import KbArticleEditor from '../../components/kb/article-editor';
import KbVersionHistory from '../../components/kb/version-history';
import KbCategoryManager from '../../components/kb/category-manager';
import { Client } from "@microsoft/microsoft-graph-client";

const appOwner = process.env.REACT_APP_OWNER;
const AUTHORIZED_GROUPS = {
  ADMIN: '8bfcf92e-49ee-4875-9cf1-fefc04137c12',
};

export const Admin = () => {
  const { lang } = useParams();
  const { instance, inProgress } = useMsal();
  const [userGroups, setUserGroups] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasAccess, setHasAccess] = useState(null);

  let activeAccount;
  if (instance) {
    activeAccount = instance.getActiveAccount();
  }

  document.title = 'Admin';
  const { services: {TranslationsService} } = useContext(AppContext);

  useEffect(() => {
    if (activeAccount) {
      
      const groups = activeAccount?.idTokenClaims?.groups || [];
      const groupsString = JSON.stringify(groups.sort());
      const currentGroupsString = JSON.stringify(userGroups.sort());
      
      if (groupsString === currentGroupsString && hasAccess !== null) {
        return;
      }
      
      setUserGroups(groups);
      
      const admin = groups.includes(AUTHORIZED_GROUPS.ADMIN);
      setIsAdmin(admin);
      
      const access = groups.some(groupId => 
        Object.values(AUTHORIZED_GROUPS).includes(groupId)
      );
      setHasAccess(access);
      if (!access) {
        console.warn('⛔ Accesso negato: utente non appartiene a nessun gruppo autorizzato');
      }
    }
  }, [activeAccount]);

  // const signIn = () => {
  //   instance.loginRedirect().catch((error) => console.log(error));
  // };

  const signIn = () => {
    instance.loginRedirect({
      scopes: ["User.Read", "GroupMember.Read.All"],
    });
  };
  
  const signOut = () => {
    instance.logoutRedirect();
  };

 // Pagina di accesso negato
  const AccessDeniedPage = () => (
    <div className='section-home light' style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" style={{backgroundColor:'#141414'}}>
          <Toolbar className='justify-content-between'>
            <IconButton variant="outlined" style={{color:'#ffffff', borderColor:'#ffffff'}} className="me-3 showMobile">
              <Link to={`/${lang}`} className="text-deco-none" style={{color:'#ffffff'}}>
                <ArrowBackIosIcon/>
              </Link>
            </IconButton>
            <Button variant="outlined" startIcon={<ArrowBackIosIcon />} style={{color:'#ffffff', borderColor:'#ffffff'}} className="me-3 showDesktop">
              <Link to={`/${lang}`} className="text-deco-none" style={{color:'#ffffff'}}>
                <span className='px-1'>Home</span>
              </Link>
            </Button>
            <div className='d-flex gap-3 align-items-center'>
              {activeAccount && 
                <div>
                  <Typography variant="p" component="div" sx={{ flexGrow: 1 }}>
                    <p className='fw-bold text-uppercase m-0 fs-sm-6 fs-md-5 p-0' style={{lineHeight:'normal'}}>
                      {activeAccount.name}
                    </p>
                    <p className='m-0 p-0 fs-6' style={{lineHeight:'normal'}}>
                      {activeAccount.username}
                    </p>
                  </Typography>
                </div>
              }
              <div>
                <IconButton aria-label="logout" style={{color:'#ffffff'}} onClick={signOut}>
                  <LogoutIcon />
                </IconButton>
              </div>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
      
      <Container maxWidth="md" style={{marginTop: '150px', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div className='text-center'>
          <BlockIcon style={{fontSize: '80px', color: '#dc3545', marginBottom: '20px'}} />
          <h1 className='mb-4'>Accesso Negato</h1>
          <Alert severity="error" className='mb-4 text-start'>
            <strong>Non hai i permessi necessari per accedere a questa pagina.</strong><br/>
            Questa area è riservata agli utenti autorizzati.
          </Alert>
          <div className='d-flex gap-3 justify-content-center'>
            <Button 
              variant="contained" 
              startIcon={<ArrowBackIosIcon />}
              component={Link}
              to={`/${lang}`}
            >
              Torna alla Home
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );

  // Se l'accesso è in verifica, mostra loading
  if (hasAccess === null) {
    return (
      <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
        <div className='d-flex justify-content-center align-items-center' style={{minHeight: '100vh'}}>
          <div className='text-center'>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Caricamento...</span>
            </div>
            <p className='mt-3'>Verifica permessi in corso...</p>
          </div>
        </div>
      </MsalAuthenticationTemplate>
    );
  }

  if (!hasAccess) {
    return (
      <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
        <AccessDeniedPage />
      </MsalAuthenticationTemplate>
    );
  }
    
  return (
    <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
      <div className='section-home light'>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" style={{backgroundColor:'#141414'}}>
          <Toolbar className='justify-content-between'>
          <IconButton variant="outlined" style={{color:'#ffffff', borderColor:'#ffffff'}} className="me-3 showMobile">
            <Link to={`/${lang}`} className="text-deco-none" style={{color:'#ffffff'}}>
              <ArrowBackIosIcon/>
            </Link>
          </IconButton>
            <Button variant="outlined" startIcon={<ArrowBackIosIcon />} style={{color:'#ffffff', borderColor:'#ffffff'}} className="me-3 showDesktop">
              <Link to={`/${lang}`} className="text-deco-none" style={{color:'#ffffff'}}>
                <span className='px-1'>Home</span>
              </Link>
            </Button>
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

      <div style={{height:'100px'}}></div>
        {/* <div className='d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center'>
          <div>
            <Link to='/' className='d-flex aling-items-center gap-1 width-max-content p-2 btn-back-home'>
              <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 333.33" style={{width:'20px', height:'auto'}}>
                <path d="M33.33,166.67h533.33M33.33,166.67L166.67,33.33M33.33,166.67l133.33,133.33" style={{ fill: 'none', stroke: 'currentcolor', strokeLinecap:'round', strokeLinejoin:'round', strokeWidth:'66.67px'}}/>
              </svg>
              <span className='fw-bold'>HOME</span>
            </Link>
          </div>
          <div className='d-flex gap-3 align-items-center'>
          {
          activeAccount && 
            <div>
              <p className='fw-bold m-0 text-uppercase fs-4'>{activeAccount.name}</p>
              <p className='m-0'>{activeAccount.username}</p>
            </div>
          }
          <div>
            {
              activeAccount ?
              (
                <button className='syd-button m-0 btn-sign' onClick={signOut} title='Sign out'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                    <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                  </svg>
                </button>
              )
              :
              (
                <button className='syd-button m-0 btn-sign' onClick={signIn}>Sign in</button>
              )
            }
          </div>
        </div>
        </div> */}
                
        <div className='px-md-5 py-3 container'>
          <div className='row'>
            <div className='col-sm-12 col-md-3 p-2'>
              <Link to='dashboard' className='text-deco-none'>
                <Card className='card-admin-dash h-100 d-flex flex-column'>
                  <CardMedia sx={{ height: 180 }} image={imgDashboard} title="admin dashboard" className='bg-position'/>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{fontWeight: 600}}>Dashboard</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Change the style of the site.<br/>
                      Set the colours, enter and choose the information and sections to be displayed.
                    </Typography>
                  </CardContent>
                  <CardActions className='d-flex justify-content-end mt-auto'>
                    <Button size="small" endIcon={<ArrowForwardIosIcon />}>
                      <span className='px-1'>Explore</span>
                    </Button>
                  </CardActions>
                </Card>
              </Link>
            </div>
            <div className='col-sm-12 col-md-3 p-2'>
              <Link to='labels' className='text-deco-none'>
                <Card className='card-admin-dash h-100 d-flex flex-column'>
                  <CardMedia sx={{ height: 180 }} image={imgLabels} title="admin labels" className='bg-position'/>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{fontWeight: 600}}>Labels</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Change your labels and all textual content on your site.
                    </Typography>
                  </CardContent>
                  <CardActions className='d-flex justify-content-end mt-auto'>
                    <Button size="small" endIcon={<ArrowForwardIosIcon />}>
                        <span className='px-1'>Explore</span>
                    </Button>
                  </CardActions>
                </Card>
              </Link>
            </div>
            <div className='col-sm-12 col-md-3 p-2'>
              <Link to='labels-json' className='text-deco-none'>
                <Card className='card-admin-dash h-100 d-flex flex-column'>
                  <CardMedia sx={{ height: 180 }} image={imgLabelsJson} title="admin labels json" className='bg-position'/>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{fontWeight: 600}}>Labels JSON</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Are you a nerd? Edit your texts from a single JSON file!
                    </Typography>
                  </CardContent>
                  <CardActions className='d-flex justify-content-end mt-auto'>
                    <Button size="small" endIcon={<ArrowForwardIosIcon />}>
                      <span className='px-1'>Explore</span>
                    </Button>
                  </CardActions>
                </Card>
              </Link>
            </div>
            <div className='col-sm-12 col-md-3 p-2'>
              <Link to='knowledge-base-admin' className='text-deco-none'>
                <Card className='card-admin-dash h-100 d-flex flex-column'>
                  <CardMedia sx={{ height: 180 }} image={imgKb} title="admin knowledge base" className='bg-position'/>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{fontWeight: 600}}>Knowledge Base</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage knowledge base documents
                    </Typography>
                  </CardContent>
                  <CardActions className='d-flex justify-content-end mt-auto'>
                    <Button size="small" endIcon={<ArrowForwardIosIcon />}>
                      <span className='px-1'>Explore</span>
                    </Button>
                  </CardActions>
                </Card>
              </Link>
            </div>

            {/* {
              appOwner !== 'indastria' &&
              <>
                <div className='col-sm-12 col-md-3 p-2'>
                  <Link to='client-stories' className='text-deco-none'>
                    <Card className='card-admin-dash h-100 d-flex flex-column'>
                      <CardMedia sx={{ height: 180 }} image={imgClientStories} title="admin client stories" className='bg-position'/>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div" sx={{fontWeight: 600}}>Client Stories</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Create an article for your best success stories!
                        </Typography>
                      </CardContent>
                      <CardActions className='d-flex justify-content-end mt-auto'>
                        <Button size="small" endIcon={<ArrowForwardIosIcon />}>
                          <span className='px-1'>Explore</span>
                        </Button>
                      </CardActions>
                    </Card>
                  </Link>
                </div>
                <div className='col-sm-12 col-md-3 p-2'>
                <Link to='news' className='text-deco-none'>
                  <Card className='card-admin-dash h-100 d-flex flex-column'>
                      <CardMedia sx={{ height: 180 }} image={imgNews} title="admin news" className='bg-position'/>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div" sx={{fontWeight: 600}}>News</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Keep your audience updated within your blog!
                        </Typography>
                      </CardContent>
                      <CardActions className='d-flex justify-content-end mt-auto'>
                        <Button size="small" endIcon={<ArrowForwardIosIcon />}>
                          <span className='px-1'>Explore</span>
                        </Button>
                      </CardActions>
                    </Card>
                  </Link>
                </div>
              </>
            } */}
          </div>
        </div>

      </div> 
    </MsalAuthenticationTemplate>
  );
};
