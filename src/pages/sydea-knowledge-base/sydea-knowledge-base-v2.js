import React, { useState, useEffect, useRef, useMemo } from "react";
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
import Chip from "@mui/material/Chip";
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
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import axios from "axios";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CropSquareIcon from '@mui/icons-material/CropSquare';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import CircleIcon from '@mui/icons-material/Circle';
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
import parse from 'html-react-parser';
import Fade from '@mui/material/Fade';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import GrainIcon from '@mui/icons-material/Grain';

const pathUrl = process.env.REACT_APP_BASE_URL;

const AccordionKnowBase = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  // border: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  // "&:not(:last-child)": {
  //   borderBottom: 0,
  // },
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
    // backgroundColor: "rgba(255, 255, 255, .05)",
  }),
}));

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  // height: 10,
  // borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    // ...theme.applyStyles('dark', {
    //   backgroundColor: theme.palette.grey[800],
    // }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    // borderRadius: 5,
    backgroundColor: '#fece2f',
    // ...theme.applyStyles('dark', {
    //   backgroundColor: '#308fe8',
    // }),
  },
}));

const PdfDocLogo = () => {
  return (
    <svg viewBox="0 0 512 512" height="40px">
      <g>
        <polygon style={{fill:'#B12A27'}} points="475.435,117.825 475.435,512 47.791,512 47.791,0.002 357.613,0.002 412.491,54.881  "/>
        <rect x="36.565" y="34.295" style={{fill: '#F2F2F2'}} width="205.097" height="91.768"/>
        <g>
          <g>
            <path style={{fill:'#B12A27'}} d="M110.132,64.379c-0.905-2.186-2.111-4.146-3.769-5.804c-1.658-1.658-3.694-3.015-6.031-3.92     c-2.412-0.98-5.126-1.432-8.141-1.432H69.651v58.195h11.383V89.481h11.157c3.015,0,5.729-0.452,8.141-1.432     c2.337-0.905,4.372-2.261,6.031-3.92c1.659-1.658,2.865-3.543,3.769-5.804c0.829-2.186,1.282-4.523,1.282-6.935     C111.413,68.902,110.961,66.565,110.132,64.379z M97.844,77.118c-1.508,1.432-3.618,2.186-6.181,2.186H81.034V63.323h10.629     c2.563,0,4.674,0.754,6.181,2.261c1.432,1.432,2.186,3.392,2.186,5.804C100.031,73.726,99.277,75.686,97.844,77.118z"/>
            <path style={{fill:'#B12A27'}} d="M164.558,75.761c-0.075-2.035-0.151-3.844-0.377-5.503c-0.226-1.659-0.603-3.166-1.131-4.598     c-0.528-1.357-1.206-2.714-2.111-3.92c-2.035-2.94-4.523-5.126-7.312-6.483c-2.865-1.357-6.257-2.035-10.252-2.035h-20.956     v58.195h20.956c3.995,0,7.387-0.678,10.252-2.035c2.789-1.357,5.277-3.543,7.312-6.483c0.905-1.206,1.583-2.563,2.111-3.92     c0.528-1.432,0.905-2.94,1.131-4.598c0.226-1.658,0.301-3.468,0.377-5.503c0.075-1.96,0.075-4.146,0.075-6.558     C164.633,79.908,164.633,77.721,164.558,75.761z M153.175,88.2c0,1.734-0.151,3.091-0.302,4.297     c-0.151,1.131-0.377,2.186-0.678,2.94c-0.301,0.829-0.754,1.583-1.281,2.261c-1.885,2.412-4.749,3.543-8.518,3.543h-8.669V63.323     h8.669c3.769,0,6.634,1.206,8.518,3.618c0.528,0.678,0.98,1.357,1.281,2.186s0.528,1.809,0.678,3.015     c0.151,1.131,0.302,2.563,0.302,4.221c0.075,1.659,0.075,3.694,0.075,5.955C153.251,84.581,153.251,86.541,153.175,88.2z"/>
            <path style={{fill:'#B12A27'}} d="M213.18,63.323V53.222h-38.37v58.195h11.383V87.823h22.992V77.646h-22.992V63.323H213.18z"/>
          </g>
          <g>
            <path style={{fill:'#B12A27'}} d="M110.132,64.379c-0.905-2.186-2.111-4.146-3.769-5.804c-1.658-1.658-3.694-3.015-6.031-3.92     c-2.412-0.98-5.126-1.432-8.141-1.432H69.651v58.195h11.383V89.481h11.157c3.015,0,5.729-0.452,8.141-1.432     c2.337-0.905,4.372-2.261,6.031-3.92c1.659-1.658,2.865-3.543,3.769-5.804c0.829-2.186,1.282-4.523,1.282-6.935     C111.413,68.902,110.961,66.565,110.132,64.379z M97.844,77.118c-1.508,1.432-3.618,2.186-6.181,2.186H81.034V63.323h10.629     c2.563,0,4.674,0.754,6.181,2.261c1.432,1.432,2.186,3.392,2.186,5.804C100.031,73.726,99.277,75.686,97.844,77.118z"/>
          </g>
        </g>
        <polygon style={{opacity:'0.08', fill:'#040000'}} points="475.435,117.825 475.435,512 47.791,512 47.791,419.581 247.705,219.667    259.54,207.832 266.098,201.273 277.029,190.343 289.995,177.377 412.491,54.881  "/>
        <polygon style={{fill:'#771b1b'}} points="475.435,117.836 357.599,117.836 357.599,0  "/>
        <g>
          <path style={{fill:'#f2f2f2'}} d="M414.376,370.658c-2.488-4.372-5.88-8.518-10.101-12.287c-3.467-3.166-7.538-6.106-12.137-8.82    c-18.544-10.93-45.003-16.207-80.961-16.207h-3.618c-1.96-1.809-3.995-3.618-6.106-5.503    c-13.644-12.287-24.499-25.63-32.942-40.48c16.584-36.561,24.499-69.126,23.519-96.867c-0.151-4.674-0.829-9.046-2.035-13.117    c-1.809-6.558-4.824-12.363-9.046-17.112c-0.075-0.075-0.075-0.075-0.151-0.151c-6.709-7.538-16.056-11.835-25.555-11.835    c-9.574,0-18.393,4.146-24.801,11.76c-6.332,7.538-9.724,17.866-9.875,30.002c-0.226,18.544,1.281,36.108,4.448,52.315    c0.301,1.282,0.528,2.563,0.829,3.844c3.166,14.7,7.84,28.645,13.87,41.611c-7.086,14.398-14.247,26.836-19.223,35.279    c-3.769,6.408-7.915,13.117-12.212,19.826c-19.373,3.468-35.807,7.689-50.129,12.966c-19.373,7.011-34.902,16.056-46.059,26.836    c-7.237,6.935-12.137,14.323-14.549,22.012c-2.563,7.915-2.412,15.83,0.452,22.916c2.638,6.558,7.387,12.061,13.72,15.83    c1.508,0.905,3.091,1.658,4.749,2.337c4.825,1.96,10.101,3.015,15.604,3.015c12.74,0,25.856-5.503,36.937-15.378    c20.655-18.469,41.988-48.169,54.577-66.94c10.327-1.583,21.559-2.94,34.224-4.297c14.926-1.508,28.118-2.412,40.104-2.865    c3.694,3.317,7.237,6.483,10.629,9.498c18.846,16.81,33.168,28.947,46.134,37.465c0,0.075,0.075,0.075,0.151,0.075    c5.126,3.392,10.026,6.181,14.926,8.443c5.503,2.563,11.081,3.92,16.81,3.92c7.237,0,14.021-2.186,19.675-6.181    c5.729-4.146,9.875-10.101,11.76-16.81C420.18,387.694,418.899,378.724,414.376,370.658z M247.705,219.667    c-1.055-9.348-1.508-19.072-1.357-29.324c0.151-9.724,3.694-16.283,8.895-16.283c3.92,0,8.066,3.543,9.95,10.327    c0.528,2.035,0.905,4.372,0.98,7.01c0.151,3.166,0.075,6.483-0.075,9.875c-0.452,9.574-2.111,19.75-4.975,30.681    c-1.734,7.011-3.995,14.323-6.784,21.936C251.173,243.186,248.911,231.803,247.705,219.667z M121.967,418.073    c-1.282-3.166,0.151-9.272,7.991-16.81c11.986-11.458,30.756-20.504,56.914-27.364c-4.975,6.784-9.875,12.966-14.624,18.619    c-7.237,8.744-14.172,16.132-20.429,21.71c-5.352,4.824-11.232,7.84-16.81,8.594c-0.98,0.151-1.96,0.226-2.94,0.226    C127.168,423.049,123.173,421.089,121.967,418.073z M242.428,337.942l0.528-0.829l-0.829,0.151    c0.151-0.377,0.377-0.754,0.603-1.055c3.166-5.352,7.161-12.212,11.458-20.127l0.377,0.829l0.98-2.035    c3.166,4.523,6.634,8.971,10.252,13.267c1.734,2.035,3.543,3.995,5.352,5.955l-1.206,0.075l1.055,0.98    c-3.091,0.226-6.332,0.528-9.574,0.829c-2.035,0.226-4.146,0.377-6.257,0.603C250.796,337.037,246.499,337.49,242.428,337.942z     M369.297,384.98c-8.971-5.729-18.996-13.795-31.359-24.575c17.564,1.809,31.359,5.654,41.159,11.383    c4.297,2.488,7.538,5.051,9.724,7.538c3.618,3.844,4.9,7.312,4.221,9.649c-0.603,2.337-3.241,3.92-6.483,3.92    c-1.885,0-3.844-0.452-5.88-1.432c-3.468-1.658-7.086-3.694-10.93-6.181C369.598,385.282,369.448,385.131,369.297,384.98z"/>
        </g>
      </g>
    </svg>
  );
};

