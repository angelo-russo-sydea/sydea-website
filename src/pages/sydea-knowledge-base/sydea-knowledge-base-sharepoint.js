import React, { useState, useEffect, useRef, useMemo, useContext, Fragment } from "react";
import "./sydea-knowledge-base.scss";
import { Link, useSearchParams, useNavigate, useParams } from "react-router-dom";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import LoginIcon from "@mui/icons-material/Login";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ThemeProvider, createTheme, useColorScheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ListItemIcon from '@mui/material/ListItemIcon';
import ComputerIcon from '@mui/icons-material/Computer';
import PeopleIcon from '@mui/icons-material/People';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import axios from "axios";
import { Divider, Fab, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CropSquareIcon from '@mui/icons-material/CropSquare';
import HomeIcon from '@mui/icons-material/Home';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionActions from '@mui/material/AccordionActions';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary, {
  accordionSummaryClasses,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import parse, { domToReact } from 'html-react-parser';
import Fade from '@mui/material/Fade';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import DescriptionIcon from '@mui/icons-material/Description';
import ArticleIcon from '@mui/icons-material/Article';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { AppContext } from "../../services/translationContext";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ControlPointSharpIcon from '@mui/icons-material/ControlPointSharp';
import RemoveCircleOutlineSharpIcon from '@mui/icons-material/RemoveCircleOutlineSharp';
import ArticleBody from "./article-body";
import { EditorSuite } from "./eidtor-suite";
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SydeaExpansions from "./sydea-expansions";
import { getKnowledgeBaseDocuments } from "../../services/sharepointService";
import { getKnowledgeBaseTree } from "./knowledgeBaseService";
import FolderTree from "./FolderTree";
import DocumentList from "./DocumentList";

const pathUrl = process.env.REACT_APP_BASE_URL;


export const SydeaKnowledgeBaseSharepoint = () => {
  const { services: {TranslationsService} } = useContext(AppContext);
  const { lang } = useParams();
  const [mode, setMode] = useState(localStorage.getItem("sydea-theme") || "light");
  const themeMob = useTheme();
  const isMobile = useMediaQuery(themeMob.breakpoints.down("sm"));

  const [showLoader, setShowLoader] = useState(false);

  const [tree, setTree] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);

  const language = "IT"; // in futuro da i18n
  const officeLocation = "Italy"; // da profilo utente
  
  useEffect(() => {
    localStorage.setItem("sydea-theme", mode);
    document.body.setAttribute("data-theme", mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
        },
      }),
    [mode]
  );

  useEffect(() => {
    sessionStorage.removeItem("viewedDocs");
  }, []);

  const { instance, accounts } = useMsal();
  let activeAccount;

  if (instance) {
    activeAccount = instance.getActiveAccount();
  }

  document.title = "Sydea | Knowledge Base";

  useEffect(() => {
    getKnowledgeBaseTree().then(setTree).then(console.log('tree ',tree));
  }, []);

  const signOut = () => {
    instance.logoutRedirect();
  };

  const signIn = () => {
    instance.loginRedirect().catch((error) => console.log(error));
  };
  
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const SITE_ID = "sydea.sharepoint.com,f85506b9-be07-4a88-848b-f34f9b46aa2a,e8ffd5bf-c813-414a-b246-b8656f7d8fff";
  const LIST_ID = "LIST_ID_KNOWLEDGE_BASE";
  const OFFICE_LOCATION = "Italy";

  useEffect(() => {
    async function loadDocuments() {
      try {
        const tokenResponse = await instance.acquireTokenSilent({
          // ...loginRequest,
          account: accounts[0],
        });

          // const getUserData = async () => {
          //   if (accounts.length > 0) {
          //     const request = {
          //       scopes: ["User.Read"],
          //       account: accounts[0]
          //     };
          //     try {
          //       const authResult = await instance.acquireTokenSilent(request);
          //       const response = await axios.get(
          //         "https://graph.microsoft.com/v1.0/me",
          //         { headers: { Authorization: `Bearer ${authResult.accessToken}` } }
          //       );
          //       const user = response.data;
          //       setUserData(user);
          //     } catch (error) {
          //       console.error("Error fetching user data:", error);
          //     }
          //   }
          // };

        const data = await getKnowledgeBaseDocuments(
          tokenResponse.accessToken,
          SITE_ID,
          LIST_ID,
          OFFICE_LOCATION
        );

        setDocuments(data.value);
      } catch (error) {
        console.error("Errore KB:", error);
      } finally {
        setLoading(false);
      }
    }

    if (accounts.length > 0) {
      loadDocuments();
    }
  }, [accounts, instance]);

  if (loading) return <p>Caricamento Knowledge Base…</p>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
        
    <div style={{ display: "flex", gap: 40 }}>
      <aside style={{ width: "30%" }}>
        <FolderTree
          items={tree}
          language={language}
          onSelect={setCurrentFolder}
        />
      </aside>

      <main style={{ width: "70%" }}>
        {currentFolder ? (
          <DocumentList
            items={currentFolder.children || []}
            language={language}
            officeLocation={officeLocation}
          />
        ) : (
          <p>Seleziona una categoria</p>
        )}
      </main>
    </div>
        <iframe
          src='https://sydea.sharepoint.com/:w:/r/sites/YawClub/_layouts/15/Doc.aspx?sourcedoc=%7B5C7C86DB-0D23-4283-BADA-AF92693F27F7%7D&file=Regolamento%20Smartworking.docx&action=default&mobileredirect=true'
          title='skjhad'
          width="100%"
          height="900"
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px"
          }}
        />
      </MsalAuthenticationTemplate>
    </ThemeProvider>
  );
};
