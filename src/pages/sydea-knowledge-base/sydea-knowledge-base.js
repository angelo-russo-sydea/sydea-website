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
import { Chip, Divider, Fab, useMediaQuery } from "@mui/material";
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
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import SydeaExpansions from "./sydea-expansions";
import mockupQuestions from "../../../src/template/questions.json";
import documentKb from "../../../src/template/documentKb.json";
import EditIcon from '@mui/icons-material/Edit';
import LanguageDropdown from "../../components/menu/menu";

const pathUrl = process.env.REACT_APP_BASE_URL;
const superAdminList = ['angelo.russo@sydea.com', 'tony.devivo@sydea.com', 'yuri.devivo@sydea.com', 'gianmichele.mele@sydea.com'];
const stopDynamo = false;
const AUTHORIZED_GROUPS = {
  ADMIN: '8bfcf92e-49ee-4875-9cf1-fefc04137c12',
};

const AccordionKnowBase = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&::before": {
    display: "none",
  },
}));

const AccordionSummaryKnowBase = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "transparent",
  flexDirection: "row-reverse",
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: "rotate(90deg)",
    },
  [`& .${accordionSummaryClasses.content}`]: {
    margin: '8px 0',
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles("dark", {
  }),
}));

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
  },
  [`& .${linearProgressClasses.bar}`]: {
    backgroundColor: '#fece2f',
  },
}));

const AccordionVersions = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  // border: `1px solid ${theme.palette.divider}`,
  minHeight: 'inherit',
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummaryVersions = styled((props) => (
  <MuiAccordionSummary
    expandIcon={
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ControlPointSharpIcon className="icon-when-closed" sx={{ fontSize: '0.9rem' }} />
        <RemoveCircleOutlineSharpIcon className="icon-when-open" sx={{ fontSize: '0.9rem', display: 'none' }} />
      </div>
    }
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'transparent',
  flexDirection: 'row-reverse',
  minHeight: 'inherit',
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded} .icon-when-open`]: {
    display: 'block',
  },
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded} .icon-when-closed`]: {
    display: 'none',
  },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles('dark', {
    backgroundColor: 'transparent',
  }),
}));

