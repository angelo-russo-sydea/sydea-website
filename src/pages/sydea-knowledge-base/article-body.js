import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
  useMemo,
} from "react";
import {
  Card,
  CardContent,
  Collapse,
  Typography,
  TextField,
  Fab,
  Divider,
  IconButton,
  Button,
  InputBase,
  Paper,
  Chip,
} from "@mui/material";
import "./sydea-knowledge-base.scss";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ArticleIcon from "@mui/icons-material/Article";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  ArrowDownwardOutlined,
  ArrowDownwardRounded,
  ArrowUpward,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary, {
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ControlPointSharpIcon from "@mui/icons-material/ControlPointSharp";
import RemoveCircleOutlineSharpIcon from "@mui/icons-material/RemoveCircleOutlineSharp";
import { AppContext } from "../../services/translationContext";
import { useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import CheckIcon from '@mui/icons-material/Check';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useTheme } from "@emotion/react";
import PdfThumbnail from "../../components/virtual-noticeboard/PdfThumbnail";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ButtonBase from "@mui/material/ButtonBase";

const superAdminList = ['angelo.russo@sydea.com'];

const AccordionVersions = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  // border: `1px solid ${theme.palette.divider}`,
  minHeight: "inherit",
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummaryVersions = styled((props) => (
  <MuiAccordionSummary
    expandIcon={
      <div style={{ display: "flex", alignItems: "center" }}>
        <ControlPointSharpIcon
          className="icon-when-closed"
          sx={{ fontSize: "0.9rem" }}
        />
        <RemoveCircleOutlineSharpIcon
          className="icon-when-open"
          sx={{ fontSize: "0.9rem", display: "none" }}
        />
      </div>
    }
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "#fff !important",
  flexDirection: "row-reverse",
  minHeight: "inherit",
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded} .icon-when-open`]:
    {
      display: "block",
    },
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded} .icon-when-closed`]:
    {
      display: "none",
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "#262626 !important",
  }),
}));

const AccordionDetailsVersions = styled(MuiAccordionDetails)(({ theme }) => ({
  // padding: theme.spacing(2),
  // borderTop: '1px solid rgba(0, 0, 0, .125)',
  backgroundColor: "#fff !important",
    ...theme.applyStyles("dark", {
    backgroundColor: "#262626 !important",
  }),
}));

