import React, { useState, useContext, useEffect } from 'react';
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
import imgClientStories from "../../assets/image/admin-dash/client-stories.svg";
import imgNews from "../../assets/image/admin-dash/news.svg";
import KbAdminList from '../../components/kb/admin-list';
import KbArticleEditor from '../../components/kb/article-editor';
import KbVersionHistory from '../../components/kb/version-history';
import KbCategoryManager from '../../components/kb/category-manager';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const appOwner = process.env.REACT_APP_OWNER;

export const SydeaKnowledgeBaseAdmin = () => {
  const { lang } = useParams();
  const { instance, inProgress } = useMsal();
  let activeAccount;

  if (instance) {
      activeAccount = instance.getActiveAccount();
  }

  document.title = 'Admin';
  const { services: {TranslationsService} } = useContext(AppContext);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [articleLanguage, setArticleLangu] = useState('it');
  const [azureGroups, setAzureGroups] = useState([]);
  const [groupsLoaded, setGroupsLoaded] = useState(false);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const signIn = () => {
    instance.loginRedirect().catch((error) => console.log(error));
  };
  
  const signOut = () => {
    instance.logoutRedirect();
  };

  const loadAzureGroups = async () => {

    try {

      const cachedGroups = sessionStorage.getItem("azure-site-groups");

      if (cachedGroups) {
        setAzureGroups(JSON.parse(cachedGroups));
        return;
      }

      const tokenRequest = {
        scopes: ["Group.Read.All"]
      };

      const response = await instance.acquireTokenSilent(tokenRequest);

      const accessToken = response.accessToken;

      const graphResponse = await fetch(
        "https://graph.microsoft.com/v1.0/groups?$select=id,displayName&$top=999",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            ConsistencyLevel: "eventual",
          },
        }
      );

      if (!graphResponse.ok) {
        throw new Error(`Graph error ${graphResponse.status}`);
      }

      const data = await graphResponse.json();

      const mappedGroups = data.value
        .filter(group =>
          group.displayName?.toLowerCase().startsWith("website-")
        )
        .sort((a, b) =>
          a.displayName.localeCompare(b.displayName)
        )
        .map(group => ({
          id: group.id,
          name: group.displayName
        }));

      sessionStorage.setItem(
        "azure-site-groups",
        JSON.stringify(mappedGroups)
      );

      setAzureGroups(mappedGroups);

    } catch (err) {
      console.error("Errore caricamento gruppi Azure:", err);
    }
  };

  useEffect(() => {

    if (
      activeAccount &&
      inProgress === InteractionStatus.None &&
      azureGroups.length === 0
    ) {
      loadAzureGroups();
    }

  }, [activeAccount, inProgress]);

  const saveText = () =>{
    let _htmlText = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    let buff = Buffer.from(_htmlText, "utf8");
    let base64 = buff.toString("base64");
  }

  const setArticleLanguage = (languSel) =>{
    setArticleLangu(languSel);
  }

  // State nella pagina admin
  const [editorOpen, setEditorOpen]         = useState(false);
  const [editorArticle, setEditorArticle]   = useState(null);
  const [editorLang, setEditorLang]         = useState('it');
  const [editorCategory, setEditorCategory] = useState('');
  const [editorSubcategory, setEditorSubcategory] = useState('');
  const [editorHeaderCategoryAndSub, setEditorHeaderCategoryAndSub] = useState('');
  const [kbListKey, setKbListKey] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyArticleTitle, setHistoryArticleTitle] = useState(null);
  const [historyArticleId, setHistoryArticleId] = useState(null);
  const [historyLang, setHistoryLang] = useState("it");
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const [kbIndex, setKbIndex] = useState(null);
  const [editorExistingId, setEditorExistingId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Handler passato a KbAdminList
  const handleEdit = (articleId, article, lang, existingId, categoryId, subcategoryId) => {
    setEditorArticle(article);
    setEditorLang(lang);
    // setEditorCategory(article?.category ?? '');
    // setEditorSubcategory(article?.subcategory ?? '');
    // setEditorExistingId(articleId);
    // const catLabel = !article.categoryLabel || !article.subcategoryLabel ? `${categoryId} / ${subcategoryId}`:`${article.categoryLabel} / ${article.subcategoryLabel}`;
    // setEditorHeaderCategoryAndSub(catLabel);
    setEditorHeaderCategoryAndSub(article ? `${article.categoryLabel} / ${article.subcategoryLabel}` : `${categoryId} / ${subcategoryId}`);
    setEditorCategory(categoryId ?? article?.category ?? '');
    setEditorSubcategory(subcategoryId ?? article?.subcategory ?? '');
    setEditorExistingId(existingId ?? null);
    setEditorOpen(true);
  };

  const saveArticleKB = async (formData) => {
    showFeedback("Salvataggio in corso...", "info");
    try {
      const res = await fetch(`${process.env.REACT_APP_KB_API_URL}/kb`, {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({
          action : "save_article",
          payload: {
            ...formData,
            author: activeAccount?.name ?? "admin",
          },
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      await reloadIndex();
      // setEditorOpen(false);
      // setEditorExistingId(null);
      showFeedback("Articolo salvato", "success");
    } catch (err) {
      console.error("Errore salvataggio:", err);
      showFeedback("Errore durante il salvataggio.", "error");
    }
  }

  const reloadIndex = () => {
    setKbListKey(prev => prev + 1);
  };

  const handleStatusChange = async (articleId, article, lang, newStatus, notes) => {
    showFeedback("Aggiornamento stato in corso...", "info");
    try {
      const res = await fetch(`${process.env.REACT_APP_KB_API_URL}/kb`, {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({
          action : "save_article",
          payload: {
            id          : articleId,
            lang,
            title       : article.title,
            answer      : null,
            status      : newStatus,
            version     : article.version,
            groups      : article.groups,
            tags        : article.tags,
            godMode     : article.godMode,
            summary     : article.summary,
            changes     : notes,
            author      : activeAccount?.name ?? "admin",
          },
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      reloadIndex();
      showFeedback(`Stato aggiornato: ${newStatus}`, "success");
    } catch (err) {
      console.error("Errore cambio stato:", err);
      showFeedback("Errore durante il cambio stato.", "error");
    }
  };

  const handleHistory = (articleId, article, lang) => {
    setHistoryArticleId(articleId);
    setHistoryArticleTitle(article.title);
    setHistoryLang(lang);
    setHistoryOpen(true);
  };

  const handleAdd = (categoryId, subcategoryId) => {
    setEditorArticle(null);        // nuovo articolo
    setEditorLang("it");           // lingua default
    setEditorCategory(categoryId);
    debugger;
    setEditorSubcategory(subcategoryId);
    setEditorHeaderCategoryAndSub(`${categoryId} / ${subcategoryId}`);
    setEditorOpen(true);
  };

  const handleDelete = async (articleId, lang) => {
    showFeedback("Eliminazione in corso...", "info");
    try {
      const res = await fetch(`${process.env.REACT_APP_KB_API_URL}/kb`, {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({
          action : "delete_article",
          payload: {
            id    : articleId,
            lang,
            author: activeAccount?.name ?? "admin",
          },
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await reloadIndex();
      showFeedback(`Articolo ${articleId} (${lang.toUpperCase()}) eliminato`, "success");
    } catch (err) {
      console.error("Errore eliminazione:", err);
      showFeedback("Errore durante l'eliminazione. Riprova.", "error");
    }
  };

  const showFeedback = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };
    
  return (
    <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
      <div className='section-home light'>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" style={{backgroundColor:'#141414'}}>
          <Toolbar className='justify-content-between'>
          <IconButton variant="outlined" style={{color:'#ffffff', borderColor:'#ffffff'}} className="me-3 showMobile">
            <Link to={`/${lang}/syd-admin`}  className="text-deco-none" style={{color:'#ffffff'}}>
              <ArrowBackIosIcon/>
            </Link>
          </IconButton>
          <Button variant="outlined" startIcon={<ArrowBackIosIcon />} style={{color:'#ffffff', borderColor:'#ffffff'}} className="me-3 showDesktop">
            <Link to={`/${lang}/syd-admin`}  className="text-deco-none" style={{color:'#ffffff'}}>
              <span className='px-1'>Back</span>
            </Link>
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className="showDesktop">
            Knowledge base - Admin
          </Typography>
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

        <div className='container pb-5'>
          <KbCategoryManager
            open={categoryManagerOpen}
            onClose={() => setCategoryManagerOpen(false)}
            index={kbIndex}
            apiUrl={process.env.REACT_APP_KB_API_URL}
            onSaved={reloadIndex}
          />
          <KbAdminList
            key={kbListKey}
            pathUrl={process.env.REACT_APP_BASE_URL}
            apiUrl={process.env.REACT_APP_KB_API_URL}
            onEdit={handleEdit}
            onHistory={handleHistory}
            onAdd={handleAdd}
            onStatusChange={handleStatusChange}
            onManageCategories={() => setCategoryManagerOpen(true)}
            onIndexLoaded={(data) => setKbIndex(data)}
            onDelete={handleDelete}
          />

          <KbArticleEditor
            open={editorOpen}
            onClose={() => {
              setEditorOpen(false);
              setEditorExistingId(null);
            }}
            onSave={(formData) => saveArticleKB(formData)}
            article={editorArticle}
            lang={editorLang}
            categoryId={editorCategory}
            subcategoryId={editorSubcategory}
            pathUrl={process.env.REACT_APP_BASE_URL}
            existingId={editorExistingId}
            editorHeaderCategoryAndSub={editorHeaderCategoryAndSub}
            azureGroups={azureGroups}
          />
        </div>

        <KbVersionHistory
          open={historyOpen}
          onClose={() => setHistoryOpen(false)}
          articleTitle={historyArticleTitle}
          articleId={historyArticleId}
          lang={historyLang}
          pathUrl={process.env.REACT_APP_BASE_URL}
          apiUrl={process.env.REACT_APP_KB_API_URL}
          authorName={activeAccount?.name ?? "admin"}
          onRollbackDone={() => {
            reloadIndex();
            setHistoryOpen(false);
          }}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={snackbar.severity === "info" ? null : 4000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

      </div> 
    </MsalAuthenticationTemplate>
  );
};