const AccordionDetailsVersions = styled(MuiAccordionDetails)(({ theme }) => ({
  // padding: theme.spacing(2),
  // borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export const SydeaKnowledgeBase = () => {
  const { services: {TranslationsService} } = useContext(AppContext);
  const { lang } = useParams();
  // const { lang, category, subcategory, doc } = useParams();
  const { category: categorySlug, subcategory: subcategorySlug, doc: docSlug } = useParams();
  const [mode, setMode] = useState(localStorage.getItem("sydea-theme") || "light");
  const themeMob = useTheme();
  const isMobile = useMediaQuery(themeMob.breakpoints.down("sm"));

  const [showLoader, setShowLoader] = useState(false);
  const [userGroups, setUserGroups] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasAccess, setHasAccess] = useState(null);
  const [showAllDocAdmin, setShowAllDocAdmin] = useState(false);
  
  useEffect(() => {
    localStorage.setItem("sydea-theme", mode);
    document.body.setAttribute("data-theme", mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          sydea: {
            main: '#E3D026',
            light: '#E9DB5D',
            dark: '#A29415',
            contrastText: '#242105',
          },
        },
        typography: {
          fontFamily: 'Inter, Arial, sans-serif',
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

  const signOut = () => {
    instance.logoutRedirect();
  };

  const signIn = () => {
    instance.loginRedirect().catch((error) => console.log(error));
  };

  const [faqs, setFaqs] = useState({});
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [openDoc, setOpenDoc] = useState(null);

  const [openCategories, setOpenCategories] = useState([]);

  const findOriginalName = (slug, list) => list.find(name => slugify(name) === slug);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [dataQuestions, setDataQuestions] = useState(null);

  const [expandCategoryMobile, setExpandCategoryMobile] = useState([]);

  const cardContentRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [searchInDoc, setSearchInDoc] = useState("");
  const [searchInDocText, setSearchInDocText] = useState("");

  const [tableDocViews, setTableDocViews] = useState([]);
  const [popularDocs, setPopularDocs] = useState([]);
  const [latestUpdate, setLatestUpdate] = useState([]);
  const [categoryLabels, setCategoryLabels] = useState({});

  const filteredFaqs = useMemo(() =>
    Object.entries(faqs)
      .flatMap(([category, subcategories]) =>
        Object.entries(subcategories).flatMap(([subcategory, questions]) =>
          // questions.map((q) => ({ ...q, category, subcategory }))
          questions.map((q) => ({
            ...q,
            category,
            subcategory,
            categoryLabel  : categoryLabels[category]   || category,
            subcategoryLabel: categoryLabels[subcategory] || subcategory,
            path: `/${lang}/sydea-hub/sydea-knowledge-base/${slugify(category)}/${slugify(subcategory)}/${slugify(q.id)}`
          }))
        )
      )
      .filter((faq) => {
        const searchLower = search.toLowerCase();
        return (
          faq.id.toLowerCase().includes(searchLower) ||
          faq.question.toLowerCase().includes(searchLower) ||
          faq.category.toLowerCase().includes(searchLower) ||
          faq.subcategory.toLowerCase().includes(searchLower) ||
          faq.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }), [faqs, search, lang, categoryLabels]);

  const totalResults = filteredFaqs.length;
  const showTotalResults = search.length > 0;

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    const locale = lang === 'it' ? 'it-IT' : 'en-GB';
    return date.toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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

  useEffect(() => {
    if (!userData || !userData.officeLocation) return;

    setShowLoader(true);

    const fetchIndex = async () => {
      const res  = await fetch(
        `${pathUrl}/static/knowledge-base/index.json?_=${Date.now()}`,
        { cache: 'no-store' }
      );
      const index = await res.json();

      // const categoryLabels = {};
      // for (const cat of index.categories ?? []) {
      //   categoryLabels[cat.id] = cat.label ?? cat.id;
      //   for (const sub of cat.subcategories ?? []) {
      //     categoryLabels[sub.id] = sub.label ?? sub.id;
      //   }
      // }
      const getLabel = (item) => {
        if (lang === "it") return item.labelIT ?? item.id;
        return item.labelEN ?? item.id;
      };

      const categoryLabels = {};

      for (const cat of index.categories ?? []) {
        categoryLabels[cat.id] = getLabel(cat);

        for (const sub of cat.subcategories ?? []) {
          categoryLabels[sub.id] = getLabel(sub);
        }
      }
      setCategoryLabels(categoryLabels);
      // Filtra le voci dell'index per lingua, group e godMode

      // const visibleArticles = index.articles.filter(a => {
      //   if (a.lang !== lang) return false;
      //   const hasPublishedContent = a.lastPublishedVersion || a.status === "published";
      //   if (!hasPublishedContent) return false;
      //   if (a.godMode) return superAdminList.includes(activeAccount?.username);
      //   return a.groups.includes(userData.officeLocation);
      // });

      // const visibleArticles = index.articles
      //   .filter(a => {
      //     if (a.lang !== lang) return false;
      //     if (showAllDocAdmin) return true;
      //     // const isSuperAdmin = superAdminList.includes(activeAccount?.username);

      //     // const isSameVersion =
      //     //   a.version && a.lastPublishedVersion &&
      //     //   a.version === a.lastPublishedVersion.versionNumber;

      //     // if (a.godMode) {
      //     //   if (isSameVersion) return true;
      //     //   return isSuperAdmin;
      //     // }
      //     const hasPublishedContent =
      //       !!a.lastPublishedVersion || a.status === "published";
      //     if (!hasPublishedContent) return false;
      //     return a.groups.includes(userData.officeLocation);
      //   });

      const visibleArticles = index.articles
        .filter(a => a.lang === lang) // Manteniamo solo la lingua corretta
        .map(a => {
          // Verifichiamo se l'articolo è pubblicato
          const isPublished = !!a.lastPublishedVersion || a.status === "published";

          if (showAllDocAdmin) {
            // Se siamo in modalità Admin, li vogliamo tutti.
            // Aggiungiamo draftMode: true solo se NON è pubblicato.
            return { 
              ...a, 
              draftMode: !isPublished 
            };
          }

          // Se non siamo in modalità Admin, restituiamo solo quelli pubblicati
          // (o null per filtrarli via nel prossimo passaggio)
          return isPublished ? a : null;
        })
        .filter(a => a !== null); // Rimuoviamo i null (articoli non pubblicati per utenti standard)

      // Ricostruisce la struttura { category: { subcategory: [articleMeta, ...] } }
      const filteredData = {};
      for (const article of visibleArticles) {
        if (!filteredData[article.category]) {
          filteredData[article.category] = {};
        }
        if (!filteredData[article.category][article.subcategory]) {
          filteredData[article.category][article.subcategory] = [];
        }
        filteredData[article.category][article.subcategory].push({
          id         : article.id,
          question   : article.title,
          tags       : article.tags,
          popular    : article.popular ?? false,
          link       : article.link ?? '',
          group      : article.groups,
          azureGroups: article.azureGroups,
          godMode    : article.godMode,
          summary    : article.summary ?? false,
          lastPublishedVersion: article.lastPublishedVersion,
          status     : article.lastPublishedVersion?.status ?? article.status,
          version    : article.lastPublishedVersion?.versionNumber ?? article.version,
          lastUpdate : article.lastPublishedVersion?.date ?? article.lastUpdated,
          versions   : article.versions ?? [],
          answer     : null,
          draftMode  : article.draftMode || false
        });
      }

      // Riordina filteredData rispettando l'ordine dell'index
      const orderedFilteredData = {};
      for (const cat of index.categories) {
        if (!filteredData[cat.id]) continue;
        orderedFilteredData[cat.id] = {};
        for (const sub of cat.subcategories) {
          if (!filteredData[cat.id][sub.id]) continue;
          orderedFilteredData[cat.id][sub.id] = filteredData[cat.id][sub.id];
        }
      }

      setFaqs(orderedFilteredData);
      setCategories(index.categories.map(c => c.id).filter(id => orderedFilteredData[id]));
      setOpenCategories([]);
      setExpandCategoryMobile([]);

      // Salva anche l'index grezzo se ti serve altrove
      setDataQuestions(filteredData);

      setTimeout(() => setShowLoader(false), 500);
    };

    fetchIndex();
  }, [userData, lang, showAllDocAdmin, setDataQuestions, setCategories, setOpenCategories]);

  useEffect(() => {
   if (!dataQuestions) return; 
   const fetchViews = async () => {
     try {
      var data = null;
      if(stopDynamo){
        data = documentKb;
      }
      else{
       const response = await fetch("https://9g9tdvnxye.execute-api.eu-west-1.amazonaws.com/views", {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
         },
       });

       if (!response.ok) {
         throw new Error("Errore nella risposta dal server");
       }
       data = await response.json();
      }
       setTableDocViews(data);
       
       const top3Docs = data.sort((a, b) => b.views - a.views).slice(0, 3);
       const allQuestions = flattenDataQuestions(dataQuestions);
       // const popularDocuments = top3Docs.map(docView => allQuestions.find(q => q.id === docView.documentId)).filter(Boolean);
       const popularDocuments = top3Docs
         .map(docView => {
           const q = allQuestions.find(x => x.id === docView.documentId);
           if (!q) return null;

           return {
             ...q,
             path: `/${lang}/sydea-hub/sydea-knowledge-base/${slugify(q.category)}/${slugify(q.subcategory)}/${slugify(q.id)}`
           };
         })
         .filter(Boolean);
       setPopularDocs(popularDocuments);

      if (!Array.isArray(allQuestions)) return;

      const top3LatestQuestions = allQuestions
        .filter(q => {
          if (!q || q.status !== "published") return false;

          const isSameVersion =
            q.version &&
            q.lastPublishedVersion &&
            q.version === q.lastPublishedVersion.versionNumber;

          if (q.godMode) {
            return isSameVersion; // visibile a tutti solo se stessa versione
          }

          return true;
        })
        .map(q => {
          return {
            ...q,
            lastVersionDateStr: q.lastUpdate ?? q.lastPublishedVersion?.date ?? "",
            lastVersionDate   : parseDate(q.lastUpdate ?? q.lastPublishedVersion?.date ?? ""),
            statusTag         : '',
            path              : `/${lang}/sydea-hub/sydea-knowledge-base/${slugify(q.category)}/${slugify(q.subcategory)}/${slugify(q.id)}`
          };
        })
        .filter(q => q.lastVersionDate)
        .sort((a, b) => b.lastVersionDate - a.lastVersionDate)
        .slice(0, 3);

      setLatestUpdate(top3LatestQuestions);


       // const top3LatestQuestions = allQuestions.filter(x => !x.godMode)
       //   // .map(q => {
       //   //   const lastVersion = q.versions[q.versions.length - 1];
       //   //   return {
       //   //     ...q,
       //   //     lastVersion,
       //   //     lastVersionDateStr: lastVersion.date,
       //   //     lastVersionDate: parseDate(lastVersion.date), // usata solo per ordinamento
       //   //     statusTag: getStatusTag(lastVersion)
       //   //   };
       //   // })
       //   .map(q => {
       //     const lastVersion = q.versions[q.versions.length - 1];
       //     return {
       //       ...q,
       //       lastVersion,
       //       lastVersionDateStr: lastVersion.date,
       //       lastVersionDate: parseDate(lastVersion.date),
       //       statusTag: getStatusTag(lastVersion),
       //       path: `/${lang}/sydea-hub/sydea-knowledge-base/${slugify(q.category)}/${slugify(q.subcategory)}/${slugify(q.id)}`
       //     };
       //   })
       //   .sort((a, b) => b.lastVersionDate - a.lastVersionDate)
       //   .slice(0, 3);

       // setLatestUpdate(top3LatestQuestions);
       // const popularDocuments = top3Docs.map(docView => dataQuestions.find(q => q.id === docView.documentId)).filter(Boolean)
       // setPopularDocs(popularDocuments);

       // const filteredData = Object.entries(localizedData).reduce((acc, [category, topics]) => {
       //   const filteredTopics = Object.entries(topics).reduce((accTopics, [topic, questions]) => {
       //     const filteredQuestions = questions.filter(q => q.group.includes(userData.officeLocation));
       //     if (filteredQuestions.length > 0) {
       //       accTopics[topic] = filteredQuestions;
       //     }
       //     return accTopics;
       //   }, {});
   
       //   if (Object.keys(filteredTopics).length > 0) {
       //     acc[category] = filteredTopics;
       //   }
       //   return acc;
       // }, {});
       // // setFaqs(filteredData);

       // const popular = [];
       // Object.entries(filteredData).forEach(([category, topics]) => {
       //   Object.entries(topics).forEach(([topic, questions]) => {
       //     questions.forEach(q => {
       //       if (q.popular) {
       //         popular.push(q);
       //       }
       //     });
       //   });
       // });
       // setPopularQuestions(popular);


   // const data = await response.json();
   
   // const localizedData = data[lang];
   // setDataQuestions(localizedData);
   // const categoryList = Object.keys(data[lang]);
   // setCategories(categoryList);
   // setOpenCategories([]);
   // setExpandCategoryMobile([]);
  
   // const filteredData = Object.entries(localizedData).reduce((acc, [category, topics]) => {
   //   const filteredTopics = Object.entries(topics).reduce((accTopics, [topic, questions]) => {
   //     const filteredQuestions = questions.filter(q => q.group.includes(userData.officeLocation));
   //     if (filteredQuestions.length > 0) {
   //       accTopics[topic] = filteredQuestions;
   //     }
   //     return accTopics;
   //   }, {});
  
   //   if (Object.keys(filteredTopics).length > 0) {
   //     acc[category] = filteredTopics;
   //   }
   //   return acc;
   // }, {});
   // setFaqs(filteredData);

   // const popular = [];
   // Object.entries(filteredData).forEach(([category, topics]) => {
   //   Object.entries(topics).forEach(([topic, questions]) => {
   //     questions.forEach(q => {
   //       if (q.popular) {
   //         popular.push(q);
   //       }
   //     });
   //   });
   // });
   // setPopularQuestions(popular);

     } catch (err) {
      console.log(err)
       // setError(err.message);
     } finally {
       // setLoading(false);
     }
   };
   fetchViews();
  }, [dataQuestions]);

  useEffect(() => {
    if (!faqs || Object.keys(faqs).length === 0) return;

    const findOriginalName = (slug, list) =>
      list.find(name => slugify(name) === slug);

    let cat = null;
    let sub = null;
    let doc = null;

    if (categorySlug) {
      cat = findOriginalName(categorySlug, Object.keys(faqs));
    }

    if (cat) {
      setSelectedCategory(cat);
      setOpenCategories([cat]);
    } else {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setOpenDoc(null);
      return;
    }

    if (subcategorySlug) {
      sub = findOriginalName(
        subcategorySlug,
        Object.keys(faqs[cat] || {})
      );
    }

    if (sub) {
      setSelectedSubcategory(sub);
    } else {
      setSelectedSubcategory(null);
      setOpenDoc(null);
      return;
    }

    if (docSlug) {
      const docList = faqs?.[cat]?.[sub] || [];
      doc = docList.find(
        f => slugify(f.id) === docSlug
      );
    }
    if (doc) {
      setOpenDoc(doc.id);
      fetchArticleContent(doc.id);
    } else {
      setOpenDoc(null);
    }
  }, [faqs, categorySlug, subcategorySlug, docSlug]);

  const parseDate = (str) => {
    if (!str) return null;
    // Formato nuovo: "2026-03-18 10:31" o "2026-03-18"
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
      return new Date(str.replace(" ", "T"));
    }
    // Formato vecchio: "DD/MM/YYYY"
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
      const [d, m, y] = str.split("/");
      return new Date(`${y}-${m}-${d}`);
    }
    return null;
  };

  // const getStatusTag = (lastVersion) => {
  //   const now = new Date();
  //   const versionDate = parseDate(lastVersion.date);
  //   const diffTime = Math.abs(now - versionDate);
  //   const diffDays = diffTime / (1000 * 60 * 60 * 24);
  //   const isWithinOneMonth = diffDays <= 30;

  //   if (lastVersion.status === "Published") {
  //     if (lastVersion.version_number === "0" && isWithinOneMonth) {
  //       return (
  //         <span className="kb-tag-status new">
  //           <span className="kb-tag-status-text m-0">NEW</span>
  //         </span>
  //       );
  //     }
  //   }

  //   if (lastVersion.status === "Released") {
  //     if (lastVersion.version_number !== "0" && isWithinOneMonth) {
  //       return (
  //         <span className="kb-tag-status updated">
  //           <span className="kb-tag-status-text m-0">UPDATED</span>
  //         </span>
  //       );
  //     }
  //     return (
  //       <span className="kb-tag-status draft">
  //         <span className="kb-tag-status-text m-0">DRAFT</span>
  //       </span>
  //     );
  //   }

  //   if (lastVersion.status === "Draft") {
  //     return (
  //       <span className="kb-tag-status draft">
  //         <span className="kb-tag-status-text m-0">DRAFT</span>
  //       </span>
  //     );
  //   }

  //   return null;
  // };

  // function flattenDataQuestions(data) {
  //   const allQuestions = [];
  //   Object.values(data).forEach(categoryObj => {
  //     Object.values(categoryObj).forEach(questionArray => {
  //       allQuestions.push(...questionArray);
  //     });
  //   });
  //   return allQuestions;
  // }

  function getStatusTag({ status, versionNumber }) {
    const s = (status ?? "").toLowerCase();

    if (s === "published") {
      return <span className="kb-tag-status new"><span className="kb-tag-status-text m-0">NEW</span></span>;
    }
    if (s === "draft") {
      return <span className="kb-tag-status draft"><span className="kb-tag-status-text m-0">DRAFT</span></span>;
    }
    if (s === "approved") {
      return <span className="kb-tag-status approved"><span className="kb-tag-status-text m-0">APPROVED</span></span>;
    }
    return null;
  }

  const flattenDataQuestions = (data) =>
    Object.entries(data).flatMap(([category, subcategories]) =>
      Object.entries(subcategories).flatMap(([subcategory, questions]) =>
        questions.map(q => ({
          ...q,
          category,
          subcategory
        }))
      )
    );

  useEffect(() => {
    const newsId = searchParams.get("itemid");
    if (newsId && dataQuestions) {
      const allQuestions = [];
  
      Object.values(dataQuestions).forEach(topics => {
        Object.values(topics).forEach(questions => {
          allQuestions.push(...questions);
        });
      });
  
      const newsItem = allQuestions.find(item => item.id === newsId);
      if (newsItem) {
        setSearch(newsItem.question);
        navigate(window.location.pathname, { replace: true });
        setSelectedQuestion(newsItem.id);
      }
    }
  }, [searchParams, dataQuestions]);

  function generateIndexAndParseAnswer(answerHtml, faqId) {
    const headings = [];
    let sectionCounter = 0;
    let subsectionCounter = 0;
    let subsubsectionCounter = 0;
  
    const extractTitleText = (node) => {
      if (!node || !node.children) return '';
  
      let text = '';
  
      for (const child of node.children) {
        if (child.type === 'text') {
          text += child.data;
        } else if (child.type === 'tag') {
          if (child.name === 'div' || child.name === 'p' || child.name === 'ul') {
            break;
          } else {
            text += extractTitleText(child);
          }
        }
      }
      return text.trim();
    };
  
    const options = {
      replace: (domNode) => {
        if (domNode.type === 'tag' && domNode.name === 'a' && domNode.attribs && domNode.attribs.class === 'icon-back-to-top') {
          const id = domNode.attribs.href?.replace('#', '') || 'faqId';
          return (
            <a
              href={`#${id}`}
              className="icon-back-to-top"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(id);
                if (el) {
                  const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
                  window.scrollTo({ top: y - 70, behavior: 'smooth' });
                }
              }}
            >
              <svg viewBox='0 0 24 24' fill='none'>
                <path d='M10.7071 9.70711C10.3166 10.0976 9.68342 10.0976 9.29289 9.70711C8.90237 9.31658 8.90237 8.68342 9.29289 8.29289L14.2929 3.29289C14.6834 2.90237 15.3166 2.90237 15.7071 3.29289L20.7071 8.29289C21.0976 8.68342 21.0976 9.31658 20.7071 9.70711C20.3166 10.0976 19.6834 10.0976 19.2929 9.70711L16 6.41421V16C16 17.3261 15.4732 18.5979 14.5355 19.5355C13.5979 20.4732 12.3261 21 11 21H4C3.44772 21 3 20.5523 3 20C3 19.4477 3.44772 19 4 19H11C11.7956 19 12.5587 18.6839 13.1213 18.1213C13.6839 17.5587 14 16.7957 14 16V6.41421L10.7071 9.70711Z' fill='currentColor'/>
              </svg>
            </a>
          );
        }
        if (domNode.type === 'tag' && domNode.attribs && domNode.attribs.class) {
          const className = domNode.attribs.class;
      
          if (className === 'section-know-base') {
            sectionCounter++;
            subsectionCounter = 0;
            subsubsectionCounter = 0;
            const id = `${faqId}-section-${sectionCounter}`;
            domNode.attribs.id = id;
            const text = extractTitleText(domNode);
            headings.push({ id, text: `${sectionCounter}. ${text}`, level: 1, cssClass: 'fw-bold' });
          } else if (className === 'subsection-know-base') {
            subsectionCounter++;
            subsubsectionCounter = 0;
            const id = `${faqId}-section-${sectionCounter}-${subsectionCounter}`;
            domNode.attribs.id = id;
            const text = extractTitleText(domNode);
            headings.push({ id, text: `${sectionCounter}.${subsectionCounter}. ${text}`, level: 2, cssClass: 'no-bold' });
          } else if (className === 'subsubsection-know-base') {
            subsubsectionCounter++;
            const id = `${faqId}-section-${sectionCounter}-${subsectionCounter}-${subsubsectionCounter}`;
            domNode.attribs.id = id;
            const text = extractTitleText(domNode);
            headings.push({ id, text: `${sectionCounter}.${subsectionCounter}.${subsubsectionCounter}. ${text}`, level: 3, cssClass: 'no-bold' });
          }
        }
      },
    };
    
    let htmlText = answerHtml.replaceAll("[ICONA-BACK-TO-TOP]", `<a href='#${faqId}' title='Back to summary' class='icon-back-to-top'></a>`);
    const parsedAnswer = parse(htmlText, options);
  
    const buildNestedIndex = (headings) => {
      const root = [];
      const stack = [];
  
      for (const heading of headings) {
        const node = { ...heading, children: [] };
  
        while (stack.length > 0 && stack[stack.length - 1].level >= node.level) {
          stack.pop();
        }
  
        if (stack.length === 0) {
          root.push(node);
          stack.push(node);
        } else {
          stack[stack.length - 1].children.push(node);
          stack.push(node);
        }
      }
  
      return root;
    };
  
    const nestedIndex = buildNestedIndex(headings);
  
    const renderIndex = (items) => {
      if (!items || items.length === 0) return null;
  
      return (
        <ul className="kb-index">
          {items.map(({ id, text, children, cssClass }) => (
            <li key={id} className={cssClass}>
              <a href={`#${id}`}>{text}</a>
              {renderIndex(children)}
            </li>
          ))}
        </ul>
      );
    };
    const index = renderIndex(nestedIndex);
    return { index, parsedAnswer };
  }

  function generateParsedAnswer(answerHtml) {
    const parsedAnswer = parse(answerHtml);
    return { parsedAnswer };
  }
  
  const handleClickOutside = (event) => {
    const menuContent = document.getElementById('mobile-menu-content');
    if (mobileMenuOpen && menuContent && !menuContent.contains(event.target)) {
      const isMenuButton = event.target.closest('[aria-label="toggle-menu"]');
      if (!isMenuButton) {
        setMobileMenuOpen(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleChangeFirstLevel = (panel) => (event, isExpanded) => {
    setExpandCategoryMobile((prev) => {
      if (isExpanded) {
        return [...prev, panel];
      } else {
        return prev.filter((item) => item !== panel);
      }
    });
  };

  const getIconCategory = (category) => {
    switch (category) {
      case 'information-technology': return <ComputerIcon color={selectedCategory === category ? "inherit" : "action"}/>;
      case 'hr': return <PeopleIcon color={selectedCategory === category ? "inherit" : "action"}/>;
      case 'operations-projects': case 'Operazioni/Progetti': return <LightbulbIcon color={selectedCategory === category ? "inherit" : "action"}/>;
      case 'health-safety': case 'Salute & Sicurezza': return <HealthAndSafetyIcon color={selectedCategory === category ? "inherit" : "action"}/>;
      case 'planning': return <CalendarMonthIcon color={selectedCategory === category ? "inherit" : "action"}/>;
      default: return <CropSquareIcon color={selectedCategory === category ? "inherit" : "action"}/>;
    }
  }

  useEffect(() => {
    const checkCardHeight = () => {
      if (cardContentRef.current) {
        const cardHeight = cardContentRef.current.offsetHeight;
        const windowHeight = window.innerHeight;
        setShowScrollTop(cardHeight > windowHeight);
      }
    };

    checkCardHeight();
    window.addEventListener('resize', checkCardHeight);
    return () => window.removeEventListener('resize', checkCardHeight);
  }, [selectedQuestion]);

  const onchangeSearch = (text) => {
    setSearch(text.trim());
    setSearchText(text);
  }

const openDocument = (faq, subcategoryArg) => {
  const slug = slugify(faq.id);
  const cat = selectedCategory; // la categoria viene sempre dallo stato
  const sub = subcategoryArg || selectedSubcategory; // mobile: passo subcategoryArg, desktop: usa selectedSubcategory

  if (!cat || !sub) return; // protezione

  if (openDoc === faq.id) {
    setOpenDoc(null);
    navigate(`/${lang}/sydea-hub/sydea-knowledge-base/${slugify(cat)}/${slugify(sub)}`);
  } else {
    setOpenDoc(faq.id);
    navigate(`/${lang}/sydea-hub/sydea-knowledge-base/${slugify(cat)}/${slugify(sub)}/${slug}`);
  }
};

  const selectSubcategory = (cat, sub) => {
    setSelectedCategory(cat);
    setSelectedSubcategory(sub);
    setOpenCategories([cat]);
    setOpenDoc(null);

    navigate(
      `/${lang}/sydea-hub/sydea-knowledge-base/${slugify(cat)}/${slugify(sub)}`
    );
  };

  const selectCategory = (cat) => {
  const isAlreadyOpen = openCategories.includes(cat);

  if (isAlreadyOpen) {
    setSelectedCategory(null);
    setOpenCategories([]);
    setSelectedSubcategory(null);
    setOpenDoc(null);
    navigate(`/${lang}/sydea-hub/sydea-knowledge-base`);
  } else {
    setSelectedCategory(cat);
    setOpenCategories([cat]);
    setSelectedSubcategory(null);
    setOpenDoc(null);
    navigate(
      `/${lang}/sydea-hub/sydea-knowledge-base/${slugify(cat)}`
    );
  }
};

  const highlightTextFromGlobalSearch = (text) => {
    if (!search) return text;

    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <mark
              key={i}
              style={{
                backgroundColor: "#fff000",
                padding: "0 0",
                borderRadius: "2px",
              }}
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const getLabelTag = (faq) => {
    if (!faq.versions || faq.versions.length === 0) {
      return null;
    }

    const lastVersion = faq.versions[faq.versions.length - 1];

    const today = new Date();
    const versionDateParts = lastVersion.date.split("/");
    const versionDate = new Date(
      parseInt(versionDateParts[2], 10),
      parseInt(versionDateParts[1], 10) - 1,
      parseInt(versionDateParts[0], 10)
    );

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const isWithinOneMonth = versionDate >= oneMonthAgo && versionDate <= today;

    if (lastVersion.status === "Published") {
      if (lastVersion.version_number === "0" && isWithinOneMonth) {
        return <span className="kb-tag-status new"><span className="kb-tag-status-text m-0">NEW</span></span>;
      }
    }

    if (lastVersion.status === "Released") {
      if (lastVersion.version_number !== "0" && isWithinOneMonth) {
        return <span className="kb-tag-status updated"><span className="kb-tag-status-text m-0">UPDATED</span></span>;
      }
      return <span className="kb-tag-status draft"><span className="kb-tag-status-text m-0">DRAFT</span></span>;
    }
    if (lastVersion.status === "Draft") {
      return <span className="kb-tag-status draft"><span className="kb-tag-status-text m-0">DRAFT</span></span>;
    }
    return null;
  }

  // Funzione da aggiungere nel componente
  const fetchArticleContent = async (articleId) => {
    // Cerca se l'answer è già in memoria (non null)
    for (const cat of Object.keys(faqs)) {
      for (const sub of Object.keys(faqs[cat])) {
        const found = faqs[cat][sub].find(a => a.id === articleId);
        if (found && found.answer !== null && found.answer !== undefined) return;
      }
    }

    try {
      const res = await fetch(
        `${pathUrl}/static/knowledge-base/articles/${lang}/${articleId}.json?_=${Date.now()}`,
        { cache: 'no-store' }
      );
      const data = await res.json();

      // Trova il contenuto dell'ultima versione pubblicata
      const lastPublishedEntry = [...(data.versions ?? [])].reverse()
        .find(v => v.status === 'published');

      // Il contenuto pubblicato è lo snapshot della versione SUCCESSIVA
      // a quella pubblicata, oppure data.answer se è la versione corrente
      const publishedAnswer = (() => {
        if (!lastPublishedEntry) return data.answer;
        const publishedIndex = data.versions.findIndex(
          v => v === [...data.versions].reverse().find(v => v.status === 'published')
        );
        // Se la versione pubblicata è l'ultima, usa data.answer
        const versions = data.versions;
        const lastPubIdx = [...versions].map((v,i) => v.status === 'published' ? i : -1)
          .filter(i => i >= 0).pop();
        if (lastPubIdx === versions.length - 1) return data.answer;
        // Altrimenti usa lo snapshot della versione successiva
        return versions[lastPubIdx + 1]?.snapshot ?? data.answer;
      })();

      setFaqs(prev => {
        const next = { ...prev };
        for (const cat of Object.keys(next)) {
          for (const sub of Object.keys(next[cat])) {
            next[cat][sub] = next[cat][sub].map(a =>
              a.id === articleId
                ? { ...a, answer: publishedAnswer, versions: data.versions }
                : a
            );
          }
        }
        return next;
      });
    } catch (err) {
      console.error(`Errore caricamento articolo ${articleId}:`, err);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
        
        {/* <br/><br/><br/><SydeaExpansions /> */}
        <div className="section-home light position-relative p-4 padding-bottom-safe-area area-knowledge-base" style={{backgroundColor: mode === 'light' ? '#f6f6f6' : '#2d2d2d'}}>
          {/* backgroundColor: mode === 'light' ? '#f6f6f6' : '#2d2d2d', */}
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" style={{ backgroundColor: "#141414" }}>
              <Toolbar className="justify-content-between">
                <IconButton
                  variant="outlined"
                  style={{ color: "#ffffff", borderColor: "#ffffff" }}
                  className="me-3 showMobile"
                >
                  <Link
                    to={`/${lang}/sydea-hub`}
                    className="text-deco-none"
                    style={{ color: "#ffffff" }}
                  >
                    <ArrowBackIosIcon />
                  </Link>
                </IconButton>

                <div className="d-flex gap-2 align-items-center">
                  <div>
                    <Link
                      to={`/${lang}/sydea-hub`}
                      className="text-deco-none showDesktop"
                      style={{ color: "#ffffff" }}
                    >
                      <Button
                        variant="outlined"
                        startIcon={<ArrowBackIosIcon />}
                        style={{ color: "#ffffff", borderColor: "#ffffff" }}
                        className="me-3"
                      >
                        <span className="px-1">Hub</span>
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="d-flex gap-4 align-items-center">
                  {
                    hasAccess &&
                    <>
                    {
                      showAllDocAdmin &&
                      <div className="bar-admin-mod">
                        <p className="m-0">Visualizzazione Admin ON</p>
                      </div>
                    }
                      <IconButton onClick={() => setShowAllDocAdmin(prev => !prev)} color="inherit">
                        {showAllDocAdmin ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                      </IconButton>
                    </>
                  }
                  <IconButton onClick={() => setMode(mode === "light" ? "dark" : "light")} color="inherit">
                    {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                  </IconButton>
                  {/* <Link
                    to={`/${lang}/sydea-hub/sydea-knowledge-base/admin`}
                    className="text-deco-none showDesktop"
                    style={{ color: "#ffffff" }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      style={{ color: "#ffffff", borderColor: "#ffffff" }}
                      className="me-3"
                    >
                      <span className="px-1">Modifica (admin)</span>
                    </Button>
                  </Link> */}

                <div className='drop-langu-admin'>
                  <LanguageDropdown />
                </div>

                  <div className="d-flex gap-3 align-items-center">
                    {activeAccount && (
                      <div>
                        <Typography variant="p" component="div" sx={{ flexGrow: 1 }}>
                          {isMobile ? (
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                border: '1px solid #fff',
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textTransform: "uppercase",
                                fontSize: "0.8rem",
                              }}
                            >
                              {getInitials(activeAccount.name)}
                            </Box>
                          ) : (
                            <>
                              <p className="fw-bold text-uppercase m-0 fs-sm-6 fs-md-5 p-0" style={{ lineHeight: "normal" }}>{activeAccount.name}</p>
                              <p className="m-0 p-0 fs-6" style={{ lineHeight: "normal" }}>{activeAccount.username}</p>
                            </>
                          )}
                        </Typography>
                      </div>
                    )}
                    <div>
                      {activeAccount ? (
                        <IconButton
                          aria-label="delete"
                          style={{ color: "#ffffff" }}
                          onClick={signOut}
                        >
                          <LogoutIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          aria-label="delete"
                          style={{ color: "#ffffff" }}
                          onClick={signIn}
                        >
                          <LoginIcon />
                        </IconButton>
                      )}
                    </div>
                  </div>
                </div>
              </Toolbar>
              {
                showLoader && 
                <Box sx={{ width: '100%' }}>
                  <BorderLinearProgress />
                </Box>
              }
            </AppBar>
          </Box>

          <div style={{ height: "60px" }}></div>

          {/* <EditorSuite /> */}

          <div className="max-w-3xl mx-auto p-6">
            <div className="row align-items-center">
              <div className="col-sm-12 col-md-6">
                <Paper
                  component="form"
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                  sx={{ p: "2px 4px", display: "flex", alignItems: "center", backgroundColor: mode === 'light' ? '#f6f6f6' : '#2d2d2d' }}
                  className="w-100 kb-searchbar"
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder={`${TranslationsService.labels(`search`)}...`}
                    inputProps={{ "aria-label": "search" }}
                    value={searchText}
                    onChange={(e) => onchangeSearch(e.target.value)}
                    type="search"
                  />
                  <IconButton
                    type="button"
                    sx={{ p: "10px" }}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </Paper>
              </div>
              
            </div>

            <div style={{ height: "2rem" }}>
              {showTotalResults && (
                <p style={{ fontSize: 14 }} className="fw-bold">
                  {filteredFaqs.length === 0 ? (
                    <span>{TranslationsService.labels(`no_results_found`)}</span>
                  ) : (
                    <span>
                      {totalResults} {filteredFaqs.length > 1 ? TranslationsService.labels(`results`) : TranslationsService.labels(`result`)}{" "}
                      {TranslationsService.labels(filteredFaqs.length > 1 ? 'found2':'found')}
                    </span>
                  )}
                </p>
              )}
            </div>

            <div className="wiki-container">
              <div className="search-section" sx={{ 
                position: 'sticky', 
                top: 64, 
                zIndex: 2,
                backgroundColor: 'background.default',
                borderBottom: 1,
                borderColor: 'divider',
                pb: 2
              }}>
                
                {search ? (
                  <div className="search-results">
                    <IconButton onClick={() => {setSelectedCategory(null); setSearch('')}}>
                      <HomeIcon />
                    </IconButton>
                    {filteredFaqs.length > 0 &&
                      <>
                        <List>
                          {filteredFaqs.map((faq) => {
                            return(
                              <Link to={faq.path} onClick={() => {setSearch(''); setSearchText('')}} className="d-flex align-items-center gap-2 mb-2">
                                <div className="d-flex align-items-center gap-2">
                                  <ArticleIcon style={{ fontSize: "1rem", color: "#174ee5" }} />
                                  <div>
                                    <p className="kb-chip-text m-0 fw-bold">
                                      <span className="me-2 d-flex">
                                      {highlightTextFromGlobalSearch(faq.question)}
                                        {faq.azureGroups?.length > 0 && (
                                          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", marginLeft: '0.5rem' }}>
                                            {faq.azureGroups.map(group => (
                                              <Chip
                                                key={group.id}
                                                label={group.name}
                                                size="small"
                                                sx={{ height: 20, fontSize: "0.65rem" }}
                                              />
                                            ))}
                                          </Box>
                                        )}
                                      </span>
                                      {getLabelTag(faq)}
                                    </p>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                      <p className="m-0 breadcrumb-text custom-icon-size searched">
                                        {TranslationsService.labels(faq.categoryLabel) || faq.categoryLabel}
                                      </p>
                                      <p className="m-0 breadcrumb-text custom-icon-size searched">
                                        /
                                      </p>
                                      <p className="m-0 breadcrumb-text custom-icon-size searched">
                                        {TranslationsService.labels(faq.subcategoryLabel) || faq.subcategoryLabel}
                                      </p>
                                    </div>
                                  </div>
                                  <ArrowForwardIosSharpIcon style={{color: 'var(--breadcrumb-color)'}}/>
                                </div>
                              </Link>
                            )
                          })}
                        </List>
                      </>
                   }
                  </div>
                ) : (
                  <div className="content-container-syd" style={{ display: 'flex', gap: '20px' }}>
                    <Box
                      sx={{
                        display: { xs: mobileMenuOpen ? 'block' : 'none', md: 'none' },
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 998,
                        transition: 'opacity 0.3s ease-in-out',
                        opacity: mobileMenuOpen ? 1 : 0
                      }}
                    />
                    <Box
                      id="mobile-menu-content"
                      sx={{ 
                        position: { xs: 'fixed', md: 'static' },
                        bottom: { xs: mobileMenuOpen ? 0 : '-100%', md: 'auto' },
                        left: 0,
                        right: 0,
                        zIndex: 999,
                        transition: 'bottom 0.3s ease-in-out',
                        display: { xs: 'block', md: 'block' },
                        width: { xs: '100%', md: 300 }
                      }}
                    >
                      <Card sx={{ 
                        height: 'fit-content',
                        position: { xs: 'relative', md: 'sticky' },
                        top: { xs: 'auto', md: 100 },
                        maxHeight: { xs: '70vh', md: 'calc(100vh - 120px)' },
                        overflowY: 'auto',
                        backgroundColor: mode === 'light' ? '#f8f9fa' : '#1a1a1a',
                        borderRadius: { xs: '20px 20px 0 0', md: '4px' },
                        boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.1)',
                        paddingBottom: '3rem !important'
                      }}>
                        <CardContent sx={{ p: 1 }}>
                          <List component="nav" sx={{ pt: 2 }}>
                            {categories.map((category) => {
                              const categoryData = faqs[category] || {};
                              const isOpen = openCategories.includes(category);
                              return (
                                <div key={category}>
                                  <ListItem 
                                    disablePadding 
                                    sx={{ 
                                      mb: 0.5,
                                      backgroundColor: mode === 'light' ? '#ffffff' : '#2d2d2d',
                                      borderRadius: 2,
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}
                                  >
                                    <ListItemButton
                                       selected={openCategories.includes(category)}
                                        // onClick={() => {
                                        //   setOpenCategories(prev => 
                                        //     prev.includes(category) 
                                        //       ? prev.filter(c => c !== category)
                                        //       : [...prev, category]
                                        //   );
                                        //   navigate(`/${lang}/sydea-hub/sydea-knowledge-base/${slugify(category)}`);
                                        // }}
                                        onClick={() => selectCategory(category)}
                                      sx={{
                                        borderRadius: 2,
                                        '&.Mui-selected': {
                                          backgroundColor: '#fece2f !important',
                                          color: '#000000',
                                          '& .MuiListItemIcon-root': {
                                            color: '#000000'
                                          }
                                        }
                                      }}
                                    >
                                    <ListItemIcon>
                                      {getIconCategory(category)}
                                    </ListItemIcon>
                                    <ListItemText 
                                      primary={categoryLabels[category]}
                                      slotProps={{
                                        primary: {
                                          sx: {
                                            fontWeight: "bold",
                                            fontSize: "1rem",
                                          },
                                        },
                                      }}
                                      sx={{ wordBreak: "break-word" }}
                                    />
                                    {isOpen ? <ExpandLess /> : <ExpandMoreIcon />}
                                    </ListItemButton>
                                  </ListItem>

                                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                    <List component="div" sx={{ pl: 2 }}>
                                      {Object.entries(categoryData).map(([subcategory, questions]) => (
                                        <ListItem 
                                          key={subcategory}
                                          disablePadding 
                                          sx={{ 
                                            mb: 1,
                                            backgroundColor: mode === 'light' ? '#ffffff' : '#2d2d2d',
                                            borderRadius: 1,
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                              transform: 'translateX(8px)'
                                            }
                                          }}
                                        >
                                          <ListItemButton
                                            selected={selectedCategory === category && selectedSubcategory === subcategory}
                                            onClick={() => selectSubcategory(category, subcategory)}
                                            sx={{
                                              pl: 4,
                                              borderRadius: 1,
                                              borderLeft: '3px solid transparent !important',
                                              transition: 'all 0.3s ease-in-out',
                                              // '&:hover': {
                                              //   borderLeft: '5px solid #fece2f !important'
                                              // },
                                              '&.Mui-selected': {
                                                // backgroundColor: '#fbefc7 !important',
                                                backgroundColor: 'var(--bg-card) !important',
                                                // color: '#000000',
                                                borderLeft: '3px solid #fece2f !important'
                                              },
                                              padding: '8px',
                                              gap: '8px'
                                            }}
                                          >
                                            <ListItemIcon sx={{minWidth:'inherit'}}>
                                              {selectedCategory === category && selectedSubcategory === subcategory ? <FolderRoundedIcon /> : <FolderOutlinedIcon />}
                                            </ListItemIcon>         
                                            <ListItemText 
                                              primary={categoryLabels[subcategory]}
                                              secondary={`${Array.isArray(questions) ? questions.length : 0} ${questions.length === 1 ? TranslationsService.labels(`resource`) : TranslationsService.labels(`resources`)}`}
                                              slotProps={{
                                                primary: { sx: {fontSize: '0.9rem'} },
                                                secondary: { sx: {fontSize: '0.5rem'} },
                                              }}
                                            />
                                          </ListItemButton>
                                        </ListItem>
                                      ))}
                                    </List>
                                  </Collapse>
                                </div>
                              );
                            })}
                          </List>
                        </CardContent>
                      </Card>
                    </Box>

                    <Box 
                    sx={{ flex: 1 }}
                    >
                      {window.innerWidth < 768 ? (
                      // {window.innerWidth < 768 && !selectedCategory ? (
                        <>
                          {Object.entries(faqs).map(([category, subcategories]) => (
                            <AccordionKnowBase key={category} expanded={selectedCategory === category}>
                            {/* <AccordionKnowBase key={category} expanded={expandCategoryMobile.includes(category)} onChange={handleChangeFirstLevel(category)}> */}
                              <AccordionSummaryKnowBase
                                aria-controls={`panel-${category}`}
                                id={`panel-${category}`}
                                sx={{backgroundColor:`${expandCategoryMobile.includes(category) ? '#fece2f':'transparent'}`}}
                                onClick={() => selectCategory(category)}
                              >
                              <h5 className="m-0 breadcrumb-text custom-icon-size fw-bold">
                                {getIconCategory(category)} {categoryLabels[category]}
                              </h5>
                              </AccordionSummaryKnowBase>
                               <AccordionDetails sx={{px:0}}>
                                {Object.entries(subcategories).map(([subcategory, questions], index) => (
                                  <div key={subcategory}>
                                    <div className={`d-flex gap-1 align-items-center py-1 know-base-subcategory-label ${index === 0 ? 'first' : ''}`}>
                                      <FolderOutlinedIcon sx={{fontSize:'0.8rem'}}/>
                                      <p className="m-0">{categoryLabels[subcategory]}</p>
                                    </div>
                                    {questions.map((faq) => {
                                      //  const { index, parsedAnswer } = faq.answer
                                      //   ? generateIndexAndParseAnswer(faq.answer, faq.id)
                                      //   : { index: null, parsedAnswer: null };
                                        const { parsedAnswer } = faq.answer ? generateParsedAnswer(faq.answer) : { parsedAnswer: null };
                                       return (
                                        <ArticleBody
                                          key={faq.id}
                                          faq={faq}
                                          // index={index}
                                          parsedAnswer={parsedAnswer}
                                          globalSearch={search}
                                          selQuestion={selectedQuestion}
                                          docStats={tableDocViews}
                                          setDocStats={setTableDocViews}
                                          isSearch={false}
                                          isOpen={openDoc === faq.id}
                                          // onToggle={() => openDocument(faq, subcategory)}
                                          onToggle={() => {
                                            fetchArticleContent(faq.id); // fetch on demand al click
                                            openDocument(faq, subcategory);
                                          }}
                                          // onOpen={() => navigate(`/${lang}/sydea-hub/sydea-knowledge-base/${slugify(selectedCategory)}/${slugify(selectedSubcategory)}/${slugify(faq.id)}`)}
                                          stopDynamo={stopDynamo}
                                        />
                                      )})}
                                  </div>
                                ))}
                               </AccordionDetails>
                            </AccordionKnowBase>
                          ))}
                        </>
                      ) : (
                        selectedCategory && selectedSubcategory ? (
                          <>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                            <p className="m-0 breadcrumb-text custom-icon-size" onClick={() => navigate(`/${lang}/sydea-hub/sydea-knowledge-base`)}>
                              <HomeIcon />
                            </p>
                            <p className="m-0 breadcrumb-text custom-icon-size">/</p>
                            <p className="m-0 breadcrumb-text custom-icon-size" onClick={() => navigate(`/${lang}/sydea-hub/sydea-knowledge-base/${slugify(selectedCategory)}`)}>
                              {getIconCategory(selectedCategory)} {categoryLabels[selectedCategory] || selectedCategory}
                            </p>
                            {selectedSubcategory && (
                              <>
                                <p className="m-0 breadcrumb-text custom-icon-size">/</p>
                                <p className="m-0 breadcrumb-text custom-icon-size" onClick={() => navigate(`/${lang}/sydea-hub/sydea-knowledge-base/${slugify(selectedCategory)}/${slugify(selectedSubcategory)}`)}>
                                  {categoryLabels[selectedSubcategory] || selectedSubcategory}
                                </p>
                              </>
                            )}
                          </Box>

                            <List>
                              {selectedSubcategory && (
                                faqs[selectedCategory][selectedSubcategory]?.map((faq) => {
                                // Proteggi: se l'answer non è ancora caricato, passa valori vuoti
                                // const { index, parsedAnswer } = faq.answer
                                //   ? generateIndexAndParseAnswer(faq.answer, faq.id)
                                //   : { index: null, parsedAnswer: null };
                                  const { parsedAnswer } = faq.answer ? generateParsedAnswer(faq.answer) : { parsedAnswer: null };
                                  return (
                                  //    (!faq.godMode || superAdminList.includes(activeAccount?.username)) && (
                                      <ArticleBody
                                        key={faq.id}
                                        faq={faq}
                                        // index={index}
                                        parsedAnswer={parsedAnswer}
                                        globalSearch={search}
                                        selQuestion={selectedQuestion}
                                        docStats={tableDocViews}
                                        setDocStats={setTableDocViews}
                                        isSearch={false}
                                        isOpen={openDoc === faq.id}
                                        // onToggle={() => openDocument(faq)}
                                        onToggle={() => {
                                          fetchArticleContent(faq.id); // fetch on demand al click
                                          openDocument(faq);
                                        }}
                                        stopDynamo={stopDynamo}
                                        // onOpen={() => navigate(`/${lang}/sydea-hub/sydea-knowledge-base/${slugify(selectedCategory)}/${slugify(selectedSubcategory)}/${slugify(faq.id)}`)}
                                      />
                                    // )
                                  )})
                              ) }
                            </List>
                          </>
                        )
                        :
                      (
                      <div style={{padding: "2rem"}}>
                        {/* <div>
                          <h2>Visualizzazioni documenti</h2>
                          <ul>
                            {tableDocViews.map(({ documentId, views }) => (
                              <li key={documentId}>
                                Documento: {documentId} - Visualizzazioni: {views}
                              </li>
                            ))}
                          </ul>
                        </div> */}
    
                        <h1 style={{fontSize: '1.8rem'}}>{TranslationsService.labels(`kb_welcome_title`)}</h1>
                        <p style={{marginTop: '1rem', fontSize: '1rem'}}>{parse(TranslationsService.labels(`kb_welcome_body`))}</p>
                        <h2 style={{marginTop: '2rem', fontSize: '1.2rem'}}><b>{TranslationsService.labels(`kb_welcome_subtitle`)}</b></h2>
                        <div>
                          {parse(TranslationsService.labels(`kb_welcome_list`))}
                        </div>
                        <h2 style={{marginTop: '2rem', fontSize: '1.2rem'}}>{TranslationsService.labels(`most_viewed_docs`)}:</h2>
                        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
                          {popularDocs.map((item) => (
                            <li key={item.id}>
                              <a
                                style={{ color: '#2980b9' }}
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate(item.path);
                                }}
                              >
                                <div>
                                  <div className="d-flex gap-1 align-items-center">
                                    <ArticleIcon style={{ fontSize: "1rem", color: "#174ee5" }} />
                                    <Typography variant="subtitle1" sx={{fontWeight: 600}}>{item.question}</Typography>
                                  </div>
                                  <div>
                                    <Typography variant="body2">{TranslationsService.labels(item.category)} · {TranslationsService.labels(item.subcategory)}</Typography>
                                    {/* <Typography variant="caption">{formatDate(item.lastUpdate)}</Typography> */}
                                  </div>
                                </div>
                              </a>
                            </li>
                          ))}
                        </ul>

                        <h2 style={{marginTop: '2rem', fontSize: '1.2rem'}}>{TranslationsService.labels(`latest_updated_docs`)}:</h2>
                        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
                          {latestUpdate.map((item) => (
                            <li key={item.id} className="mb-2">
                              <a
                                style={{ color: '#2980b9' }}
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate(item.path);
                                }}
                              >
                                {item.question}
                              </a>
                              <div className="d-flex gap-1 align-items-center">
                              <p className="m-0" style={{fontSize:'0.6rem'}}>{formatDate(item.lastVersionDateStr)}</p>
                              {item.statusTag}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      )
                      )}
                    </Box>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </MsalAuthenticationTemplate>
    </ThemeProvider>
  );
};