export const SydeaKnowledgeBaseOld = () => {
  const { lang } = useParams();
  const [mode, setMode] = useState(localStorage.getItem("sydea-theme") || "light");
  const themeMob = useTheme();
  const isMobile = useMediaQuery(themeMob.breakpoints.down("sm"));

  const [showLoader, setShowLoader] = useState(false);
  
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

  const { instance, accounts } = useMsal();
  let activeAccount;

  if (instance) {
    activeAccount = instance.getActiveAccount();
  }

  document.title = "Sydea | Knowledge Base";

  const signOut = () => {
    instance.logoutRedirect();
  };

  const signIn = () => {
    instance.loginRedirect().catch((error) => console.log(error));
  };

  const [faqs, setFaqs] = useState({});
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expandedAccordions, setExpandedAccordions] = useState([]);
  const accordionRefs = useRef({});
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [openCategories, setOpenCategories] = useState([]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [dataQuestions, setDataQuestions] = useState(null);

  const [expandCategoryMobile, setExpandCategoryMobile] = useState([]);

  const filteredFaqs = useMemo(() =>
    Object.entries(faqs)
      .filter(
        ([category]) =>
          selectedCategories.length === 0 || selectedCategories.includes(category)
      )
      .flatMap(([category, subcategories]) =>
        Object.entries(subcategories).flatMap(([subcategory, questions]) =>
          questions.map((q) => ({ ...q, category, subcategory }))
        )
      )
      .filter((faq) => {
        const searchLower = search.toLowerCase();
        return (
          faq.question.toLowerCase().includes(searchLower) ||
          faq.category.toLowerCase().includes(searchLower) ||
          faq.subcategory.toLowerCase().includes(searchLower) ||
          faq.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }), [faqs, selectedCategories, search]);

  const totalResults = filteredFaqs.length;
  const showTotalResults = search.length > 0 || selectedCategories.length > 0;

  useEffect(() => {
    if (expandedAccordions.length > 0) {
      expandedAccordions.forEach((id) => {
        if (accordionRefs.current[id]) {
          setTimeout(() => {
            window.scrollTo({
              top: accordionRefs.current[id].offsetTop - 100,
              behavior: "smooth",
            });
          }, 250);
        }
      });
    }
  }, [expandedAccordions]);

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString("en-GB", {
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
    if (!userData || !userData.officeLocation) {
      return;
    }
    setShowLoader(true);
    const fetchData = async () => {
      const response = await fetch(`${pathUrl}/static/knowledge-base/questions.json?_cache_buster=${new Date().getTime()}`, {
        cache: 'no-store',
      });
      const data = await response.json();
      const localizedData = data[lang];
      setDataQuestions(localizedData);
      const categoryList = Object.keys(data[lang]);
      setCategories(categoryList);
      // setOpenCategories(window.innerWidth < 768 ? [] : [categoryList[0]]);
      setOpenCategories([]);
      setExpandCategoryMobile([]);
  
      const filteredData = Object.entries(localizedData).reduce((acc, [category, topics]) => {
        const filteredTopics = Object.entries(topics).reduce((accTopics, [topic, questions]) => {
          const filteredQuestions = questions.filter(q => q.group.includes(userData.officeLocation));
          if (filteredQuestions.length > 0) {
            accTopics[topic] = filteredQuestions;
          }
          return accTopics;
        }, {});
  
        if (Object.keys(filteredTopics).length > 0) {
          acc[category] = filteredTopics;
        }
        return acc;
      }, {});
      setFaqs(filteredData);
      setTimeout(() => {
        setShowLoader(false);
      }, 500);
    };
    fetchData();
  }, [userData, lang, setDataQuestions, setCategories, setOpenCategories]);

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
      if (newsItem && newsItem.id !== expandedAccordions[0]) {
        setSearch(newsItem.question);
        navigate(window.location.pathname, { replace: true });
        setSelectedQuestion(newsItem.id);
      }
    }
  }, [searchParams, dataQuestions]);
  

  const highlightText = (text, search) => {
    if (!search) return text;
    
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === search.toLowerCase() ? (
            <mark 
              key={i}
              style={{
                backgroundColor: '#fff000',
                padding: '0 0',
                borderRadius: '2px'
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

  // useEffect(() => {
  //   const isMobile = window.innerWidth < 768;
  //   if (!isMobile) {
  //     setSelectedCategory(categories[0]);
  //   }
  // }, [categories]);

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
      case 'IT': return <ComputerIcon color={selectedCategory === category ? "inherit" : "action"}/>;
      case 'HR': return <PeopleIcon color={selectedCategory === category ? "inherit" : "action"}/>;
      case 'Operation/Projects': return <LightbulbIcon color={selectedCategory === category ? "inherit" : "action"}/>;
      case 'Health & Safety': return <HealthAndSafetyIcon color={selectedCategory === category ? "inherit" : "action"}/>;
      case 'Planning': return <CalendarMonthIcon color={selectedCategory === category ? "inherit" : "action"}/>;
      default: return <CropSquareIcon color={selectedCategory === category ? "inherit" : "action"}/>;
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
        <div className="section-home position-relative p-4 padding-bottom-safe-area area-knowledge-base">
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
                
                <div className="d-flex gap-4">
                  <IconButton onClick={() => setMode(mode === "light" ? "dark" : "light")} color="inherit">
                    {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                  </IconButton>

                  <div className="d-flex gap-3 align-items-center">
                    {activeAccount && (
                      <div>
                        {/* <Typography
                          variant="p"
                          component="div"
                          sx={{ flexGrow: 1 }}
                        >
                          <p
                            className="fw-bold text-uppercase m-0 fs-sm-6 fs-md-5 p-0"
                            style={{ lineHeight: "normal" }}
                          >
                            {activeAccount.name}
                          </p>
                          <p
                            className="m-0 p-0 fs-6"
                            style={{ lineHeight: "normal" }}
                          >
                            {activeAccount.username}
                          </p>
                        </Typography> */}
                      <Typography variant="p" component="div" sx={{ flexGrow: 1 }}>
                        {isMobile ? (
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              border: '1px solid #fff',
                              // backgroundColor: "#007bff",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              // fontWeight: "bold",
                              textTransform: "uppercase",
                              fontSize: "0.8rem",
                            }}
                          >
                            {getInitials(activeAccount.name)}
                          </Box>
                        ) : (
                          <>
                            <p className="fw-bold text-uppercase m-0 fs-sm-6 fs-md-5 p-0" style={{ lineHeight: "normal" }}>
                              {activeAccount.name}
                            </p>
                            <p className="m-0 p-0 fs-6" style={{ lineHeight: "normal" }}>
                              {activeAccount.username}
                            </p>
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
                  {/* <LinearProgress /> */}
                  <BorderLinearProgress />
                </Box>
              }
            </AppBar>
          </Box>

          <div style={{ height: "60px" }}></div>

          <div className="max-w-3xl mx-auto p-6">
          {/* <h1 className="fw-bold fs-3">Knowledge Base</h1> */}
            <div className="row align-items-center">
              <div className="col-sm-12 col-md-6">
                <Paper
                  component="form"
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                  sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}
                  className="w-100"
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search..."
                    inputProps={{ "aria-label": "search" }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
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
                    <span>No results found</span>
                  ) : (
                    <span>
                      {totalResults} result{filteredFaqs.length > 1 ? "s" : ""}{" "}
                      found
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
                    {/* <Chip 
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 'bold'
                      }}
                      onClick={() => {setSearch('')}}
                      icon={<HomeIcon />
                      }
                    /> */}
                    <IconButton onClick={() => {setSelectedCategory(null); setSearch('')}}>
                      <HomeIcon />
                    </IconButton>
                    {filteredFaqs.length > 0 &&
                      <>
                        <List>
                          {filteredFaqs.map((faq) => (
                            <Card key={faq.id} sx={{ mb: 2 }} className="card-accordion-kb">
                              <Chip icon={selectedQuestion === faq.id ? <ExpandLess /> : <ExpandMoreIcon />} label={faq.question} onClick={() => setSelectedQuestion(selectedQuestion === faq.id ? null : faq.id)}/>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginLeft: '1rem' }}>
                                  <p className="m-0 breadcrumb-text custom-icon-size searched">
                                    {getIconCategory(faq.category)} {faq.category}
                                  </p>
                                  <p className="m-0 breadcrumb-text custom-icon-size searched">
                                    /
                                  </p>
                                  <p className="m-0 breadcrumb-text custom-icon-size searched">
                                    {faq.subcategory}
                                  </p>
                                </div>
                                {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, ml:2 }}>
                                  <Typography variant="span" component="span" sx={{ fontSize:'0.6rem' }}>
                                    {faq.category}
                                  </Typography>
                                  <svg width="10px" height="10px" viewBox="0 0 24 24" fill="none">
                                    <path
                                      d="M15.1997 10.4919L13.2297 8.52188L10.0197 5.31188C9.33969 4.64188 8.17969 5.12188 8.17969 6.08188V12.3119V17.9219C8.17969 18.8819 9.33969 19.3619 10.0197 18.6819L15.1997 13.5019C16.0297 12.6819 16.0297 11.3219 15.1997 10.4919Z"
                                      fill="currentColor"
                                    />
                                  </svg>
                                  <Typography variant="span" component="span" sx={{ fontSize:'0.6rem' }}>
                                    {faq.subcategory}
                                  </Typography>
                                </Box> */}
                              {/* <ListItemButton onClick={() => setSelectedQuestion(selectedQuestion === faq.id ? null : faq.id)}>
                                <ListItemText
                                  primary={highlightText(faq.question, search)}
                                  secondary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Typography variant="span" component="span">
                                        {faq.category}
                                      </Typography>
                                      <svg width="15px" height="15px" viewBox="0 0 24 24" fill="none">
                                        <path
                                          d="M15.1997 10.4919L13.2297 8.52188L10.0197 5.31188C9.33969 4.64188 8.17969 5.12188 8.17969 6.08188V12.3119V17.9219C8.17969 18.8819 9.33969 19.3619 10.0197 18.6819L15.1997 13.5019C16.0297 12.6819 16.0297 11.3219 15.1997 10.4919Z"
                                          fill="currentColor"
                                        />
                                      </svg>
                                      <Typography variant="span" component="span">
                                        {faq.subcategory}
                                      </Typography>
                                    </Box>
                                  }
                                  primaryTypographyProps={{
                                    fontWeight: 'bold',
                                  }}
                                />
                                {selectedQuestion === faq.id ? <ExpandLess /> : <ExpandMoreIcon />}
                              </ListItemButton> */}
                              <Collapse in={selectedQuestion === faq.id}>
                                <CardContent>
                                  <Typography 
                                    variant="span" 
                                  >{parse(faq.answer)}</Typography>
                                  {
                                    faq.link &&
                                    <a href={faq.link} target="_blank" rel="noopener noreferrer" className="link-wiki">
                                      <PdfDocLogo />
                                    </a>
                                  }
                                  <p className='m-0 mt-4 fw-bold text-end' style={{fontSize:'0.7rem'}}>Last update: {formatDate(faq.lastUpdate)}</p>
                                </CardContent>
                              </Collapse>
                            </Card>
                          ))}
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

                    <IconButton
                      aria-label="toggle-menu"
                      sx={{ 
                        display: { xs: 'flex', md: 'none' },
                        position: 'fixed',
                        bottom: 20,
                        right: 20,
                        backgroundColor: '#fece2f',
                        color: '#000000',
                        zIndex: 1000,
                        '&:hover': {
                          backgroundColor: '#e5b829'
                        }
                      }}
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                      {mobileMenuOpen ? <MenuOpenIcon /> : <MenuIcon />}
                    </IconButton>

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
                        width: { xs: '100%', md: 280 }
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
                                      selected={selectedCategory === category}
                                      onClick={() => {
                                        setSelectedCategory(category);
                                        setSelectedSubcategory(null);
                                        setSelectedQuestion(null);
                                        setOpenCategories(prev => 
                                          prev.includes(category) 
                                            ? prev.filter(c => c !== category)
                                            : [...prev, category]
                                        );
                                      }}
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
                                      primary={category}
                                      primaryTypographyProps={{
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                      }}
                                      style={{wordBreak:'break-word'}}
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
                                            onClick={() => {
                                              setSelectedCategory(category);
                                              setSelectedSubcategory(subcategory);
                                            }}
                                            sx={{
                                              pl: 4,
                                              borderRadius: 1,
                                              '&.Mui-selected': {
                                                backgroundColor: '#fbefc7 !important',
                                                color: '#000000'
                                              }
                                            }}
                                          >
                                            <ListItemText 
                                              primary={subcategory}
                                              secondary={`${Array.isArray(questions) ? questions.length : 0} ${questions.length === 1 ? 'resource' : 'resources'}`}
                                              primaryTypographyProps={{ 
                                                fontSize: '0.9rem'
                                              }}
                                              secondaryTypographyProps={{ 
                                                fontSize: '0.5rem',
                                                color: selectedCategory === category && selectedSubcategory === subcategory ? '#000000' : 'inherit'
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

                    <Box sx={{ flex: 1 }}>
                      {window.innerWidth < 768 && !selectedCategory ? (
                        <>
                          {Object.entries(faqs).map(([category, subcategories]) => (
                            <AccordionKnowBase key={category} expanded={expandCategoryMobile.includes(category)} onChange={handleChangeFirstLevel(category)}>
                              <AccordionSummaryKnowBase
                                aria-controls={`panel-${category}`}
                                id={`panel-${category}`}
                              >
                              <h5 className="m-0 breadcrumb-text custom-icon-size fw-bold" onClick={() => setSelectedSubcategory(null)}>
                                {getIconCategory(category)} {category}
                              </h5>
                              {/* <Typography variant="h5" gutterBottom sx={{fontWeight: 'bold'}}>
                                <Chip 
                                  label={category}
                                  size="small"
                                   variant="outlined"
                                  sx={{
                                    fontWeight: 'bold'
                                  }}
                                  onClick={() => setSelectedSubcategory(null)}
                                  icon={getIconCategory(category)}
                                />
                              </Typography> */}
                              </AccordionSummaryKnowBase>
                               <AccordionDetails sx={{px:0}}>
                                {Object.entries(subcategories).map(([subcategory, questions], index) => (
                                  <div key={subcategory}>
                                    <div className={`d-flex gap-1 ps-2 align-items-center py-1 know-base-subcategory-label ${index === 0 ? 'first' : ''} fw-bold`}>
                                      <FolderOpenIcon sx={{fontSize:'0.8rem'}}/>
                                      <p className="m-0">{subcategory}</p>
                                    </div>
                                    {questions.map((faq) => (
                                      <Card key={faq.id} sx={{ mb: 2 }} className="card-accordion-kb">
                                        <Chip icon={selectedQuestion === faq.id ? <ExpandLess /> : <ExpandMoreIcon />} label={faq.question} onClick={() => setSelectedQuestion(selectedQuestion === faq.id ? null : faq.id)}/>
                                        {/* <ListItemButton onClick={() => setSelectedQuestion(selectedQuestion === faq.id ? null : faq.id)}>
                                          <ListItemText 
                                            primary={faq.question} 
                                            primaryTypographyProps={{
                                              fontWeight: 'bold',
                                              fontSize: '0.8rem'
                                            }}
                                          />
                                          {selectedQuestion === faq.id ? <ExpandLess /> : <ExpandMoreIcon />}
                                        </ListItemButton> */}
                                        <Collapse in={selectedQuestion === faq.id}>
                                          <CardContent>
                                            <Typography 
                                              variant="span"
                                            >{parse(faq.answer)}</Typography>
                                            {
                                              faq.link &&
                                              <a href={faq.link} target="_blank" rel="noopener noreferrer" className="link-wiki">
                                                <PdfDocLogo />
                                              </a>
                                            }
                                            <p className='m-0 mt-4 fw-bold text-end' style={{fontSize:'0.7rem'}}>Last update: {formatDate(faq.lastUpdate)}</p>
                                          </CardContent>
                                        </Collapse>
                                      </Card>
                                    ))}
                                  </div>
                                ))}
                               </AccordionDetails>

                            </AccordionKnowBase>
                          ))}
                        </>
                      ) : (
                        selectedCategory ? (
                          <>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                              
                                <>
                                <p className="m-0 breadcrumb-text custom-icon-size" onClick={() => setSelectedCategory(null)}>
                                  <HomeIcon />
                                </p>
                                <p className="m-0 breadcrumb-text custom-icon-size" onClick={() => setSelectedSubcategory(null)}>
                                  /
                                </p>
                                  {/* <Chip 
                                    size="small"
                                     variant="outlined"
                                    sx={{
                                      fontWeight: 'bold'
                                    }}
                                    onClick={() => setSelectedCategory(null)}
                                    icon={<HomeIcon />
                                    }
                                  /> */}
                                  {/* <Typography 
                                    variant="body1" 
                                    sx={{ 
                                      color: mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                                      mx: 0.2 
                                    }}
                                  >
                                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                                      <path d="M15.1997 10.4919L13.2297 8.52188L10.0197 5.31188C9.33969 4.64188 8.17969 5.12188 8.17969 6.08188V12.3119V17.9219C8.17969 18.8819 9.33969 19.3619 10.0197 18.6819L15.1997 13.5019C16.0297 12.6819 16.0297 11.3219 15.1997 10.4919Z" fill="currentColor"/>
                                    </svg>
                                  </Typography> */}
                                </>
                              
                              {/* <Chip 
                                label={selectedCategory}
                                size="small"
                                 variant="outlined"
                                sx={{
                                  fontWeight: 'bold'
                                }}
                                onClick={() => setSelectedSubcategory(null)}
                                icon={getIconCategory(selectedCategory)}
                              /> */}
                              <p className="m-0 breadcrumb-text custom-icon-size" onClick={() => setSelectedSubcategory(null)}>
                                {getIconCategory(selectedCategory)} {selectedCategory}
                              </p>
                              
                                                            
                              {selectedSubcategory && (
                                <>
                                <p className="m-0 breadcrumb-text custom-icon-size" sx={{mx: 0.2 }}>/</p>
                                <p className="m-0 breadcrumb-text custom-icon-size">
                                  {selectedSubcategory}
                                </p>
                                  {/* <Typography 
                                    variant="body1" 
                                    sx={{ 
                                      color: mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                                      mx: 0.2 
                                    }}
                                  >
                                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                                      <path d="M15.1997 10.4919L13.2297 8.52188L10.0197 5.31188C9.33969 4.64188 8.17969 5.12188 8.17969 6.08188V12.3119V17.9219C8.17969 18.8819 9.33969 19.3619 10.0197 18.6819L15.1997 13.5019C16.0297 12.6819 16.0297 11.3219 15.1997 10.4919Z" fill="currentColor"/>
                                    </svg>
                                  </Typography>
                                  <Chip 
                                    label={selectedSubcategory}
                                     variant="outlined"
                                    size="small"
                                    sx={{ 
                                      fontWeight: 'bold'
                                    }}
                                  /> */}
                                </>
                              )}
                            </Box>
                            <List>
                              {selectedSubcategory ? (
                                faqs[selectedCategory][selectedSubcategory].map((faq) => (
                                  <Card key={faq.id} sx={{ mb: 2 }} className="card-accordion-kb">
                                    <Chip icon={selectedQuestion === faq.id ? <ExpandLess /> : <ExpandMoreIcon />} label={faq.question} onClick={() => setSelectedQuestion(selectedQuestion === faq.id ? null : faq.id)}/>
                                    {/* <ListItemButton onClick={() => setSelectedQuestion(selectedQuestion === faq.id ? null : faq.id)}>
                                      <ListItemText 
                                        primary={faq.question} 
                                        primaryTypographyProps={{
                                          fontWeight: 'bold'
                                        }}
                                      />
                                      {selectedQuestion === faq.id ? <ExpandLess /> : <ExpandMoreIcon />}
                                    </ListItemButton> */}
                                    <Collapse in={selectedQuestion === faq.id}>
                                      <CardContent>
                                        <Typography 
                                          variant="span" 
                                        >{parse(faq.answer)}</Typography>
                                        {
                                          faq.link &&
                                          <a href={faq.link} target="_blank" rel="noopener noreferrer" className="link-wiki">
                                            <PdfDocLogo />
                                          </a>
                                        }
                                        <p className='m-0 mt-4 fw-bold text-end' style={{fontSize:'0.7rem'}}>Last update: {formatDate(faq.lastUpdate)}</p>
                                      </CardContent>
                                    </Collapse>
                                  </Card>
                                ))
                              ) : (
                                Object.entries(faqs[selectedCategory] || {}).map(([subcategory, questions], index) => (
                                  <div key={subcategory} >
                                    <div className={`d-flex gap-1 ps-2 align-items-center py-1 know-base-subcategory-label ${index === 0 ? 'first' : ''} fw-bold`}>
                                      <FolderOpenIcon sx={{fontSize:'0.8rem'}}/>
                                      <p className="m-0">{subcategory}</p>
                                    </div>
                                    {questions.map((faq) => (
                                      <Card key={faq.id} sx={{ mb: 2 }} className="card-accordion-kb">
                                        <Chip icon={selectedQuestion === faq.id ? <ExpandLess /> : <ExpandMoreIcon />} label={faq.question} onClick={() => setSelectedQuestion(selectedQuestion === faq.id ? null : faq.id)}/>
                                        {/* <ListItemButton onClick={() => setSelectedQuestion(selectedQuestion === faq.id ? null : faq.id)}>
                                          <ListItemText 
                                            primary={faq.question} 
                                            primaryTypographyProps={{
                                              fontWeight: 'bold'
                                            }}
                                          />
                                          {selectedQuestion === faq.id ? <ExpandLess /> : <ExpandMoreIcon />}
                                        </ListItemButton> */}
                                        <Collapse in={selectedQuestion === faq.id}>
                                          <CardContent>
                                            <Typography 
                                              variant="span" 
                                            >{parse(faq.answer)}</Typography>
                                            {
                                              faq.link &&
                                              <a href={faq.link} target="_blank" rel="noopener noreferrer" className="link-wiki">
                                                <PdfDocLogo />
                                              </a>
                                            }
                                            <p className='m-0 mt-4 fw-bold text-end' style={{fontSize:'0.7rem'}}>Last update: {formatDate(faq.lastUpdate)}</p>
                                          </CardContent>
                                        </Collapse>
                                      </Card>
                                    ))}
                                  </div>
                                ))
                              )}
                            </List>
                          </>
                        )
                        :
                      (
                        // <Typography variant="subtitle1">
                        //   Selezionare
                        // </Typography>
                      <div style={{padding: "2rem", fontFamily: 'sans-serif'}}>
                        <h1 style={{fontSize: '1.8rem'}}>Benvenuto nella Knowledge Base Sydea</h1>
                        
                        <p style={{marginTop: '1rem', fontSize: '1rem'}}>
                          Qui trovi documenti, procedure e risorse interne utili per lavorare al meglio all'interno di Sydea.<br/>
                          Usa il menu a sinistra per navigare tra le categorie disponibili.
                        </p>

                        <h2 style={{marginTop: '2rem', fontSize: '1.2rem'}}>Come usare la Knowledge Base:</h2>
                        <ul style={{marginTop: '0.5rem', paddingLeft: '1.2rem'}}>
                          <li>📂 Clicca su una categoria nel menu a sinistra per esplorare i contenuti.</li>
                          <li>🔍 Utilizza la barra di ricerca per trovare documenti specifici.</li>
                          {/* <li>📩 Se manca qualcosa, segnala al team HR o Operations per l’inserimento.</li> */}
                        </ul>

                        <h2 style={{marginTop: '2rem', fontSize: '1.2rem'}}>Documenti più consultati:</h2>
                        <ul style={{marginTop: '0.5rem', paddingLeft: '1.2rem'}}>
                          <li>
                            <a style={{color: '#2980b9'}}
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate('/it/sydea-hub/sydea-knowledge-base?itemid=planning-regulation', { replace: true });
                              }}
                            >
                              Planning
                            </a>
                          </li>
                          <li>
                            <a style={{color: '#2980b9'}}
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate('/it/sydea-hub/sydea-knowledge-base?itemid=application-landscape', { replace: true });
                              }}
                            >
                              Landscape applicativo
                            </a>
                          </li>
                          <li>
                            <a style={{color: '#2980b9'}}
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate('/it/sydea-hub/sydea-knowledge-base?itemid=ams-ticket-management', { replace: true });
                              }}
                            >
                              Gestione e Presa in Carico Ticket
                            </a>
                          </li>
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
