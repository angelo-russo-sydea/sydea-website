import { useCallback, useEffect, useMemo, useState } from "react";
import ReactQuill from "react-quill";
import { useRef } from "react";
import "react-quill/dist/quill.snow.css";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import KbEditor from "./editor";
import EditIcon from "@mui/icons-material/Edit";

// ─── Costanti ────────────────────────────────────────────────────────────────

const GROUPS       = ["Bologna", "Napoli", "Skopje"];
const STATUSES     = ["draft", "approved", "published"];
const STATUS_LABEL = { draft: "Bozza", approved: "Approvato", published: "Pubblicato" };

const QUILL_FORMATS = [
  "header", "bold", "italic", "underline", "strike",
  "list", "bullet", "indent",
  "link", "image", "code-block", "size"
];

// ─── Stato iniziale ───────────────────────────────────────────────────────────

function buildInitialForm(article, lang, existingId) {
  return {
    id      : existingId ?? article?.id ?? "",
    lang    : lang             ?? "it",
    title   : article?.title   ?? "",
    answer  : article?.answer  ?? "",
    link    : article?.link    ?? "",
    tags    : article?.tags    ?? [],
    groups  : article?.groups  ?? [...GROUPS],
    azureGroups : article?.azureGroups ?? [],
    godMode : article?.godMode ?? false,
    summary : article?.summary ?? false,
    // status  : article?.status  ?? "draft",
    status  : "draft",
    // Versione corrente — verrà incrementata al salvataggio
    // version : article?.version ?? 0,
    changes : "",
  };
}

// ─── Preview HTML ─────────────────────────────────────────────────────────────

function HtmlPreview({ html }) {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        p: 2,
        minHeight: 400,
        bgcolor: "background.paper",
        overflowY: "auto",
        fontSize: '1rem',
        "& img": {
          maxWidth: "100%",
          height  : "auto",
          display : "block",
        },
         "& h1": { fontSize: '1.825rem', fontWeight: 700, lineHeight: '1.2', margin: '1.5rem 0 1rem'},
         "& h2": { fontSize: '1.375rem', fontWeight: 600, lineHeight: '1.3', margin: '1.25rem 0 0.75rem'},
         "& h3": { fontSize: '1.125rem', fontWeight: 600, lineHeight: '1.4rem', margin: '1rem 0 0.5rem'},
         "& blockquote": {
            borderLeft: "4px solid",
            pl: 2,
            ml: 0,
            color: "text.secondary",
            fontStyle: "italic",
          },
          "& code": {
            bgcolor: "grey.100",
            borderRadius: "4px",
            px: 0.75,
            py: 0.25,
            fontFamily: "monospace",
            fontSize: "0.85em",
          },
          "& mark": {
            bgcolor: "#fece2f",
            borderRadius: "2px",
            px: 0.25,
          },
          "& table": {
              width: "100%",
              borderCollapse: "collapse",
              my: 1.5,
              fontSize: "0.9rem",
          },
          "& td, & th": {
              border: "1px solid",
              borderColor: "divider",
              p: "6px 12px",
              minWidth: 60,
              verticalAlign: "top",
          },
          "& td p, & th p": {
            margin: 0,
          },
          "& th": {
              bgcolor: "grey.100",
              fontWeight: 600,
          },
          "& .selectedCell": {
              bgcolor: "primary.50",
          },
          "& hr": {
              border: "none",
              borderTop: "2px solid",
              borderColor: "divider",
              my: 2,
          },
          "& p": { margin: '5px'}
      }}
      dangerouslySetInnerHTML={{ __html: html || "<em style='color:#aaa'>Nessun contenuto</em>" }}
    />
  );
}

// ─── Componente principale ────────────────────────────────────────────────────

/**
 * KbArticleEditor
 *
 * Props:
 *   open       {boolean}
 *   onClose    {function}
 *   onSave     {function}  — (formData) => Promise<void>
 *   article    {object|null}  — dati articolo esistente (null = nuovo)
 *   lang       {string}   — "it" | "en"
 *   categoryId    {string}
 *   subcategoryId {string}
 *   pathUrl    {string}
 */
