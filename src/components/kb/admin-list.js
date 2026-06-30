import { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import FolderIcon from "@mui/icons-material/Folder";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import SaveIcon from "@mui/icons-material/Save";
import UndoIcon from "@mui/icons-material/Undo";
import SortIcon from "@mui/icons-material/Sort";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { AppContext } from "../../services/translationContext";
import Grid from "@mui/material/Grid";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import BackspaceIcon from "@mui/icons-material/Backspace";
import Badge from "@mui/material/Badge";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { formatDate } from "../../services/FormattedDate";
import { useParams } from "react-router-dom";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import ArticlesTable from "./articles-table";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import TableRowsIcon from "@mui/icons-material/TableRows";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ─── Costanti ────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  published: { label: "Pubblicato", color: "success" },
  approved: { label: "Approvato", color: "info" },
  draft: { label: "Bozza", color: "warning" },
  released: { label: "Released", color: "default" },
};

const STATUS_FLOW = ["draft", "approved", "published"];

const STATUS_TRANSITIONS = {
  draft: ["approved"],
  approved: ["published", "draft"],
  published: ["draft"],
};

const LANGS = ["it", "en"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = ["draft", "approved", "published"];

// ─── LangCell (invariato) ────────────────────────────────────────────────────

function LangCell({
  article,
  lang,
  onEdit,
  onHistory,
  onStatusChange,
  articleId,
  categoryId,
  subcategoryId,
  onDelete,
  reorderMode,
}) {
  const [anchor, setAnchor] = useState(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [notes, setNotes] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { lang: langFromUrl } = useParams();

  const canGoTo = (current, next) => STATUS_TRANSITIONS[current]?.includes(next);

  const compareVersions = (a, b) => {
    const pa = String(a).split(".").map(Number);
    const pb = String(b).split(".").map(Number);
    const len = Math.max(pa.length, pb.length);
    for (let i = 0; i < len; i++) {
      const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
      if (diff !== 0) return diff;
    }
    return 0;
  };

  const lastPublishedVersion = article?.lastPublishedVersion?.versionNumber;
  const isOutdated =
    lastPublishedVersion &&
    compareVersions(article.version, lastPublishedVersion) > 0;

  if (!article) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body2" color="text.disabled" fontStyle="italic">
          Non presente
        </Typography>
        {!reorderMode && (
          <Tooltip title={`Crea versione ${lang.toUpperCase()}`}>
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEdit(null, lang, articleId, categoryId, subcategoryId)}
            >
              <AddCircleOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", opacity: reorderMode ? 0.6 : 1 }}>
      <Box sx={{ width: "100%", textAlign: "left" }}>
        <Typography
          variant="caption"
          color="text.secondary"
          component="span"
          sx={{ fontWeight: 600 }}
        >
          {article.title}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <Tooltip title={reorderMode ? "Disabilita ordinamento per cambiare stato" : "Cambia stato"}>
          <Chip
            label={STATUS_CONFIG[article.status]?.label ?? article.status}
            color={STATUS_CONFIG[article.status]?.color ?? "default"}
            size="small"
            onClick={reorderMode ? undefined : (e) => setAnchor(e.currentTarget)}
            sx={{
              fontWeight: 600,
              cursor: reorderMode ? "default" : "pointer",
              fontSize: "0.7rem",
            }}
          />
        </Tooltip>

        {!reorderMode && (
          <Menu
            anchorEl={anchor}
            open={Boolean(anchor)}
            onClose={() => setAnchor(null)}
          >
            {STATUS_FLOW.map((status, index) => {
              const isCurrent = article.status === status;
              const isAllowed = canGoTo(article.status, status);
              return (
                <Box key={status}>
                  <MenuItem
                    disabled={!isAllowed && !isCurrent}
                    onClick={() => {
                      setAnchor(null);
                      if (status !== article.status) {
                        setPendingStatus(status);
                        setNotes("");
                        setNotesOpen(true);
                      }
                    }}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      opacity: isAllowed || isCurrent ? 1 : 0.4,
                    }}
                  >
                    <Chip
                      label={STATUS_CONFIG[status].label}
                      color={STATUS_CONFIG[status].color}
                      size="small"
                      variant={isCurrent ? "filled" : "outlined"}
                      sx={{ fontWeight: isCurrent ? 600 : 500 }}
                    />
                  </MenuItem>
                  {index < STATUS_FLOW.length - 1 && (
                    <Box sx={{ px: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <KeyboardDoubleArrowDownIcon fontSize="inherit" sx={{ color: "#a1a1a1" }} />
                    </Box>
                  )}
                </Box>
              );
            })}
          </Menu>
        )}

        <Dialog open={notesOpen} onClose={() => setNotesOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {article.title} - v{article.version}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Cambio stato
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Chip
                label={STATUS_CONFIG[article.status]?.label}
                color={STATUS_CONFIG[article.status]?.color}
                size="small"
                variant="outlined"
              />
              <Typography variant="body2" color="text.secondary">→</Typography>
              <Chip
                label={STATUS_CONFIG[pendingStatus]?.label}
                color={STATUS_CONFIG[pendingStatus]?.color}
                size="small"
              />
            </Box>
            <TextField
              label="Note (opzionale)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={3}
              placeholder={`Stato cambiato in ${STATUS_CONFIG[pendingStatus]?.label ?? pendingStatus}...`}
              autoFocus
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNotesOpen(false)} color="inherit">Annulla</Button>
            <Button
              variant="contained"
              onClick={() => {
                setNotesOpen(false);
                onStatusChange(
                  article,
                  lang,
                  pendingStatus,
                  notes || `Stato cambiato in ${pendingStatus}`
                );
              }}
            >
              Conferma
            </Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Typography variant="caption" color="text.secondary" component="span" sx={{ fontSize: "0.7rem" }}>
            v{article.version} ·{" "}
            {article.lastUpdated ? formatDate(article.lastUpdated, langFromUrl) : "—"}
          </Typography>
          {isOutdated && (
            <Chip
              label={`online v${lastPublishedVersion}`}
              size="small"
              color="info"
              variant="outlined"
              sx={{ height: 18, fontSize: "0.65rem" }}
            />
          )}
        </Box>

        {!reorderMode && (
          <Box sx={{ ml: "auto", display: "flex", gap: 0.5 }}>
            <Tooltip title="Modifica">
              <IconButton size="small" onClick={() => onEdit(article, lang)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Storico versioni">
              <IconButton size="small" onClick={() => onHistory(article, lang)}>
                <HistoryIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Elimina">
              <IconButton size="small" color="error" onClick={() => setConfirmDelete(true)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)} maxWidth="xs" fullWidth>
              <DialogTitle>Conferma eliminazione</DialogTitle>
              <DialogContent>
                <Typography variant="body2">
                  Eliminare definitivamente la versione <strong>{lang.toUpperCase()}</strong> dell'articolo{" "}
                  <strong>{article.title}</strong> (id: {articleId})?
                </Typography>
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  Questa operazione è irreversibile ed eliminerà tutto lo storico versioni per questa lingua.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setConfirmDelete(false)} color="inherit">Annulla</Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setConfirmDelete(false);
                    onDelete(articleId, lang);
                  }}
                >
                  Elimina
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ─── ArticleRow sortable ──────────────────────────────────────────────────────

function ArticleRow({
  articleId,
  articlesByLang,
  onEdit,
  onHistory,
  onStatusChange,
  onDelete,
  reorderMode,
}) {
  const it = articlesByLang.it;
  const en = articlesByLang.en;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: articleId, disabled: !reorderMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    background: isDragging ? "#fffde7" : undefined,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      hover
      sx={{ "&:last-child td": { borderBottom: 0 } }}
    >
      <TableCell sx={{ pl: reorderMode ? 1 : 4, border: 0, borderBottom: "1px solid #e0e0e0" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {reorderMode && (
            <Box
              {...attributes}
              {...listeners}
              sx={{
                cursor: "grab",
                color: "text.disabled",
                display: "flex",
                alignItems: "center",
                "&:active": { cursor: "grabbing" },
              }}
            >
              <DragIndicatorIcon fontSize="small" />
            </Box>
          )}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ letterSpacing: 0.5, fontSize: "0.8rem" }}
          >
            {articleId}
          </Typography>
        </Box>
      </TableCell>

      {LANGS.map((lang) => (
        <TableCell key={lang} sx={{ minWidth: 220, border: 0, borderBottom: "1px solid #e0e0e0" }}>
          <LangCell
            article={articlesByLang[lang] ?? null}
            lang={lang}
            articleId={articleId}
            categoryId={articlesByLang["it"]?.category ?? articlesByLang["en"]?.category ?? ""}
            subcategoryId={
              articlesByLang["it"]?.subcategory ?? articlesByLang["en"]?.subcategory ?? ""
            }
            onEdit={(article, l, existingId, catId, subId) =>
              onEdit(articleId, article, l, existingId, catId, subId)
            }
            onHistory={(article, l) => onHistory(articleId, article, l)}
            onStatusChange={(article, l, newStatus, notes) =>
              onStatusChange(articleId, article, l, newStatus, notes)
            }
            onDelete={onDelete}
            reorderMode={reorderMode}
          />
        </TableCell>
      ))}
    </TableRow>
  );
}

// ─── SubcategoryBlock con articoli sortable ───────────────────────────────────

function SubcategoryBlock({
  categoryId,
  subcategoryId,
  categoryLabelIT,
  categoryLabelEN,
  subcategoryLabelIT,
  subcategoryLabelEN,
  articles,
  onEdit,
  onHistory,
  onAddArticle,
  onStatusChange,
  isArticleVisible,
  onDelete,
  reorderMode,
  // Per aggiornare l'ordine locale degli articoli:
  onArticlesReorder,
}) {
  const [open, setOpen] = useState(true);

  const {
    attributes: subAttributes,
    listeners: subListeners,
    setNodeRef: setSubNodeRef,
    transform: subTransform,
    transition: subTransition,
    isDragging: subIsDragging,
  } = useSortable({ id: subcategoryId, disabled: !reorderMode });

  const subStyle = {
    transform: CSS.Transform.toString(subTransform),
    transition: subTransition,
    opacity: subIsDragging ? 0.4 : 1,
  };

  // Raggruppa per articleId
  const byId = {};
  for (const article of articles) {
    if (!byId[article.id]) byId[article.id] = {};
    let enriched = { ...article };
    if (article.lang === "it") {
      enriched.categoryLabel = categoryLabelIT;
      enriched.subcategoryLabel = subcategoryLabelIT;
    }
    if (article.lang === "en") {
      enriched.categoryLabel = categoryLabelEN;
      enriched.subcategoryLabel = subcategoryLabelEN;
    }
    byId[article.id][article.lang] = enriched;
  }

  const articleIds = Object.keys(byId);
  const visibleIds = reorderMode
    ? articleIds
    : articleIds.filter((id) => isArticleVisible(byId[id]));

  // Hook sempre prima di qualsiasi return condizionale
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = visibleIds.indexOf(active.id);
    const newIndex = visibleIds.indexOf(over.id);
    const newOrder = arrayMove(visibleIds, oldIndex, newIndex);
    onArticlesReorder(categoryId, subcategoryId, newOrder);
  };

  if (!reorderMode && articleIds.length > 0 && visibleIds.length === 0) return null;

  return (
    <Box ref={setSubNodeRef} style={subStyle} sx={{ mb: 1 }}>
      <Box
        {...(reorderMode ? subListeners : {})}
        {...(reorderMode ? subAttributes : {})}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 0.75,
          bgcolor: reorderMode ? "#fff8e1" : "#fff4ce",
          borderRadius: 1,
          cursor: reorderMode ? "grab" : "pointer",
          userSelect: "none",
          "&:hover": { bgcolor: reorderMode ? "#fff3cd" : "#ffeeaf" },
          "&:active": reorderMode ? { cursor: "grabbing" } : {},
          outline: reorderMode ? "1px dashed #f59e0b" : "none",
        }}
        onClick={() => !reorderMode && setOpen((v) => !v)}
      >
        {reorderMode && (
          <Box sx={{ display: "flex", alignItems: "center", color: "#0d0d0d", pointerEvents: "none" }}>
            <DragIndicatorIcon fontSize="small" />
          </Box>
        )}
        {!reorderMode && (
          <IconButton size="small" sx={{ p: 0 }}>
            <ExpandMoreIcon
              fontSize="small"
              sx={{
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </IconButton>
        )}
        <Typography
          variant="body2"
          fontWeight={600}
          color="#0d0d0d"
          sx={{ textTransform: "uppercase", letterSpacing: 0.5, fontSize: "0.7rem" }}
        >
          {subcategoryLabelIT} 🇮🇹 - {subcategoryLabelEN} 🇬🇧
        </Typography>
        <Typography
          variant="body3"
          fontWeight={500}
          color="#0d0d0d"
          sx={{ letterSpacing: 0.5, fontSize: "0.6rem" }}
        >
          ID: {subcategoryId}
        </Typography>
        <Chip
          label={articleIds.length}
          size="small"
          icon={<ArticleOutlinedIcon sx={{ fontSize: "0.75rem !important" }} />}
          sx={{ ml: 0.5, height: 18, fontSize: "0.65rem" }}
        />
        {!reorderMode && (
          <Box sx={{ ml: "auto" }}>
            <Tooltip title="Nuovo articolo in questa sottocategoria">
              <IconButton
                size="small"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddArticle(categoryId, subcategoryId);
                }}
              >
                <AddCircleOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        {reorderMode && (
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ ml: "auto", fontSize: "0.65rem", fontStyle: "italic" }}
          >
            trascina per riordinare gli articoli
          </Typography>
        )}
      </Box>

      <Collapse in={open}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={reorderMode ? handleDragEnd : undefined}
        >
          <SortableContext
            items={visibleIds}
            strategy={verticalListSortingStrategy}
          >
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ mt: 0.5, mb: 1, borderRadius: 1 }}
            >
              <Table size="small" sx={{ border: 0 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.50" }}>
                    <TableCell
                      sx={{
                        pl: reorderMode ? 1 : 4,
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        color: "text.secondary",
                        width: "33.33%",
                        border: 0,
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      {reorderMode ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          {/* <DragIndicatorIcon fontSize="small" sx={{ color: "#f59e0b" }} /> */}
                          ID Articolo
                        </Box>
                      ) : (
                        "ID Articolo"
                      )}
                    </TableCell>
                    {LANGS.map((lang) => (
                      <TableCell
                        key={lang}
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          color: "text.secondary",
                          minWidth: 220,
                          width: "33.33%",
                          border: 0,
                          borderBottom: "1px solid #e0e0e0",
                        }}
                      >
                        {lang.toUpperCase()}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleIds.map((id) => (
                    <ArticleRow
                      key={id}
                      articleId={id}
                      articlesByLang={byId[id]}
                      onEdit={onEdit}
                      onHistory={onHistory}
                      onStatusChange={(articleId, article, l, newStatus, notes) =>
                        onStatusChange(articleId, article, l, newStatus, notes)
                      }
                      onDelete={onDelete}
                      reorderMode={reorderMode}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </SortableContext>
        </DndContext>
      </Collapse>
    </Box>
  );
}

// ─── CategoryBlock sortable ───────────────────────────────────────────────────

function CategoryBlock({
  categoryId,
  categoryLabelIT,
  categoryLabelEN,
  subcategories,
  articles,
  onEdit,
  onHistory,
  onAddArticle,
  onStatusChange,
  isArticleVisible,
  onDelete,
  reorderMode,
  onArticlesReorder,
  onSubcategoriesReorder,
}) {
  const [open, setOpen] = useState(true);

  const subSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleSubcategoryDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = subcategories.findIndex((s) => s.id === active.id);
    const newIndex = subcategories.findIndex((s) => s.id === over.id);
    const newOrder = arrayMove(subcategories, oldIndex, newIndex);
    onSubcategoriesReorder(categoryId, newOrder);
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: categoryId, disabled: !reorderMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const byId = {};
  for (const article of articles) {
    if (!byId[article.id]) byId[article.id] = {};
    byId[article.id][article.lang] = article;
  }

  const hasArticles = articles.length > 0;
  const hasVisibleArticles = Object.keys(byId).some((id) =>
    isArticleVisible(byId[id])
  );
  if (!reorderMode && hasArticles && !hasVisibleArticles) return null;

  const totalArticles = Object.values(
    articles.reduce((acc, a) => {
      acc[a.id] = true;
      return acc;
    }, {})
  ).length;

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...(reorderMode ? attributes : {})}
      variant="outlined"
      sx={{
        mb: 2,
        borderRadius: 2,
        overflow: "hidden",
        outline: reorderMode && isDragging ? "2px solid #f59e0b" : "none",
        boxShadow: isDragging ? "0 8px 24px rgba(0,0,0,0.15)" : undefined,
      }}
    >
      <Box
        {...(reorderMode ? listeners : {})}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 1.25,
          bgcolor: open ? "#fece2f" : "#ffffff",
          cursor: reorderMode ? "grab" : "pointer",
          transition: "background 0.2s",
          userSelect: "none",
          "&:hover": { bgcolor: "#f8be01" },
          "&:active": reorderMode ? { cursor: "grabbing" } : {},
        }}
        onClick={() => !reorderMode && setOpen((v) => !v)}
      >
        {reorderMode && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#090909",
              pointerEvents: "none", // il drag è gestito dal Box padre
            }}
          >
            <DragIndicatorIcon fontSize="small" />
          </Box>
        )}
        {!reorderMode &&
          (open ? (
            <FolderOpenIcon sx={{ color: "#090909", fontSize: 20 }} />
          ) : (
            <FolderIcon sx={{ color: "#090909", fontSize: 20 }} />
          ))}
        <Typography
          variant="subtitle2"
          fontWeight={700}
          color="#090909"
          sx={{ textTransform: "uppercase", letterSpacing: 0.8 }}
        >
          {categoryLabelIT} 🇮🇹 - {categoryLabelEN} 🇬🇧
        </Typography>
        <Typography
          variant="subtitle2"
          fontWeight={500}
          color="#090909"
          sx={{ letterSpacing: 0.8, fontSize: "0.6rem" }}
        >
          ID: {categoryId}
        </Typography>
        <Chip
          label={`${totalArticles}`}
          icon={<ArticleOutlinedIcon />}
          size="small"
          sx={{ bgcolor: "#ffffff94", color: "#090909", fontWeight: 600, height: 20, fontSize: "0.65rem" }}
        />
        {!reorderMode && (
          <IconButton size="small" sx={{ ml: "auto", p: 0 }}>
            <ExpandMoreIcon
              sx={{
                color: "#090909",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </IconButton>
        )}
        {reorderMode && (
          <Typography
            variant="caption"
            sx={{ ml: "auto", fontSize: "0.65rem", fontStyle: "italic", color: "#444" }}
          >
            trascina per riordinare le categorie
          </Typography>
        )}
      </Box>

      {/* In reorderMode la categoria rimane sempre aperta */}
      <Collapse in={reorderMode ? true : open}>
        <Box sx={{ p: 1.5 }}>
          <DndContext
            sensors={subSensors}
            collisionDetection={closestCenter}
            onDragEnd={reorderMode ? handleSubcategoryDragEnd : undefined}
          >
            <SortableContext
              items={subcategories.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {subcategories.map((sub) => {
                const subArticles = articles.filter((a) => a.subcategory === sub.id);
                return (
                  <SubcategoryBlock
                    key={sub.id}
                    categoryId={categoryId}
                    subcategoryId={sub.id}
                    categoryLabelIT={categoryLabelIT}
                    categoryLabelEN={categoryLabelEN}
                    subcategoryLabelIT={sub.labelIT}
                    subcategoryLabelEN={sub.labelEN}
                    articles={subArticles}
                    onEdit={onEdit}
                    onHistory={onHistory}
                    onAddArticle={(catId, subId) => onAddArticle(catId, subId)}
                    onStatusChange={onStatusChange}
                    isArticleVisible={isArticleVisible}
                    onDelete={onDelete}
                    reorderMode={reorderMode}
                    onArticlesReorder={onArticlesReorder}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
        </Box>
      </Collapse>
    </Paper>
  );
}

// ─── Componente principale ────────────────────────────────────────────────────

export default function KbAdminList({
  pathUrl,
  onEdit,
  onHistory,
  onAdd,
  onStatusChange,
  onManageCategories,
  onIndexLoaded,
  onDelete,
  apiUrl,
}) {
  const [index, setIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterStatus, setFilterStatus] = useState([]);
  const [filterLang, setFilterLang] = useState([]);
  const [filterGroup, setFilterGroup] = useState([]);
  const [filterAuthor, setFilterAuthor] = useState([]);
  const [filterGodMode, setFilterGodMode] = useState(null);
  const [filterSearch, setFilterSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [modView, setModView] = useState("grid");

  // ── Stato modalità ordinamento ──────────────────────────────────────────
  const [reorderMode, setReorderMode] = useState(false);
  const [reorderCategories, setReorderCategories] = useState([]); // copia locale categorie
  const [reorderArticles, setReorderArticles] = useState([]);     // copia locale articoli
  const [reorderDirty, setReorderDirty] = useState(false);        // modifiche non salvate
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [savingReorder, setSavingReorder] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${pathUrl}/static/knowledge-base/index.json?_=${Date.now()}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setIndex(data);
        if (onIndexLoaded) onIndexLoaded(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [pathUrl]);

  const handleModView = (event, newMod) => {
    setModView(newMod);
  };

  // ── Entra in modalità ordinamento ────────────────────────────────────────
  const enterReorderMode = () => {
    setReorderCategories(JSON.parse(JSON.stringify(index.categories)));
    setReorderArticles([...index.articles]);
    setReorderDirty(false);
    setReorderMode(true);
  };

  // ── Annulla ordinamento ──────────────────────────────────────────────────
  const handleCancelReorder = () => {
    if (reorderDirty) {
      setConfirmCancelOpen(true);
    } else {
      setReorderMode(false);
    }
  };

  const confirmCancel = () => {
    setConfirmCancelOpen(false);
    setReorderMode(false);
    setReorderDirty(false);
  };

  // ── Drag end categorie ───────────────────────────────────────────────────
  const handleCategoryDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = reorderCategories.findIndex((c) => c.id === active.id);
    const newIndex = reorderCategories.findIndex((c) => c.id === over.id);
    setReorderCategories((prev) => arrayMove(prev, oldIndex, newIndex));
    setReorderDirty(true);
  };

  // ── Riordina articoli dentro una sottocategoria ──────────────────────────
  const handleArticlesReorder = (categoryId, subcategoryId, newArticleIdOrder) => {
    setReorderArticles((prev) => {
      // Separa articoli di questa sottocategoria dagli altri
      const inSub = prev.filter(
        (a) => a.category === categoryId && a.subcategory === subcategoryId
      );
      const outside = prev.filter(
        (a) => !(a.category === categoryId && a.subcategory === subcategoryId)
      );

      // Riordina inSub secondo newArticleIdOrder (che contiene gli id univoci)
      // Ogni id può avere più lingue → manteniamo tutte le lingue insieme
      const reordered = newArticleIdOrder.flatMap((id) =>
        inSub.filter((a) => a.id === id)
      );

      // Reinserisci al posto giusto (dopo gli articoli delle sottocategorie precedenti)
      return [...outside, ...reordered];
    });
    setReorderDirty(true);
  };

  // ── Riordina sottocategorie dentro una categoria ─────────────────────────
  const handleSubcategoriesReorder = (categoryId, newSubcategoryOrder) => {
    setReorderCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, subcategories: newSubcategoryOrder }
          : cat
      )
    );
    setReorderDirty(true);
  };

  // ── Salva ordinamento ────────────────────────────────────────────────────
  const handleSaveReorder = async () => {
    if (!apiUrl) {
      setSnackbar({ open: true, message: "apiUrl non configurato", severity: "error" });
      return;
    }
    setSavingReorder(true);
    try {
      const res = await fetch(`${apiUrl}/kb`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reorder",
          payload: {
            categories: reorderCategories,
            articles: reorderArticles.map(({ id, lang }) => ({ id, lang })),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Errore salvataggio");

      // Aggiorna index locale
      const updatedIndex = {
        ...index,
        categories: reorderCategories,
        articles: reorderArticles,
        lastUpdated: new Date().toISOString(),
      };
      setIndex(updatedIndex);
      if (onIndexLoaded) onIndexLoaded(updatedIndex);

      setReorderMode(false);
      setReorderDirty(false);
      setSnackbar({ open: true, message: "Ordinamento salvato correttamente", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: `Errore: ${err.message}`, severity: "error" });
    } finally {
      setSavingReorder(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ mt: 4 }}>
        <LinearProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: "center" }}>
          Caricamento knowledge base...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography color="error">Errore nel caricamento: {error}</Typography>
      </Box>
    );
  }

  if (!index) return null;

  const authorOptions = [
    ...new Set((index?.articles ?? []).map((a) => a.author).filter(Boolean)),
  ].sort();

  const isArticleVisible = (articlesByLang) => {
    const articles = Object.values(articlesByLang);
    if (filterSearch.trim()) {
      const q = filterSearch.toLowerCase();
      const matches = articles.some(
        (a) =>
          a.id?.toLowerCase().includes(q) ||
          a.title?.toLowerCase().includes(q) ||
          a.category?.toLowerCase().includes(q) ||
          a.subcategory?.toLowerCase().includes(q) ||
          a.tags?.some((t) => t.toLowerCase().includes(q))
      );
      if (!matches) return false;
    }
    if (filterStatus.length > 0) {
      if (!articles.some((a) => filterStatus.includes(a.status))) return false;
    }
    if (filterLang.length > 0) {
      if (!articles.some((a) => filterLang.includes(a.lang))) return false;
    }
    if (filterGroup.length > 0) {
      if (!articles.some((a) => a.groups?.some((g) => filterGroup.includes(g)))) return false;
    }
    if (filterAuthor.length > 0) {
      if (!articles.some((a) => filterAuthor.includes(a.author))) return false;
    }
    if (filterGodMode !== null) {
      if (!articles.some((a) => a.godMode === filterGodMode)) return false;
    }
    return true;
  };

  const activeFiltersCount =
    (filterSearch ? 1 : 0) +
    filterStatus.length +
    filterLang.length +
    filterGroup.length +
    filterAuthor.length +
    (filterGodMode !== null ? 1 : 0);

  // In reorderMode usiamo le copie locali
  const displayCategories = reorderMode ? reorderCategories : index.categories;
  const displayArticles   = reorderMode ? reorderArticles   : index.articles;

  return (
    <Box>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}
        className="row"
      >
        <Box className="col-xs-12 col-md-6">
          <Typography variant="h5" fontWeight={700}>
            Knowledge Base
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {index.categories.length} categorie · {index.articles.length} documenti totali (IT + EN)
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "end",
            "@media (max-width:600px)": { mt: 1 },
          }}
          className="col-xs-12 col-md-6 flex-md-row d-flex flex-sm-row flex-column"
        >
          {!reorderMode ? (
            <>
              <Badge badgeContent={activeFiltersCount} color="error">
                <Button
                  variant={showFilters ? "contained" : "outlined"}
                  size="small"
                  startIcon={<FilterListIcon />}
                  onClick={() => setShowFilters((v) => !v)}
                  sx={{ textTransform: "none", width: '100%' }}
                >
                  Filtri
                </Button>
              </Badge>
              <Button
                variant="outlined"
                startIcon={<FolderOpenIcon />}
                onClick={onManageCategories}
                size="small"
                sx={{ textTransform: "none" }}
              >
                Gestisci categorie
              </Button>
              <Button
                variant="outlined"
                startIcon={<SortIcon />}
                onClick={enterReorderMode}
                size="small"
                sx={{ textTransform: "none" }}
              >
                Cambia ordinamento
              </Button>
              <ToggleButtonGroup
                value={modView}
                exclusive
                onChange={handleModView}
                aria-label="mod view"
                size="small"
                color="primary"
              >
                <ToggleButton value="grid" aria-label="grid view">
                  <ViewComfyIcon />
                </ToggleButton>
                <ToggleButton value="table" aria-label="table view">
                  <TableRowsIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </>
          ) : (
            /* ── Toolbar modalità ordinamento ── */
            <>
              <Alert
                severity="info"
                sx={{ py: 0, fontSize: "0.8rem", alignItems: "center" }}
                icon={<SortIcon fontSize="small" />}
              >
                Modalità ordinamento attiva — trascina categorie e articoli
              </Alert>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<UndoIcon />}
                onClick={handleCancelReorder}
                sx={{ textTransform: "none", whiteSpace: "nowrap" }}
              >
                Annulla
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<SaveIcon />}
                onClick={handleSaveReorder}
                disabled={!reorderDirty || savingReorder}
                sx={{ textTransform: "none", whiteSpace: "nowrap" }}
              >
                {savingReorder ? "Salvataggio..." : "Salva ordine"}
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* ── Barra filtri (nascosta in reorderMode) ─────────────────────── */}
      {!reorderMode && (
        <Collapse in={showFilters}>
          <Paper variant="clear" sx={{ mb: 2, borderRadius: 2, backgroundColor: "#f6f6f6" }}>
            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-md-3">
                  <TextField
                    placeholder="Cerca articolo"
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <SearchIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                      ),
                      endAdornment: filterSearch && (
                        <IconButton size="small" onClick={() => setFilterSearch("")}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      ),
                    }}
                  />
                </div>
                <div className="col-xs-12 col-md-2">
                  <Autocomplete
                    multiple
                    options={["draft", "approved", "published"]}
                    value={filterStatus}
                    onChange={(_, v) => setFilterStatus(v)}
                    getOptionLabel={(o) => STATUS_CONFIG[o]?.label ?? o}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={STATUS_CONFIG[option]?.label ?? option}
                          size="small"
                          color={STATUS_CONFIG[option]?.color ?? "default"}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    renderInput={(params) => <TextField {...params} label="Stato" size="small" />}
                  />
                </div>
                <div className="col-xs-12 col-md-2">
                  <Autocomplete
                    multiple
                    options={["it", "en"]}
                    value={filterLang}
                    onChange={(_, v) => setFilterLang(v)}
                    getOptionLabel={(o) => o.toUpperCase()}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip label={option.toUpperCase()} size="small" {...getTagProps({ index })} />
                      ))
                    }
                    renderInput={(params) => <TextField {...params} label="Lingua" size="small" />}
                  />
                </div>
                <div className="col-xs-12 col-md-2">
                  <Autocomplete
                    multiple
                    options={["Bologna", "Napoli", "Skopje"]}
                    value={filterGroup}
                    onChange={(_, v) => setFilterGroup(v)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip label={option} size="small" {...getTagProps({ index })} />
                      ))
                    }
                    renderInput={(params) => <TextField {...params} label="Gruppo" size="small" />}
                  />
                </div>
                <div className="col-xs-12 col-md-2">
                  <Autocomplete
                    multiple
                    options={authorOptions}
                    value={filterAuthor}
                    onChange={(_, v) => setFilterAuthor(v)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip label={option} size="small" {...getTagProps({ index })} />
                      ))
                    }
                    renderInput={(params) => <TextField {...params} label="Autore" size="small" />}
                  />
                </div>
                <div className="col-xs-12 col-md-1">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setFilterSearch("");
                      setFilterStatus([]);
                      setFilterLang([]);
                      setFilterGroup([]);
                      setFilterAuthor([]);
                      setFilterGodMode(null);
                    }}
                    disabled={
                      !filterSearch &&
                      filterStatus.length === 0 &&
                      filterLang.length === 0 &&
                      filterGroup.length === 0 &&
                      filterAuthor.length === 0 &&
                      filterGodMode === null
                    }
                  >
                    <BackspaceIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>
            </div>
          </Paper>
        </Collapse>
      )}

      {/* ── Lista categorie/articoli ────────────────────────────────────── */}
      {modView === "table" && !reorderMode ? (
        <ArticlesTable articles={index?.articles ?? []} onEdit={onEdit} />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={reorderMode ? handleCategoryDragEnd : undefined}
        >
          <SortableContext
            items={displayCategories.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {displayCategories.map((cat) => {
              const catArticles = displayArticles.filter((a) => a.category === cat.id);
              return (
                <CategoryBlock
                  key={cat.id}
                  categoryId={cat.id}
                  categoryLabelIT={cat.labelIT}
                  categoryLabelEN={cat.labelEN}
                  subcategories={cat.subcategories}
                  articles={catArticles}
                  onEdit={onEdit ?? (() => {})}
                  onHistory={onHistory ?? (() => {})}
                  onAddArticle={onAdd ?? (() => {})}
                  onStatusChange={onStatusChange ?? (() => {})}
                  isArticleVisible={isArticleVisible}
                  onDelete={onDelete}
                  reorderMode={reorderMode}
                  onArticlesReorder={handleArticlesReorder}
                  onSubcategoriesReorder={handleSubcategoriesReorder}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      )}

      {/* ── Dialog conferma annulla ─────────────────────────────────────── */}
      <Dialog
        open={confirmCancelOpen}
        onClose={() => setConfirmCancelOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Annullare le modifiche?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Hai spostato delle categorie o degli articoli. Se esci dalla modalità ordinamento
            senza salvare, le modifiche andranno perse.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmCancelOpen(false)} color="inherit">
            Continua a modificare
          </Button>
          <Button variant="contained" color="error" onClick={confirmCancel}>
            Scarta modifiche
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar feedback ──────────────────────────────────────────── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
