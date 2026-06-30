import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CheckIcon from "@mui/icons-material/Check";

// ─── Dialog di conferma eliminazione ─────────────────────────────────────────

function ConfirmDeleteDialog({ open, onClose, onConfirm, message }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Conferma eliminazione</DialogTitle>
      <DialogContent>
        <Typography variant="body2">{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Annulla</Button>
        <Button onClick={onConfirm} color="error" variant="contained">Elimina</Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Riga con editing inline ──────────────────────────────────────────────────

function InlineEditRow({ labelIT, labelEN, id, onRename, onDelete, deleteDisabled, deleteTooltip }) {
  const [editing, setEditing] = useState(false);
  const [valueIT, setValueIT] = useState(labelIT ?? "");
  const [valueEN, setValueEN] = useState(labelEN ?? "");
  const [saving, setSaving]   = useState(false);

  const handleSave = async () => {
    if (
      !valueIT.trim() ||
      !valueEN.trim() ||
      (valueIT === labelIT && valueEN === labelEN)
    ) {
      setEditing(false);
      return;
    }
    setSaving(true);
    await onRename({
      labelIT: valueIT.trim(),
      labelEN: valueEN.trim(),
    });
    setSaving(false);
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter")  handleSave();
    if (e.key === "Escape") {
      setEditing(false);
      setValueIT(labelIT ?? "");
      setValueEN(labelEN ?? "");
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
      {editing ? (
        <>
          <TextField
            label="IT"
            value={valueIT}
            onChange={(e) => setValueIT(e.target.value)}
            size="small"
            sx={{ flex: 1 }}
          />
          <TextField
            label="EN"
            value={valueEN}
            onChange={(e) => setValueEN(e.target.value)}
            size="small"
            sx={{ flex: 1 }}
          />
          {/* <TextField
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            size="small"
            autoFocus
            sx={{ flex: 1 }}
          /> */}
          <Tooltip title="Salva">
            <IconButton size="small" color="primary" onClick={handleSave} disabled={saving}>
              {saving ? <CircularProgress size={16} /> : <CheckIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Annulla">
            <IconButton size="small" onClick={() => { setEditing(false); setValueIT(labelIT ?? ''); setValueEN(labelEN ?? ''); }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <>
          <Box sx={{ flex: 1 }}>
            {/* <Typography variant="body2" fontWeight={500}>
              {label ?? id}
            </Typography> */}
            <Typography variant="body2" fontWeight={500}>
              {labelIT} 🇮🇹 - {labelEN} 🇬🇧
            </Typography>
            <Typography variant="caption" color="text.disabled">
              {id}
            </Typography>
          </Box>
          <Tooltip title="Rinomina">
            <IconButton size="small" onClick={() => setEditing(true)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={deleteTooltip ?? "Elimina"}>
            <span>
              <IconButton
                size="small"
                color="error"
                onClick={onDelete}
                disabled={deleteDisabled}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </>
      )}
    </Box>
  );
}

// ─── Componente principale ────────────────────────────────────────────────────

/**
 * KbCategoryManager
 *
 * Props:
 *   open    {boolean}
 *   onClose {function}
 *   index   {object}    — index.json corrente
 *   apiUrl  {string}    — URL API Gateway
 *   onSaved {function}  — chiamata dopo ogni operazione riuscita
 */
export default function KbCategoryManager({ open, onClose, index, apiUrl, onSaved }) {
  // const [openCategories, setOpenCategories] = useState({});
  const [openCategories, setOpenCategories] = useState(() => {
    const initial = {};
    for (const cat of index?.categories ?? []) {
      initial[cat.id] = true;
    }
    return initial;
  });
  const [error, setError]                   = useState(null);
  const [success, setSuccess]               = useState(null);

  // Nuova categoria
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatId, setNewCatId]     = useState("");
  const [newCatLabelIT, setNewCatLabelIT] = useState("");
  const [newCatLabelEN, setNewCatLabelEN] = useState("");
  const [addingCat, setAddingCat]   = useState(false);

  // Nuova sottocategoria
  const [addingSubFor, setAddingSubFor]   = useState(null);
  const [newSubId, setNewSubId]           = useState("");
  // const [newSubLabel, setNewSubLabel]     = useState("");
  const [newSubCatLabelIT, setNewSubCatLabelIT] = useState("");
  const [newSubCatLabelEN, setNewSubCatLabelEN] = useState("");
  const [savingSubFor, setSavingSubFor]   = useState(false);

  // Conferma eliminazione
  const [confirmDelete, setConfirmDelete] = useState(null);

  const categories = index?.categories ?? [];

  // ── API call ───────────────────────────────────────────────────────────────
  const callApi = async (operation, payload) => {
    setError(null);
    const res = await fetch(`${apiUrl}/kb`, {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify({
        action  : "manage_category",
        payload : { operation, ...payload },
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
    return data;
  };

  const withFeedback = async (fn, successMsg) => {
    try {
      await fn();
      setSuccess(successMsg);
      setTimeout(() => setSuccess(null), 3000);
      if (onSaved) onSaved();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleCategory = (catId) =>
    setOpenCategories(prev => ({ ...prev, [catId]: !prev[catId] }));

  // ── Operazioni categorie ───────────────────────────────────────────────────
  const handleAddCategory = async () => {
    if (!newCatId.trim() || !newCatLabelIT.trim() || !newCatLabelEN.trim()) return;
    setAddingCat(true);
    await withFeedback(
      () => callApi("add_category", { categoryId: newCatId.trim(), newLabelIT: newCatLabelIT.trim(), newLabelEN: newCatLabelEN.trim() }),
      "Categoria aggiunta"
    );
    setAddingCat(false);
    setNewCatId("");
    // setNewCatLabel("");
    setNewCatLabelIT("");
    setNewCatLabelEN("");
    setShowAddCat(false);
  };

  // const handleRenameCategory = async (catId, newLabel) => {
  const handleRenameCategory = async (catId, { labelIT, labelEN }) => {
    await withFeedback(
      () => callApi("rename_category", { categoryId: catId, newLabelIT: labelIT, newLabelEN: labelEN }),
      "Categoria rinominata"
    );
  };

  const handleDeleteCategory = (catId) => {
    const hasArticles = index.articles.some(a => a.category === catId);
    if (hasArticles) {
      setConfirmDelete({
        message  : `Impossibile eliminare: la categoria "${catId}" contiene articoli. Rimuovi prima tutti gli articoli.`,
        onConfirm: null,
      });
      return;
    }
    setConfirmDelete({
      message  : `Sei sicuro di voler eliminare la categoria "${catId}"? L'operazione non è reversibile.`,
      onConfirm: async () => {
        setConfirmDelete(null);
        await withFeedback(
          () => callApi("delete_category", { categoryId: catId }),
          "Categoria eliminata"
        );
      },
    });
  };

  // ── Operazioni sottocategorie ──────────────────────────────────────────────
  const handleAddSubcategory = async (catId) => {
    if (!newSubId.trim() || !newSubCatLabelIT.trim() || !newSubCatLabelEN.trim()) return;
    setSavingSubFor(true);
    await withFeedback(
      () => callApi("add_subcategory", {
        categoryId    : catId,
        subcategoryId : newSubId.trim(),
        newLabelIT    : newSubCatLabelIT.trim(),
        newLabelEN    : newSubCatLabelEN.trim(),
      }),
      "Sottocategoria aggiunta"
    );
    setSavingSubFor(false);
    setNewSubId("");
    // setNewSubLabel("");
    setNewSubCatLabelIT("");
    setNewSubCatLabelEN("");
    setAddingSubFor(null);
  };

  const handleRenameSubcategory = async (catId, subId, { labelIT, labelEN }) => {
    await withFeedback(
      () => callApi("rename_subcategory", { categoryId: catId, subcategoryId: subId, newLabelIT: labelIT, newLabelEN: labelEN }),
      "Sottocategoria rinominata"
    );
  };

  const handleDeleteSubcategory = (catId, subId) => {
    const hasArticles = index.articles.some(
      a => a.category === catId && a.subcategory === subId
    );
    if (hasArticles) {
      setConfirmDelete({
        message  : `Impossibile eliminare: la sottocategoria "${subId}" contiene articoli. Rimuovi prima tutti gli articoli.`,
        onConfirm: null,
      });
      return;
    }
    setConfirmDelete({
      message  : `Sei sicuro di voler eliminare la sottocategoria "${subId}"? L'operazione non è reversibile.`,
      onConfirm: async () => {
        setConfirmDelete(null);
        await withFeedback(
          () => callApi("delete_subcategory", { categoryId: catId, subcategoryId: subId }),
          "Sottocategoria eliminata"
        );
      },
    });
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { maxHeight: "90vh" } }}
      >
        <DialogTitle
          sx={{
            display   : "flex",
            alignItems: "center",
            gap       : 1,
            bgcolor   : "#fece2f",
            color     : "#090909",
            py        : 1.5,
          }}
        >
          <FolderOpenIcon sx={{ opacity: 0.8 }} />
          <Typography variant="subtitle1" fontWeight={700} sx={{ flex: 1 }}>
            Gestione categorie
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "#090909" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 2 }}>

          {error   && <Alert severity="error"   sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          {/* Lista categorie */}
          {categories.map((cat) => {
            const isOpen       = openCategories[cat.id] === true; // aperto di default
            const articleCount = index.articles.filter(a => a.category === cat.id).length;

            return (
              <Box
                key={cat.id}
                sx={{ mb: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}
              >
                {/* Header categoria */}
                <Box
                  sx={{
                    display   : "flex",
                    alignItems: "center",
                    gap       : 1,
                    px        : 2,
                    py        : 1,
                    bgcolor   : "grey.100",
                  }}
                >
                  <IconButton size="small" onClick={() => toggleCategory(cat.id)} sx={{ p: 0 }}>
                    <ExpandMoreIcon
                      fontSize="small"
                      sx={{
                        transform : isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    />
                  </IconButton>
                  {isOpen
                    ? <FolderOpenIcon fontSize="small" color="action" />
                    : <FolderIcon fontSize="small" color="action" />
                  }
                  <InlineEditRow
                    // label={cat.label ?? cat.id}
                    // label={`${cat.labelIT} 🇮🇹 - ${cat.labelEN} 🇬🇧`}
                    labelIT={cat.labelIT}
                    labelEN={cat.labelEN}
                    id={'ID: ' + cat.id}
                    // onRename={(newLabel) => handleRenameCategory(cat.id, newLabel)}
                    onRename={(labels) => handleRenameCategory(cat.id, labels)}
                    onDelete={() => handleDeleteCategory(cat.id)}
                    deleteDisabled={articleCount > 0}
                    deleteTooltip={articleCount > 0 ? "Contiene articoli — non eliminabile" : "Elimina categoria"}
                  />
                  <Chip
                    label={`${articleCount}`}
                    size="small"
                    sx={{ minWidth: 28 }}
                  />
                </Box>

                {/* Sottocategorie */}
                <Collapse in={isOpen}>
                  <List dense disablePadding>
                    {(cat.subcategories ?? []).map((sub) => {
                      const subCount = index.articles.filter(
                        a => a.category === cat.id && a.subcategory === sub.id
                      ).length;

                      return (
                        <ListItem
                          key={sub.id}
                          sx={{ pl: 5, borderTop: "1px solid", borderColor: "divider" }}
                        >
                          <ListItemText
                            primary={
                              <InlineEditRow
                                // label={sub.label ?? sub.id}
                                // label={`${sub.labelIT} 🇮🇹 - ${sub.labelEN} 🇬🇧`}
                                labelIT={sub.labelIT}
                                labelEN={sub.labelEN}
                                id={'ID: ' + sub.id}
                                onRename={(newLabel) => handleRenameSubcategory(cat.id, sub.id, newLabel)}
                                onDelete={() => handleDeleteSubcategory(cat.id, sub.id)}
                                deleteDisabled={subCount > 0}
                                deleteTooltip={subCount > 0 ? "Contiene articoli — non eliminabile" : "Elimina sottocategoria"}
                              />
                            }
                            secondary={<p style={{fontSize: '0.7rem'}}>{`${subCount} documenti (IT + EN)`}</p>}
                          />
                        </ListItem>
                      );
                    })}

                    {/* Form nuova sottocategoria */}
                    {addingSubFor === cat.id ? (
                      <ListItem
                        sx={{
                          pl            : 5,
                          borderTop     : "1px dashed",
                          borderColor   : "divider",
                          flexDirection : "column",
                          alignItems    : "stretch",
                          gap           : 1,
                          py            : 1.5,
                        }}
                      >
                        <TextField
                          label="ID sottocategoria"
                          value={newSubId}
                          onChange={(e) => setNewSubId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                          onKeyDown={(e) => {
                            if (e.key === ' ') {
                              e.preventDefault();
                              setNewSubId(prev => prev + '-');
                            }
                          }}
                          size="small"
                          fullWidth
                          helperText="es. general-regulations"
                          autoFocus
                        />
                        <div className="row">
                          <div className="col-6">
                            <TextField
                              label="Label IT"
                              value={newSubCatLabelIT}
                              onChange={(e) => setNewSubCatLabelIT(e.target.value)}
                              size="small"
                              fullWidth
                            />
                          </div>
                          <div className="col-6">
                            <TextField
                              label="Label EN"
                              value={newSubCatLabelEN}
                              onChange={(e) => setNewSubCatLabelEN(e.target.value)}
                              size="small"
                              fullWidth
                            />
                          </div>
                        </div>
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                          <Button
                            size="small"
                            onClick={() => { setAddingSubFor(null); setNewSubId(""); setNewSubCatLabelIT(""); setNewSubCatLabelEN(""); }}
                          >
                            Annulla
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleAddSubcategory(cat.id)}
                            disabled={savingSubFor || !newSubId.trim() || !newSubCatLabelIT.trim() || !newSubCatLabelEN.trim()}
                            startIcon={savingSubFor ? <CircularProgress size={14} /> : <AddIcon />}
                          >
                            Aggiungi
                          </Button>
                        </Box>
                      </ListItem>
                    ) : (
                      <ListItem sx={{ pl: 5, borderTop: "1px dashed", borderColor: "divider", py: 0.5 }}>
                        <Button
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => {
                            setAddingSubFor(cat.id);
                            setOpenCategories(prev => ({ ...prev, [cat.id]: true }));
                          }}
                          sx={{ textTransform: "none" }}
                        >
                          Aggiungi sottocategoria
                        </Button>
                      </ListItem>
                    )}
                  </List>
                </Collapse>
              </Box>
            );
          })}

          <Divider sx={{ my: 2 }} />

          {/* Form nuova categoria */}
          {showAddCat ? (
            <Box
              sx={{
                display       : "flex",
                flexDirection : "column",
                gap           : 1.5,
                p             : 2,
                border        : "1px dashed",
                borderColor   : "primary.main",
                borderRadius  : 2,
              }}
            >
              <Typography variant="caption" fontWeight={700} color="primary">
                Nuova categoria
              </Typography>
              <TextField
                label="ID categoria"
                value={newCatId}
                onChange={(e) => setNewCatId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    e.preventDefault();
                    setNewCatId(prev => prev + '-');
                  }
                }}
                size="small"
                fullWidth
                helperText="es. health-safety — non modificabile dopo la creazione"
                autoFocus
              />
              <div className="row">
                <div className="col-6">
                  <TextField
                    label="Testo IT"
                    value={newCatLabelIT}
                    onChange={(e) => setNewCatLabelIT(e.target.value)}
                    size="small"
                    fullWidth
                    // helperText="es. Health & Safety"
                  />
                </div>
                <div className="col-6">
                  <TextField
                    label="Testo EN"
                    value={newCatLabelEN}
                    onChange={(e) => setNewCatLabelEN(e.target.value)}
                    size="small"
                    fullWidth
                    // helperText="es. Health & Safety"
                  />
                </div>
              </div>
              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                <Button
                  size="small"
                  onClick={() => { setShowAddCat(false); setNewCatId(""); setNewCatLabelIT(""); setNewCatLabelEN(""); }}
                >
                  Annulla
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleAddCategory}
                  disabled={addingCat || !newCatId.trim() || !newCatLabelIT.trim() || !newCatLabelEN.trim()}
                  startIcon={addingCat ? <CircularProgress size={14} /> : <AddIcon />}
                >
                  Aggiungi categoria
                </Button>
              </Box>
            </Box>
          ) : (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setShowAddCat(true)}
              fullWidth
              sx={{ textTransform: "none" }}
            >
              Aggiungi nuova categoria
            </Button>
          )}

        </DialogContent>

        <DialogActions sx={{ px: 3, py: 1.5 }}>
          <Button onClick={onClose}>Chiudi</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog conferma eliminazione */}
      <ConfirmDeleteDialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        onConfirm={confirmDelete?.onConfirm ?? (() => setConfirmDelete(null))}
        message={confirmDelete?.message ?? ""}
      />
    </>
  );
}