function highlightReactText(node, search, currentMatchIndex, onMatchFound) {
  if (!search) return node;

  if (typeof node === "string") {
    const regex = new RegExp(`(${search.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi");
    const parts = node.split(regex);

    return parts.map((part, i) => {
      if (part.toLowerCase() === search.toLowerCase()) {
        const matchIndex = onMatchFound(); // incremento contatore
        return (
          <span
            key={i}
            data-match-index={matchIndex}
            style={{
              backgroundColor:
                matchIndex === currentMatchIndex ? "orange" : "yellow",
              padding: "0",
              transition: "background-color 0.3s",
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  }

  if (React.isValidElement(node) && node.props.children) {
    const children = React.Children.map(node.props.children, (child) =>
      highlightReactText(child, search, currentMatchIndex, onMatchFound)
    );
    return React.cloneElement(node, { ...node.props, children });
  }

  return node;
}


function ArticleBody({
  faq,
  // index,
  parsedAnswer,
  globalSearch,
  selQuestion,
  docStats,
  setDocStats,
  isSearch = false,
  activeAccount,
  isOpen,
  onToggle,
  stopDynamo
}) {
  const [selectedQuestion, setSelectedQuestion] = useState(selQuestion);
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState("");
  const [matches, setMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const contentRef = useRef(null);
  const matchesCount = useRef(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const {services: { TranslationsService }} = useContext(AppContext);
  const { lang } = useParams();
  const searchBarRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const [runningPdf, setRunningPdf] = useState(false);
  const [copyLink, setCopyLink] = useState(false);
  const cardRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  matchesCount.current = 0;

  const onMatchFound = () => {
    return matchesCount.current++;
  };

  useEffect(() => {
    console.log('contenuto corrente', faq);
    if (!contentRef.current) return;

    const matches = contentRef.current.querySelectorAll("[data-match-index]");
    if (matches.length === 0) return;

    const el = Array.from(matches).find(
      (el) => Number(el.getAttribute("data-match-index")) === currentMatchIndex
    );
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentMatchIndex, searchTerm]);

  const onPrev = () => {
    if (matchesCount.current === 0) return;
    setCurrentMatchIndex(
      (i) => (i - 1 + matchesCount.current) % matchesCount.current
    );
  };

  const onNext = () => {
    if (matchesCount.current === 0) return;
    setCurrentMatchIndex((i) => (i + 1) % matchesCount.current);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onNext();
    }
  };

  // const highlightedContent =  useMemo(() => highlightReactText(
  //   parsedAnswer,
  //   search,
  //   currentMatchIndex,
  //   onMatchFound
  // ));

  const highlightedContent = useMemo(() => {
    const result = highlightReactText(
      parsedAnswer,
      search,
      currentMatchIndex,
      onMatchFound
    );

    if (!result) return [];

    return Array.isArray(result) ? result : [result];
  }, [parsedAnswer, search, currentMatchIndex]);

  const tocItems = useMemo(() => {
    const counters = [];

    return highlightedContent
      ?.map((el, index) => {
        if (!/^h[1-6]$/.test(el?.type)) return null;

        const level = Number(el.type.replace("h", "")) || 1;
        const text = getTextFromReactElement(el.props.children);

        while (counters.length < level) counters.push(0);
        counters[level - 1] += 1;
        counters.length = level;

        return {
          id: `heading-${index}`,
          level,
          text,
          displayIndex: counters.join("."),
        };
      })
      .filter(Boolean);
    }, [highlightedContent]);

  const headingIndexMap = useMemo(() => {
    const map = {};
    tocItems.forEach(item => {
      map[item.id] = item.displayIndex;
    });
    return map;
  }, [tocItems]);

  const renderedContentWithBackArrow = useMemo(() => {
    return highlightedContent?.map((el, index) => {
      const type = el.type;
      if (type === "h1" || type === "h2" || type === "h3") {
        const id = `heading-${index}`;
        const headingText = getTextFromReactElement(el.props.children);

        const numbering = headingIndexMap[id];

        return React.cloneElement(
          el,
          { id, key: id, style: { display: "flex", alignItems: "center", gap: 8 } },
          <>
            {/* <span>{headingText}</span> */}
            <span>
              {numbering ? `${numbering}. ` : ""}
              {headingText}
            </span>
              <a
                href={`#${id}`}
                className="icon-back-to-top"
                onClick={(e) => {
                  e.preventDefault();
                  const tocEl = document.querySelector(".table-of-contents");
                  if (tocEl) {
                    window.scrollTo({
                      top: tocEl.getBoundingClientRect().top + window.pageYOffset - 150,
                      behavior: "smooth",
                    });
                  }
                }}
                >
                <svg viewBox='0 0 24 24' fill="none" width={16} height={16}>
                  <path d='M10.7071 9.70711C10.3166 10.0976 9.68342 10.0976 9.29289 9.70711C8.90237 9.31658 8.90237 8.68342 9.29289 8.29289L14.2929 3.29289C14.6834 2.90237 15.3166 2.90237 15.7071 3.29289L20.7071 8.29289C21.0976 8.68342 21.0976 9.31658 20.7071 9.70711C20.3166 10.0976 19.6834 10.0976 19.2929 9.70711L16 6.41421V16C16 17.3261 15.4732 18.5979 14.5355 19.5355C13.5979 20.4732 12.3261 21 11 21H4C3.44772 21 3 20.5523 3 20C3 19.4477 3.44772 19 4 19H11C11.7956 19 12.5587 18.6839 13.1213 18.1213C13.6839 17.5587 14 16.7957 14 16V6.41421L10.7071 9.70711Z' fill='currentColor'/>
                </svg>
              </a>
          </>
        );
      }
    return React.cloneElement(el, { key: `heading-${index}` });
  });
  }, [highlightedContent, headingIndexMap]);

  const toggleSelected = () => {
    setSelectedQuestion(selectedQuestion === faq.id ? null : faq.id);
  };

  // useEffect(() => {
  //   const checkCardHeight = () => {
  //     if (contentRef.current) {
  //       const cardHeight = contentRef.current.offsetHeight;
  //       const windowHeight = window.innerHeight;
  //       setShowScrollTop(cardHeight > windowHeight);
  //     }
  //   };
  //   checkCardHeight();
  //   window.addEventListener("resize", checkCardHeight);
  //   return () => window.removeEventListener("resize", checkCardHeight);
  // }, [selectedQuestion]);


  const documentHeader = (versions) => {
    // const versionStatus = versions.filter((x)=> x.status !== 'draft');
    const versionStatus = versions.filter((v, i) => {
      const status = (v.status ?? "").toLowerCase();
      
      // Mostra sempre published
      if (status === "published") return true;
      
      // Mostra approved solo se esiste una published successiva
      // if (status === "approved") {
      //   const hasPublishedAfter = versions.slice(i + 1).some(
      //     next => (next.status ?? "").toLowerCase() === "published"
      //   );
      //   return hasPublishedAfter;
      // }
      
      // Nascondi draft
      return false;
    });
    return (
      <div className="row no-print">
        <div className="col-12 kb-col-versions">
          {versionsTable(versionStatus)}
        </div>
      </div>
      // <div className="row no-print">
      //   <div className="col-sm-12 col-md-6 kb-col-versions">
      //     {versionsTable(versions)}
      //   </div>
      //   {summaryPanel(index) && (
      //     <div className="col-sm-12 col-md-6 kb-col-summary">
      //       {" "}
      //       {summaryPanel(index, id)}
      //     </div>
      //   )}
      // </div>
    );
  };

  function extractHeadingsFromJSON(doc) {
    const items = []

    const traverse = (node) => {
      if (node.type === 'heading') {
        items.push({
          id: node.attrs.id,
          level: node.attrs.level,
          textContent: node.content.map(c => c.text).join(''),
        })
      }
      if (node.content) {
        node.content.forEach(traverse)
      }
    }

    traverse(doc)
    return items
  }

  const tableOfContents = (index, id, doc) => {
    const item = extractHeadingsFromJSON(highlightedContent);
    return (
      <div className="row no-print">
        {summaryPanel(index) && (
          <div className="col-sm-12 col-md-6 kb-col-summary">
            {" "}
            {summaryPanel(index, id)}
          </div>
        )}
      </div>
    );
  };

  const summaryPanel = (summary, id) => {
    if (!summary) return "";
    return (
      <div>
        <AccordionVersions id={id}>
          <AccordionSummaryVersions>
            <Typography component="span" style={{ fontSize: "0.8rem" }}>
              <b>{TranslationsService.labels(`summary`)}</b>
            </Typography>
          </AccordionSummaryVersions>
          <AccordionDetailsVersions>{summary}</AccordionDetailsVersions>
        </AccordionVersions>
      </div>
    );
  };

  const versionsTable = (versions) => {
    if (!versions || versions.length === 0) return "";
    return (
      <>
        <div>
          <AccordionVersions>
            <AccordionSummaryVersions>
              <Typography component="span" style={{ fontSize: "0.8rem" }}>
                <b>{TranslationsService.labels(`versions`)}</b>
              </Typography>
            </AccordionSummaryVersions>
            <AccordionDetailsVersions>
              <div style={{ overflow: "auto" }}>
                <table className="kb-table-versions">
                  <thead>
                    <tr>
                      <th scope="col">
                        <b>{TranslationsService.labels(`version`)}</b>
                      </th>
                      {/* <th scope="col">
                        <b>{TranslationsService.labels(`status`)}</b>
                      </th> */}
                      <th scope="col">
                        <b>{TranslationsService.labels(`changes`)}</b>
                      </th>
                      <th scope="col">
                        <b>{TranslationsService.labels(`date`)}</b>
                      </th>
                      <th scope="col">
                        <b>{TranslationsService.labels(`author`)}</b>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {versions.map((version, index) => (
                      <tr key={index}>
                        <td>
                          {version.versionNumber}
                        </td>
                        {/* <td>
                          <i>{version.status}</i>
                        </td> */}
                        <td>{version.changes}</td>
                        <td style={{ textAlign: "left" }}>
                          {formatDate(version.date)}
                        </td>
                        <td>{version.author}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AccordionDetailsVersions>
          </AccordionVersions>
        </div>
      </>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") return "";

    let year, month, day;

    try {
      // Caso 1: formato italiano DD/MM/YYYY
      if (dateString.includes("/")) {
        const parts = dateString.split("/");
        if (parts.length !== 3) throw new Error();

        [day, month, year] = parts.map(Number);
      } 
      // Caso 2: formato ISO o simile YYYY-MM-DD HH:mm / YYYY-MM-DDTHH:mm
      else if (dateString.includes("-")) {
        const datePart = dateString.split(" ")[0]; // rimuove orario se presente
        const parts = datePart.split("-");
        if (parts.length < 3) throw new Error();

        [year, month, day] = parts.map(Number);
      } else {
        throw new Error();
      }

      // Creo la data in modo sicuro (zero-based month)
      const date = new Date(year, month - 1, day);

      // Controllo validità reale (es. 31 febbraio)
      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      ) {
        throw new Error();
      }

      const locale = lang === "it" ? "it-IT" : "en-GB";

      return date.toLocaleDateString(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

    } catch {
      return "";
    }
  };

  // useEffect(() => {
  //   if (!isOpen) return;
  //     if (!contentRef.current || !searchBarRef.current) return;
  //   const handleScroll = () => {
  //     if (!searchBarRef.current) return;
  //     const rect = searchBarRef.current.getBoundingClientRect();
  //     const containerTop = contentRef.current?.getBoundingClientRect()?.top;
  //     if (
  //       containerTop <= 64 &&
  //       containerTop + contentRef.current.offsetHeight >= 64
  //     ) {
  //       setIsSticky(true);
  //     } else {
  //       setIsSticky(false);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll, { passive: true });
  //   handleScroll();
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

useEffect(() => {
  if (!isOpen) return;

  const handleScroll = () => {
    if (!searchBarRef.current || !contentRef.current) return;

    const headerRect = searchBarRef.current.getBoundingClientRect();
    const containerRect = contentRef.current.getBoundingClientRect();

    const stickyTop = 64;

    const insideContainer =
      containerRect.top <= stickyTop &&
      containerRect.bottom > stickyTop;

    setIsSticky(headerRect.top <= stickyTop && insideContainer);
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();

  return () => window.removeEventListener("scroll", handleScroll);
}, [isOpen]);


  const theme = useTheme();

  const searchBarStyle = isSticky
    ? {
        position: "fixed",
        top: window.innerWidth < 768 ? "56px" : "64px",
        left: searchBarRef.current
          ? `${searchBarRef.current.getBoundingClientRect().left}px`
          : "0px",
        width: searchBarRef.current
          ? `${searchBarRef.current.getBoundingClientRect().width}px`
          : "100%",
        zIndex: 1000,
      background:
        theme.palette.mode === "dark"
          ? "#262626"
          : "var(--dynamic-bg-color)",
      borderBottom:
        theme.palette.mode === "dark"
          ? "1px solid #333"
          : "1px solid #ccc",
      }
    : {};

  const handleDownloadPdf = async () => {
    if (!contentRef.current) return;

    setRunningPdf(true);

    const content = await parseNodeToPdfContent(contentRef.current.querySelector(".MuiTypography-root.MuiTypography-body1.css-1mp2wdq-MuiTypography-root"));

    const docDefinition = {
      watermark: {
        text: `Sydea Knowledge Base - Copia generata il ${formatDate(new Date().toLocaleDateString("it-IT"))}`,
        // text: `Sydea | ${faq.question} - ${formatDate(
        //   new Date().toLocaleDateString("it-IT")
        // )} - v${faq.versions[faq.versions.length - 1].version_number}`,
        color: "#000",
        opacity: 0.15,
        bold: true,
        italics: false,
        fontSize: 30
      },
      footer: function (currentPage, pageCount) {
        return [
          {
            text: currentPage.toString() + " of " + pageCount,
            alignment: "center",
            margin: [10, 10, 10, 10],
            fontSize: 8,
          },
        ];
      },
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            text: `Sydea | ${faq.question} - ${formatDate(
              new Date().toLocaleDateString("it-IT")
            )} - v${faq.versions[faq.versions.length - 1].version_number}`,
            alignment: "right",
            margin: [10, 10, 10, 10],
            fontSize: 8,
          },
          {
            canvas: [
              { type: "rect", x: 170, y: 32, w: pageSize.width - 170, h: 40 },
            ],
          },
        ];
      },
      content: [
        { text: faq.question, style: "header", margin: [0, 0, 0, 10] },
        ...content,
      ],
      styles: {
        header: { fontSize: 18, bold: true },
        title: { fontSize: 14, bold: true, marginTop: 20 },
      },
    };
    pdfMake.createPdf(docDefinition).download(`${faq.question} - v${faq.versions[faq.versions.length - 1].version_number}.pdf`);
    setRunningPdf(false);
  };

  function getBase64Image(imgElement) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
      img.src = imgElement.src;
    });
  }

  async function parseNodeToPdfContent(node) {
    const content = [];

    for (let child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        if (child.textContent.trim()) {
          content.push({ text: child.textContent.trim(), style: "title" });
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        if (child.tagName === "IMG") {
          const base64 = await getBase64Image(child);
          content.push({ image: base64, width: 300, margin: [0, 5, 0, 5] });
        } else if (child.tagName === "TABLE") {
          const table = await parseTable(child);
          content.push(table);
        } else {
          let childrenContent = await parseNodeToPdfContent(child);
          switch (child.tagName) {
            case "P":
              content.push({
                text: childrenContent.map((c) => c.text).join(" "),
                margin: [0, 5, 0, 5],
              });
              break;
            case "UL":
              content.push(await parseList(child, "ul"));
              break;

            case "OL":
              content.push(await parseList(child, "ol"));
              break;
            default:
              content.push(...childrenContent);
          }
        }
      }
    }
    return content;
  }

  async function parseList(listNode, type) {
    const items = [];

    for (let li of listNode.children) {
      const liContent = await parseListItem(li);
      items.push(liContent);
    }

    return {
      [type]: items,
      margin: [0, 5, 0, 5],
    };
  }

  async function parseListItem(liNode) {
    const itemParts = [];
    let nestedList = null;

    for (let child of liNode.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        if (child.textContent.trim()) {
          itemParts.push({ text: child.textContent.trim() });
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        if (child.tagName === "UL" || child.tagName === "OL") {
          nestedList = await parseList(child, child.tagName.toLowerCase());
        } else {
          const childContent = await parseNodeToPdfContent(child);
          itemParts.push(...childContent);
        }
      }
    }

    const itemText = itemParts
      .map((p) => p.text || "")
      .join(" ")
      .trim();
    if (nestedList) {
      return {
        text: itemText,
        [nestedList.ul ? "ul" : "ol"]: nestedList.ul || nestedList.ol,
      };
    }

    return itemText;
  }

  async function parseTable(tableNode) {
    const body = [];

    const rows = tableNode.querySelectorAll("tr");
    rows.forEach((row) => {
      const rowData = [];
      const cells = row.querySelectorAll("th, td");
      cells.forEach((cell) => {
        const cellContent = Array.from(cell.childNodes).map((child) => {
          if (child.nodeType === Node.TEXT_NODE) {
            return { text: child.textContent.trim() };
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            return { text: child.innerText.trim() };
          }
        });
        rowData.push({ text: cellContent.map((c) => c.text).join(" ") });
      });

      body.push(rowData);
    });

    return {
      table: {
        headerRows: 1,
        widths: Array(body[0].length).fill("*"),
        body: body,
      },
      layout: "lightHorizontalLines",
      margin: [0, 5, 0, 5],
    };
  }

  const onchangeSearch = (text) => {
    setSearch(text.trim());
    setSearchTerm(text);
    setCurrentMatchIndex(0);
  };

  const highlightTextFromGlobalSearch = (text, search) => {
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

  const handleCopyLink = () => {
    const currentUrl = `${window.location.origin}${window.location.pathname}`;
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        setCopyLink(true);
        setTimeout(() => {
          setCopyLink(false);
        }, 1000);
      })
      .catch((err) => {
        setCopyLink(false);
      });
  };

  const handleFeedbackClick = () => {
    const recipients = "tony.devivo@sydea.com, angelo.russo@sydea.com"; 
    const lastVersion = faq.version;
    const subject = encodeURIComponent(`[Sydea KB] Feedback | ${faq.question}${lastVersion ? ` - v${lastVersion}` : ''}`);
    // const body = encodeURIComponent("Ciao,\n\nti segnalo un errore o suggerisco una modifica per questa guida:\n\n[Inserisci qui il link o il titolo del documento]\n\nGrazie.");
    // window.location.href = `mailto:${recipients}?subject=${subject}&body=${body}`;
    window.location.href = `mailto:${recipients}?subject=${subject}`;
  };

  // const isOpen = selectedQuestion === faq.id;
  const stat = docStats?.find(item => item.documentId === faq.id);
  const views = stat ? stat.views : 0;

  useEffect(() => {
    if (!isOpen || stopDynamo) return;

    const viewedDocs = JSON.parse(sessionStorage.getItem("viewedDocs") || "[]");

    if (!viewedDocs.includes(faq.id)) {
      fetch("https://9g9tdvnxye.execute-api.eu-west-1.amazonaws.com/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: faq.id })
      })
      .then(res => res.json())
      .then(data => {
        viewedDocs.push(faq.id);
        sessionStorage.setItem("viewedDocs", JSON.stringify(viewedDocs));

        const newViews = parseInt(data.updatedAttributes.views.N, 10);
        setDocStats(prev => {
          const newStats = prev ? [...prev] : [];
          const idx = newStats.findIndex(item => item.documentId === faq.id);

          if (idx !== -1) {
            newStats[idx] = { documentId: faq.id, views: newViews };
          } else {
            newStats.push({ documentId: faq.id, views: newViews });
          }
          return newStats;
        });
      })
      .catch(err => console.error(err));

    }
  }, [isOpen, faq.id]);

  function getLabelTag(faq) {
    if (!faq) return null;

    const status = (faq.status ?? "").toLowerCase();

    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const versionDate = faq.lastUpdate
      ? new Date(faq.lastUpdate.substring(0, 10))
      : null;

    const isWithinOneMonth = versionDate
      ? versionDate >= oneMonthAgo && versionDate <= today
      : false;

    if (status === "published") {
      if ((faq.version ?? 0) === 0 && isWithinOneMonth) {
        return <span className="kb-tag-status new"><span className="kb-tag-status-text m-0">NEW</span></span>;
      }
      if ((faq.version ?? 0) > 0 && isWithinOneMonth) {
        return <span className="kb-tag-status updated"><span className="kb-tag-status-text m-0">UPDATED</span></span>;
      }
      return null;
    }

    if (status === "draft") {
      return <span className="kb-tag-status draft"><span className="kb-tag-status-text m-0">DRAFT</span></span>;
    }

    if (status === "approved") {
      return <span className="kb-tag-status approved"><span className="kb-tag-status-text m-0">APPROVED</span></span>;
    }

    return null;
  }
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (!cardRef.current) return;

  //     const rect = cardRef.current.getBoundingClientRect();

  //     // se il fondo della card esce dalla viewport
  //     const isOverflowing = rect.bottom > window.innerHeight;

  //     setShowScrollButton(isOverflowing);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   handleScroll();

  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [isOpen]);


  // useEffect(() => {
  //   const checkCardHeight = () => {
  //     if (!contentRef.current) return;

  //     const rect = contentRef.current.getBoundingClientRect();
  //     const windowHeight = window.innerHeight;

  //     // se il fondo del contenuto è sotto la viewport
  //     setShowScrollTop(rect.bottom > windowHeight);
  //   };

  //   checkCardHeight();

  //   window.addEventListener("resize", checkCardHeight);
  //   window.addEventListener("scroll", checkCardHeight);

  //   return () => {
  //     window.removeEventListener("resize", checkCardHeight);
  //     window.removeEventListener("scroll", checkCardHeight);
  //   };
  // }, [selectedQuestion, isOpen]);

  useEffect(() => {
    const checkScroll = () => {
      if (!cardRef.current || !contentRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const needsScroll =
        contentRef.current.offsetHeight > window.innerHeight;

      // mostra solo se serve scroll E abbiamo iniziato a scorrere la card
      setShowScrollTop(needsScroll && rect.top < 0);
    };

    checkScroll();

    window.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [selectedQuestion]);

  function getTextFromReactElement(el) {
    if (typeof el === 'string') return el
    if (Array.isArray(el)) return el.map(getTextFromReactElement).join('')
    if (el?.props?.children) return getTextFromReactElement(el.props.children)
    return ''
  }

  const renderedContent = highlightedContent?.map((el, index) => {
    const type = el.type
    if (type === 'h1' || type === 'h2' || type === 'h3') {
      const id = `heading-${index}`
      return React.cloneElement(el, { id, key: index })
    }
    return React.cloneElement(el, { key: index })
  })

  const headings = highlightedContent?.map((el, index) => {
      const type = el.type
      if (type === 'h1' || type === 'h2' || type === 'h3') {
        let text = getTextFromReactElement(el.props.children)
        text = text.replace(/^\s*[\.\-–•]*\s*/, '') // rimuove punti, trattini, bullet iniziali
        return {
          id: `heading-${index}`,
          level: parseInt(type.replace('h', ''), 10),
          text,
        }
      }
      return null
    })
    .filter(Boolean)

  const TocAccordion = (tocItems) => {
    
    const [expanded, setExpanded] = useState(false);

    const handleChange = (_, isExpanded) => {
      setExpanded(isExpanded);
    };

    return (
      <div className="table-of-contents">
        <AccordionVersions
          expanded={expanded}
          onChange={handleChange}
        >
          <AccordionSummaryVersions>
            <Typography component="span" style={{ fontSize: "0.8rem" }}>
              <b>{TranslationsService.labels(`summary`)}</b>
            </Typography>
          </AccordionSummaryVersions>

          <AccordionDetailsVersions
            onClick={(e) => {
              // stopPropagation impedisce al click sui link di chiudere l’accordion
              const tag = e.target.tagName.toLowerCase();
              if (tag === "a" || tag === "button") {
                e.stopPropagation();
              }
            }}
          >
            {/* {headings?.map((h) => (
              <div key={h.id} style={{ paddingLeft: (h.level - 1) * 16 }}>
                <button
                  type="button"
                  onClick={() => scrollToHeading(h.id)}
                  style={{
                    all: "unset",
                    cursor: "pointer",
                    color: "#1976d2",
                    font: "inherit",
                    textAlign: "left",
                  }}
                >
                  {h.text}
                </button>
              </div>
            ))} */}
            {tocItems?.map(item => (
              <div
                key={item.id}
                style={{ paddingLeft: (item.level - 1) * 16 }}
                className={`toc-item-levels toc-item-level-${item.level}`}
              >
                <a
                  href={`#${item.id}`}
                  data-item-index={item.displayIndex}
                  onClick={e => {
                    e.preventDefault();
                    const el = document.getElementById(item.id);
                    // if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.scrollY - 150;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }}
                >
                  {item.text}
                </a>
              </div>
            ))}
          </AccordionDetailsVersions>
        </AccordionVersions>
      </div>
    );
  }

  const isSameVersion =
    faq.version &&
    faq.lastPublishedVersion &&
    faq.version === faq.lastPublishedVersion.versionNumber;

  const showReserved = faq.godMode && !isSameVersion || faq.draftMode && !isSameVersion;

  const renderTitleWithGroups = (title, groups = []) => {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            fontSize: window.innerWidth < 768 ? "0.8rem" : "inherit"
          }}
        >
          {title}
        </Typography>

        {groups?.length > 0 && (
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {groups.map(group => (
              <Chip
                key={group.id}
                label={group.name}
                size="small"
                sx={{ height: 20, fontSize: "0.65rem" }}
              />
            ))}
          </Box>
        )}
      </Box>
    );
  };


  return (
    <>
      <Card ref={cardRef} sx={{ mb: 2, position: "relative" }} className={`card-accordion-kb ${showReserved ? 'reserved':''} p-relative}`}>
      {/* <Card sx={{ mb: 2 }} className="card-accordion-kb p-relative"> */}
      {
        showReserved && <p className="reserved-label">RESERVED</p>
      }
        <div
          // onClick={toggleSelected}
          onClick={onToggle}
          className="kb-chip"
          style={{ cursor: "pointer" }}
        >
          <div className="kb-chip-icon">
            {isOpen ? (
              <ExpandLess style={{ fontSize: "1rem" }} />
            ) : (
              <ExpandMoreIcon style={{ fontSize: "1rem" }} />
            )}
            <ArticleIcon style={{ fontSize: "1rem", color: "#174ee5" }} />
          </div>
          <div className="kb-chip-box-text">
            <p className="kb-chip-text m-0 fw-bold">
              <span className="me-2 d-flex">
              {isSearch
                ? highlightTextFromGlobalSearch(faq.question, globalSearch)
                : renderTitleWithGroups(faq.question, faq.azureGroups)}
              </span>
              {getLabelTag()}
            </p>
            {isSearch && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
              >
                <p className="m-0 breadcrumb-text custom-icon-size searched">
                  {faq.category}
                </p>
                <p className="m-0 breadcrumb-text custom-icon-size searched">
                  /
                </p>
                <p className="m-0 breadcrumb-text custom-icon-size searched">
                  {faq.subcategory}
                </p>
              </div>
            )}
          </div>
        </div>

        <Collapse in={isOpen}>
        {/* <Collapse in={selectedQuestion === faq.id}> */}
          <CardContent
            // ref={selectedQuestion === faq.id ? contentRef : null}
            ref={contentRef}
            sx={{ position: "relative", padding: '0 !important', paddingBottom: "60px !important" }}
            className="content-card-knowledge"
            // style={{backgroundColor: mode === 'light' ? '#f6f6f6' : '#121212'}}
            // style={{background: '#ffffff'}}
          >
            <div
              ref={searchBarRef}
              style={{
                padding: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                ...searchBarStyle,
              }}
              className="no-print"
            >
              <a className="no-print w-100" style={{cursor: 'pointer'}}
                  href={`#${faq.id}`}
                  // onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(faq.id);
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
                      window.scrollTo({ top: y - 70, behavior: 'smooth' });
                    }
                  }}
                >
                {isSticky && (
                  <div className="d-flex gap-1 align-items-center">
                    <ArticleIcon style={{ fontSize: window.innerWidth < 768 ? "0.8rem" : "1rem", color: "#174ee5" }}/>
                    {/* <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", flexBasis: "100%", fontSize: window.innerWidth < 768 ? "0.8rem" : "inherit" }}
                    >
                      {faq.question}
                    </Typography> */}
                    {renderTitleWithGroups(faq.question, faq.azureGroups)}
                    {
                      showReserved && <p className="reserved-label">RESERVED</p>
                    }
                  </div>
                )}
                {/* <div className="d-flex align-items-center w-100">
                  <div style={{ width: "80%" }}>
                    <div className="d-flex align-items-center w-100">
                      <Paper
                        component="form"
                        onSubmit={(e) => {e.preventDefault()}}
                        sx={{
                          p: "2px 4px",
                          display: "flex",
                          alignItems: "center",
                          width: "70%",
                          height: "30px",
                        }}
                        className="kb-searchbar"
                      >
                        <InputBase
                          sx={{ ml: 1, flex: 1, width: "70%" }}
                          placeholder={`${TranslationsService.labels(`search`)}...`}
                          inputProps={{ "aria-label": "search" }}
                          value={searchTerm}
                          onChange={(e) => onchangeSearch(e.target.value)}
                          type="search"
                          onKeyDown={onKeyDown}
                        />
                        <IconButton
                          type="button"
                          sx={{ p: "10px" }}
                          aria-label="search"
                        >
                          <SearchIcon />
                        </IconButton>
                      </Paper>
                      <Typography
                        variant="body2"
                        sx={{ minWidth: "60px", textAlign: "right" }}
                        style={{ visibility: searchTerm ? "visible" : "hidden" }}
                      >
                        {matchesCount.current > 0 ? currentMatchIndex + 1 : currentMatchIndex}{" "} / {matchesCount.current}
                      </Typography>
                      <IconButton
                        disabled={matchesCount.current === 0}
                        onClick={onPrev}
                        aria-label="Risultato precedente"
                      >
                        <KeyboardArrowUpIcon />
                      </IconButton>
                      <IconButton
                        disabled={matchesCount.current === 0}
                        onClick={onNext}
                        aria-label="Risultato successivo"
                      >
                        <KeyboardArrowDown />
                      </IconButton>
                    </div>
                  </div>
                  <div style={{ width: "20%" }} className="d-flex align-items-center gap-1">
                    <IconButton onClick={handleDownloadPdf} color="error" disabled={runningPdf}>
                      <PictureAsPdfIcon />
                    </IconButton>
                    {
                      runningPdf &&
                      <Box sx={{ display: 'flex' }}>
                        <CircularProgress style={{width:'20px', height:'20px'}}/>
                      </Box>
                    }
                  </div>
                </div> */}
              </a>
            </div>
            <div className="kb-doc-pages">
            {/* {documentHeader(index, faq.id, faq.versions)} */}
            {/* { tableOfContents(index, faq.id, faq.question) } */}
            {/* <PublicToC headings={headings} /> */}

            <div className="row">
              <div className="col-xs-12 col-md-8 pos-summary-doc">
                {
                  faq.summary && TocAccordion(tocItems)
                }
              </div>
              <div className="col-xs-12 col-md-4 pos-buttons-doc">
                <div style={{textAlign: 'right'}} className="d-flex gap-2 justify-content-end">
                  <Button variant="text" disabled={true} startIcon={<VisibilityOutlinedIcon />} color="inherit">
                    <span>{views}</span>
                  </Button>
                  {
                    copyLink ?
                    (
                      window.innerWidth < 768 ?
                      (
                        <IconButton
                          type="button"
                          size="small"
                        >
                          <CheckIcon fontSize="inherit"/>
                        </IconButton>
                      )
                      :
                      (
                        // <Button variant="text" startIcon={<CheckIcon />} size="small" style={{textTransform:'capitalize'}}>
                        //   <span>Link copiato</span>
                        // </Button>
                        <IconButton
                          type="button"
                          size="small"
                          color="primary"
                        >
                          <CheckIcon fontSize="inherit"/>
                        </IconButton>
                      )
                    )
                    :
                    (
                      window.innerWidth < 768 ?
                      (
                        <IconButton
                          type="button"
                          size="small"
                          onClick={handleCopyLink}
                        >
                          <ContentCopyOutlinedIcon fontSize="inherit"/>
                        </IconButton>
                      )
                      :
                      (
                        // <Button variant="text" startIcon={<ContentCopyOutlinedIcon />} onClick={handleCopyLink} size="small" style={{textTransform:'capitalize'}}>
                        //   <span>Copia link</span>
                        // </Button>
                        <IconButton
                          type="button"
                          size="small"
                          color="primary"
                          onClick={handleCopyLink}
                        >
                          <ContentCopyOutlinedIcon fontSize="inherit"/>
                        </IconButton>
                      )
                    )
                  }
                  {
                    window.innerWidth < 768 ?
                    (
                      <IconButton
                        type="button"
                        onClick={handleFeedbackClick}
                        size="small"
                        color="warning"
                      >
                        <WarningAmberOutlinedIcon fontSize="inherit"/>
                      </IconButton>
                    )
                    :
                    (
                      <Button variant="text" startIcon={<WarningAmberOutlinedIcon />} onClick={handleFeedbackClick} size="small" style={{textTransform:'capitalize'}} color="warning">
                        <span>Feedback</span>
                      </Button>
                    )
                  }
                </div>
              </div>

            </div>
            {
              faq.link ? 
              (
                <div className="grid-thumbnail">
                  <a className="thumbnail-card d-flex flex-column align-items-center" href={faq.link} target="_blank">
                    <PdfThumbnail
                      file={faq.link}
                      // onClick={() => setSelectedFile(doc.file)}
                    />
                    <p className="label-thumbnail-card m-0 mt-2">{faq.question}</p>
                    {/* <p className="m-0" style={{fontSize: '14px'}}>{formatDate(doc.date)}</p> */}
                  </a>
                </div>
              )
              :
              (
              <Typography component="div" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
                {/* {highlightedContent} */}
                {/* {renderedContent} */}
                {renderedContentWithBackArrow}
              </Typography>
              )
            }
            {documentHeader(faq.versions)}
            </div>
            {showScrollTop && (
              <Fab
                size="small"
                // onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                onClick={() =>
                  contentRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
                sx={{
                  position: "fixed",
                  right: "3rem",
                  top: "87vh",
                  // position: "absolute",
                  // right: "10px",
                  // bottom: "10px",
                  background: "transparent",
                  boxShadow: "none",
                  border: "1px solid",
                }}
              >
                <KeyboardArrowUpIcon />
              </Fab>
            )}
          </CardContent>
        </Collapse>
      </Card>
      <Divider />
    </>
  );
}

export default ArticleBody;