export default function KbArticleEditor({
  open,
  onClose,
  onSave,
  article,
  lang,
  categoryId,
  subcategoryId,
  pathUrl,
  existingId,
  editorHeaderCategoryAndSub,
  azureGroups
}) {
  const isNew = !article;

  const [form, setForm]         = useState(buildInitialForm(article, lang));
  const [preview, setPreview]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [isImportantVersion, setIsImportantVersion] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const quillRef = useRef(null);

  // Quando si apre l'editor, carica il contenuto completo dell'articolo
  useEffect(() => {
    if (!open) return;

    setForm(buildInitialForm(article, lang, existingId));
    setPreview(false);

    // Se l'articolo esiste ma answer è null, fetchalo da S3
    if (article && (article.answer === null || article.answer === undefined)) {
      const load = async () => {
        setLoading(true);
        try {
          const res = await fetch(
            `${pathUrl}/static/knowledge-base/articles/${lang}/${article.id}.json?_=${Date.now()}`,
            { cache: "no-store" }
          );
          const data = await res.json();
          setForm((prev) => ({ ...prev, answer: data.answer ?? "" }));
        } catch (err) {
          console.error("Errore caricamento articolo:", err);
        } finally {
          setLoading(false);
        }
      };
      load();
    }
  }, [open, article, lang, pathUrl, existingId]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const set = (field) => (value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleTextField = (field) => (e) => set(field)(e.target.value);

  const handleAddTag = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim().replace(/,$/, "");
      if (!form.tags.includes(tag)) {
        set("tags")([...form.tags, tag]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag) =>
    set("tags")(form.tags.filter((t) => t !== tag));

  const handleGroupToggle = (group) => {
    if (form.groups.includes(group)) {
      set("groups")(form.groups.filter((g) => g !== group));
    } else {
      set("groups")([...form.groups, group]);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await onSave({
        ...form,
        categoryId,
        subcategoryId,
        // version: isNew ? 0 : form.version,
        isImportantVersion
      });
      // onClose();
      setHasUnsavedChanges(false);
      setIsImportantVersion(false);
    } catch (err) {
      console.error("Errore salvataggio:", err);
    } finally {
      setSaving(false);
    }
  };

  const editorRef = useRef(null);

  const handleImageUpload = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      // Controllo dimensione — massimo 5MB
      if (file.size > 5 * 1024 * 1024) {
        alert("Immagine troppo grande. Il limite massimo è 5MB.");
        return;
      }

      // Controllo tipo file
      if (!file.type.startsWith('image/')) {
        alert("Il file selezionato non è un'immagine.");
        return;
      }

      // Converti in base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result.split(',')[1];

        try {
          const res = await fetch(`${process.env.REACT_APP_KB_API_URL}/kb`, {
            method : "POST",
            headers: { "Content-Type": "application/json" },
            body   : JSON.stringify({
              action : "upload_image",
              payload: {
                filename   : file.name,
                contentType: file.type,
                data       : base64,
              },
            }),
          });

          const result = await res.json();
          if (!res.ok) throw new Error(result.error);

          // Inserisce l'immagine nell'editor tramite URL S3
          // const quill = quillRef.current.getEditor();
          // const range = quill.getSelection(true);
          // quill.insertEmbed(range.index, 'image', result.url);
          editorRef.current?.insertImage(result.url);
          // setForm((prev) => ({
          //   ...prev,
          //   answer: prev.answer + `<img src="${result.url}" alt="${file.name}" />`,
          // }));

        } catch (err) {
          console.error("Errore caricamento immagine:", err);
          alert("Errore durante il caricamento dell'immagine.");
        }
      };
      reader.readAsDataURL(file);
    };
  }, []);
  // }, [quillRef]);

  const QUILL_MODULES = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ["bold", "italic", "underline", "strike"],
        ['blockquote', 'code-block'],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["link", "image"],
        ["code-block"],
        ["clean"],
      ],
      handlers: {
        image: handleImageUpload,
      },
    },
    // toolbar: [
    //   [{ header: [1, 2, 3, false] }],
    //   ["bold", "italic", "underline", "strike"],
    //   [{ list: "ordered" }, { list: "bullet" }],
    //   [{ indent: "-1" }, { indent: "+1" }],
    //   ["link", "image"],
    //   ["code-block"],
    //   ["clean"],
    // ],
  }), [handleImageUpload]);

    const handleClose = () => {
      if (hasUnsavedChanges) {
        setShowConfirmDialog(true);
      } else {
        onClose();
      }
    };

    const confirmClose = () => {
      setHasUnsavedChanges(false);
      setShowConfirmDialog(false);
      onClose();
    };

    const cancelClose = () => {
      setShowConfirmDialog(false);
    };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      {/* Titolo dialog */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor: "#fece2f",
          color: "#090909",
          py: 1.5,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            {isNew ? (
              "Nuovo articolo"
            ) : (
              <>
                <EditIcon fontSize="small" />
                &nbsp; {form.title || form.id}
              </>
            )}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {editorHeaderCategoryAndSub} · {lang.toUpperCase()}
          </Typography>
        </Box>
        <Tooltip title={preview ? "Torna all'editor" : "Anteprima HTML"}>
          <IconButton onClick={() => setPreview((v) => !v)} sx={{ color: "#090909" }}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
        <IconButton onClick={handleClose} sx={{ color: "#090909" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Dialog
        open={showConfirmDialog}
        onClose={cancelClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Modifiche non salvate
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Ci sono modifiche non salvate. Sei sicuro di voler uscire senza salvare?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelClose} color="primary">
            Annulla
          </Button>
          <Button onClick={confirmClose} color="error" variant="contained" autoFocus>
            Esci senza salvare
          </Button>
        </DialogActions>
      </Dialog>

      {/* <DialogContent dividers sx={{ p: 3, bgcolor: "grey.50" }}> */}
      <DialogContent dividers sx={{ p: 0, bgcolor: "grey.50", overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          // <Grid container spacing={3}>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, height: "100%", overflow: { xs: "auto", md: "hidden" }}}>

            {/* Colonna sinistra: metadati */}
            {/* <Grid item xs={12} md={4}> */}
              <Box
                sx={{
                  width       : { xs: "100%", md: 320 },
                  flexShrink  : 0,
                  borderRight: { xs: "none", md: "1px solid #e8e8e8" },
                  borderColor : "divider",
                  overflowY   : "auto",
                  p           : 3,
                  height      : "100%",
                  display: "flex",
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                {/* ID — solo per nuovi articoli */}
                {isNew && (
                  <TextField
                    label="ID articolo"
                    value={form.id}
                    // onChange={handleTextField("id")}
                    onChange={(e) => set("id")(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    onKeyDown={(e) => {
                      if (e.key === ' ') {
                        e.preventDefault();
                        set("id")(form.id + '-');
                      }
                    }}
                    disabled={!!existingId}
                    fullWidth
                    size="small"
                    helperText={existingId ? "ID ereditato dalla versione esistente" : "Slug univoco, es: smartworking-regulations"}
                    required
                  />
                )}

                {isNew && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.5, display: "block" }}>
                      Lingua
                    </Typography>
                    <Select
                      value={form.lang}
                      onChange={(e) => set("lang")(e.target.value)}
                      size="small"
                      fullWidth
                      disabled={!!existingId}
                    >
                      <MenuItem value="it">IT — Italiano</MenuItem>
                      <MenuItem value="en">EN — English</MenuItem>
                    </Select>
                  </Box>
                )}

                {/* Titolo */}
                <TextField
                  label="Titolo"
                  value={form.title}
                  onChange={handleTextField("title")}
                  fullWidth
                  size="small"
                  required
                  multiline
                  maxRows={4}
                />

                {/* Link esterno */}
                {/* <TextField
                  label="Link esterno (opzionale)"
                  value={form.link}
                  onChange={handleTextField("link")}
                  fullWidth
                  size="small"
                  placeholder="https://..."
                /> */}

                <Divider />

                {/* Stato */}
                {/* <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.5, display: "block" }}>
                    Stato
                  </Typography>
                  {isNew ? (
                    <TextField
                      value="Bozza"
                      size="small"
                      fullWidth
                      disabled
                    />
                  ) : (
                    <Select
                      value={form.status}
                      onChange={(e) => set("status")(e.target.value)}
                      size="small"
                      fullWidth
                    >
                      {STATUSES.map((s) => (
                        <MenuItem key={s} value={s}>{STATUS_LABEL[s]}</MenuItem>
                      ))}
                    </Select>
                  )}
                </Box> */}

                {/* Versione */}
                {!isNew && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mb: 0.5 }}>
                      Versione corrente
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      v{article?.version ?? 0}
                    </Typography>
                  </Box>
                )}

                {!isNew && form.status === "draft" && (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isImportantVersion}
                        onChange={(e) => setIsImportantVersion(e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#fece2f',},
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'rgb(251, 193, 0)'},
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          Nuova versione importante?
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Verrà creata una nuova versione maggiore 
                          (es. 2.5 → 3.0)
                        </Typography>
                      </Box>
                    }
                  />
                )}

                {/* <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.5, display: "block" }}>
                    Versione corrente
                  </Typography>
                  <TextField
                    value={form.version}
                    onChange={(e) => set("version")(parseInt(e.target.value, 10) || 0)}
                    type="number"
                    size="small"
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </Box> */}

                <TextField
                  label="Note di questa modifica"
                  value={form.changes ?? ""}
                  onChange={(e) => set("changes")(e.target.value)}
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  placeholder="Descrivi brevemente cosa è cambiato..."
                  helperText="Verrà salvato nello storico versioni"
                />

                <Divider />

                {/* Sommario */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.summary}
                      onChange={(e) => set("summary")(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#fece2f',},
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'rgb(251, 193, 0)'},
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" fontWeight={600}>
                      Abilita Indice
                    </Typography>
                  }
                />

                <Divider />

                {/* Gruppi */}
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: "block" }}>
                    Visibile per (Ufficio)
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {GROUPS.map((g) => (
                      <Chip
                        key={g}
                        label={g}
                        onClick={() => handleGroupToggle(g)}
                        // color={form.groups.includes(g) ? "primary" : "default"}
                        variant={form.groups.includes(g) ? "filled" : "outlined"}
                        size="small"
                        sx={{
                          cursor: "pointer",
                          backgroundColor: form.groups.includes(g) ? "#fece2f" : "#f0f0f0", // blu se selezionato, grigio altrimenti
                          // color: form.groups.includes(g) ? "#fff" : "#000",
                          "&:hover": {
                            backgroundColor: form.groups.includes(g) ? "#edb600" : "#e0e0e0"
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Divider />

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                    sx={{ mb: 1, display: "block" }}
                  >
                    Gruppi Azure AD
                  </Typography>

                  <Autocomplete
                    multiple
                    options={azureGroups}
                    disableCloseOnSelect
                    size="small"
                    value={azureGroups.filter(group =>
                      form.azureGroups.some(g => g.id === group.id)
                    )}
                    onChange={(event, selectedGroups) => {
                      setHasUnsavedChanges(true);

                      set("azureGroups")(
                        selectedGroups.map(group => ({
                          id: group.id,
                          name: group.name
                        }))
                      );
                    }}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Seleziona gruppi Azure..."
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option.name}
                          size="small"
                          {...getTagProps({ index })}
                          key={option.id}
                        />
                      ))
                    }
                  />
                </Box>

                {/* GodMode */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.godMode}
                      onChange={(e) => set("godMode")(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#fece2f',},
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'rgb(251, 193, 0)'},
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" fontWeight={600}>
                      Solo admin (godMode)
                    </Typography>
                  }
                />

                <Divider />

                {/* Tag */}
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.5, display: "block" }}>
                    Tag (premi Invio o virgola per aggiungere)
                  </Typography>
                  <TextField
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    size="small"
                    fullWidth
                    placeholder="Aggiungi tag..."
                  />
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                    {form.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        onDelete={() => handleRemoveTag(tag)}
                      />
                    ))}
                  </Box>
                </Box>

              </Box>
            {/* </Grid> */}

            {/* Colonna destra: editor / preview */}
              <Box 
                sx={{
                  flex      : 1,
                  overflowY: { xs: "unset", md: "auto" },
                  p: { xs: 1, md: 3 },
                  height: { xs: "auto", md: "100%" },
                }}
              >
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {preview ? "Anteprima" : "Contenuto"}
                </Typography>
                {preview ? (
                  <HtmlPreview html={form.answer} />
                ) : (
                  <KbEditor
                    ref={editorRef}
                    value={form.answer}
                    summaryEnabled={form.summary}
                    onChange={(val) => {
                      setHasUnsavedChanges(true);
                      setForm((prev) => ({
                        ...prev,
                        answer: val,
                        status: prev.status !== "draft" ? "draft" : prev.status,
                      }));
                    }}
                    onImageUpload={handleImageUpload}
                  />
                )}
              </Box>
            {/* </Grid> */}

          {/* </Grid> */}
          </Box>
        )}
      </DialogContent>

      {/* Azioni */}
      <DialogActions sx={{ px: 3, py: 1.5, bgcolor: "background.paper" }}>
        <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
          {isNew ? "Nuovo articolo" : `ID: ${form.id}`}
        </Typography>
        <Button onClick={onClose} disabled={saving}>
          Annulla
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          // disabled={saving || !form.title.trim() || !form.id.trim()}
          disabled={saving || !form.title.trim() || !form.id.trim() || !hasUnsavedChanges}
          startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
        >
          {saving ? "Salvataggio..." : "Salva"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}