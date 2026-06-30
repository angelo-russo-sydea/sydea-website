import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RestoreIcon from "@mui/icons-material/Restore";
import HistoryIcon from "@mui/icons-material/History";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LanguageIcon from '@mui/icons-material/Language';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { formatDate } from "../../services/FormattedDate";
import { useParams } from "react-router-dom";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

// ─── Costanti ────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  published : { label: "Pubblicato", color: "success"  },
  approved  : { label: "Approvato",  color: "info"     },
  draft     : { label: "Bozza",      color: "warning"  },
  released  : { label: "Released",   color: "default"  },
};

// ─── Preview HTML minimale ────────────────────────────────────────────────────

function SnapshotPreview({ html }) {
  if (!html) {
    return (
      <Typography variant="body2" color="text.disabled" fontStyle="italic">
        Snapshot non disponibile per questa versione.
      </Typography>
    );
  }
  return (
    <Box
      sx={{
        border       : "1px solid",
        borderColor  : "divider",
        borderRadius : 1,
        p            : 2,
        maxHeight    : 300,
        overflowY    : "auto",
        bgcolor      : "grey.50",
        fontSize     : "0.8rem",
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// ─── Riga versione ────────────────────────────────────────────────────────────

function VersionRow({ entry, index, isCurrent, isLiveVersion, onRollback, onPreview, previewOpen, onRequestRollback }) {
  const cfg = STATUS_CONFIG[entry.status] ?? { label: entry.status, color: "default" };
  const { lang: langFromUrl } = useParams();
  return (
    <TableRow
      hover
      key={index}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        <Chip
          label={`v${entry.versionNumber}`}
          size="small"
          color={isCurrent ? "primary" : "default"}
          variant={isCurrent ? "filled" : "outlined"}
          sx={{ fontWeight: 700, minWidth: 48 }}
        />
      </TableCell>
      <TableCell>
        <Chip
          label={cfg.label}
          color={cfg.color}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      </TableCell>
      <TableCell>
        <Typography variant="caption" color="text.secondary">
          { entry.date ? formatDate(entry.date, langFromUrl) : "—" }
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="caption" color="text.secondary">
          {entry.author ?? "—"}
        </Typography>
      </TableCell>
      <TableCell>
        {entry.changes && (
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic", fontSize: '0.8rem' }}>
            {entry.changes}
          </Typography>
        )}
      </TableCell>
      <TableCell>
        {/* {isCurrent && (
          <Chip
            label="Ultima lavorazione"
            size="small"
            color="primary"
            variant="outlined"
            sx={{ ml: "auto", fontWeight: 600 }}
          />
        )} */}
        {isLiveVersion && (
          <CheckCircleOutlineOutlinedIcon color="info"/>
          // <Chip
          //   label="Online"
          //   size="small"
          //   color="info"
          //   icon={<LanguageIcon style={{ fontSize: 14 }} />}
          //   sx={{ ml: "auto", fontWeight: 600 }}
          // />
        )}
      </TableCell>
      <TableCell sx={{textAlign: 'center'}}>
        {entry.snapshot && (
          <IconButton size="small" variant="outlined" onClick={() => onPreview(index)}>
            {previewOpen ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
          </IconButton>
          // <Button
          //   size="small"
          //   variant="outlined"
          //   onClick={() => onPreview(index)}
          //   sx={{ textTransform: "none", fontSize: '0.7rem' }}
          // >
          //   {previewOpen ? "Nascondi anteprima" : "Vedi snapshot"}
          // </Button>
        )}
      {/* Anteprima snapshot */}
      <Dialog open={previewOpen} onClose={() => onPreview(index)} maxWidth="md">
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <SnapshotPreview html={entry.snapshot} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onPreview(index)}>Chiudi</Button>
        </DialogActions>
      </Dialog>
      {/* {previewOpen && (
        <Box sx={{ mt: 2 }}>
          <SnapshotPreview html={entry.snapshot} />
        </Box>
      )} */}
      </TableCell>
      <TableCell>
        {!isCurrent && !entry._isCurrent && (
          <Tooltip title="Ripristina questo contenuto come nuova bozza">
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              startIcon={<RestoreIcon />}
              onClick={() => onRequestRollback(index)}
              sx={{ textTransform: "none" }}
            >
              Rollback
            </Button>
          </Tooltip>
        )}
      </TableCell>
    </TableRow>
  );

  return (
    <Box
      sx={{
        border       : "1px solid",
        borderColor  : isCurrent ? "primary.main" : "divider",
        borderRadius : 2,
        p            : 1,
        bgcolor      : isCurrent ? "primary.50" : "background.paper",
        transition   : "border-color 0.2s",
      }}
    >
      {/* Header riga */}
      <div className="row">
        <div className="col-xs-12 col-md-8">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Chip
              label={`v${entry.versionNumber}`}
              size="small"
              color={isCurrent ? "primary" : "default"}
              variant={isCurrent ? "filled" : "outlined"}
              sx={{ fontWeight: 700, minWidth: 48 }}
            />
            <Chip
              label={cfg.label}
              color={cfg.color}
              size="small"
              sx={{ fontWeight: 600 }}
            />
            <Typography variant="caption" color="text.secondary">
              { entry.date ? formatDate(entry.date, langFromUrl) : "—" }
            </Typography>
            <Typography variant="caption" color="text.secondary">
              · {entry.author ?? "—"}
            </Typography>
            {isCurrent && (
              <Chip
                label="Ultima lavorazione"
                size="small"
                color="primary"
                variant="outlined"
                sx={{ ml: "auto", fontWeight: 600 }}
              />
            )}
            {isLiveVersion && (
              <Chip
                  label="Online"
                  size="small"
                  color="info"
                  icon={<LanguageIcon style={{ fontSize: 14 }} />}
                  sx={{ ml: "auto", fontWeight: 600 }}
              />
            )}
          </Box>
          {/* Note modifica */}
          {entry.changes && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: "italic" }}>
              {entry.changes}
            </Typography>
          )}
        </div>
        <div className="col-xs-12 col-md-4">
          {/* Azioni */}
          <Box sx={{ display: "flex", justifyContent: 'end', gap: 1, mt: 1.5, flexWrap: "wrap" }}>
            {entry.snapshot && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => onPreview(index)}
                sx={{ textTransform: "none" }}
              >
                {previewOpen ? "Nascondi anteprima" : "Vedi snapshot"}
              </Button>
            )}
            {!isCurrent && !entry._isCurrent && (
              <Tooltip title="Ripristina questo contenuto come nuova bozza">
                <Button
                  size="small"
                  variant="contained"
                  color="warning"
                  startIcon={<RestoreIcon />}
                  onClick={() => onRequestRollback(index)}
                //   onClick={() => onRollback(index)}
                  sx={{ textTransform: "none" }}
                >
                  Rollback
                </Button>
              </Tooltip>
            )}
          </Box>
        </div>
      </div>

      {/* Anteprima snapshot */}
      {previewOpen && (
        <Box sx={{ mt: 2 }}>
          <SnapshotPreview html={entry.snapshot} />
        </Box>
      )}
    </Box>
  );
}

// ─── Componente principale ────────────────────────────────────────────────────

/**
 * KbVersionHistory
 *
 * Props:
 *   open          {boolean}
 *   onClose       {function}
 *   articleId     {string}
 *   lang          {string}   — "it" | "en"
 *   pathUrl       {string}
 *   apiUrl        {string}   — URL API Gateway
 *   authorName    {string}   — nome utente attivo
 *   onRollbackDone {function} — chiamata dopo rollback riuscito
 */
export default function KbVersionHistory({
  open,
  onClose,
  articleTitle,
  articleId,
  lang,
  pathUrl,
  apiUrl,
  authorName,
  onRollbackDone,
}) {
  const [versions, setVersions]       = useState([]);
  const [loading, setLoading]         = useState(false);
  const [rolling, setRolling]         = useState(false);
  const [error, setError]             = useState(null);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [confirmIndex, setConfirmIndex] = useState(null);
  const [confirmRollback, setConfirmRollback] = useState(null);
  const [statusFilter, setStatusFilter] = useState([]);

  const { lang: langFromUrl } = useParams();

  // ── Carica versioni ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open || !articleId) return;

    setLoading(true);
    setError(null);
    setPreviewIndex(null);
    setConfirmIndex(null);
    setStatusFilter([]);

    fetch(
      `${pathUrl}/static/knowledge-base/articles/${lang}/${articleId}.json?_=${Date.now()}`,
      { cache: "no-store" }
    )
      .then((r) => r.json())
      .then((data) => {
        // // Ordine cronologico inverso — la più recente in cima
        // const sorted = [...(data.versions ?? [])].reverse();
        // setVersions(sorted);
        const historicalVersions = [...(data.versions ?? [])].reverse();

        if (historicalVersions.length === 0) {
            setVersions([{
            versionNumber : "-",
            status        : "draft",
            author        : "—",
            date          : "—",
            changes       : "",
            snapshot      : data.answer,
            _isCurrent    : true,
            }]);
            return;
        }

        const currentEntry = {
            ...historicalVersions[0],
            snapshot  : data.answer,
            _isCurrent: true,
        };

        setVersions([currentEntry, ...historicalVersions.slice(1)]);
        // setVersions([currentEntry, ...historicalVersions.slice(1)]);
      })
      .catch((err) => {
        console.error("Errore caricamento versioni:", err);
        setError("Impossibile caricare lo storico versioni.");
      })
      .finally(() => setLoading(false));
  }, [open, articleId, lang, pathUrl]);

  // ── Rollback ───────────────────────────────────────────────────────────────
  const handleRollback = async (realIndex) => {
  // const handleRollback = async (displayIndex) => {
    // displayIndex è l'indice nell'array invertito — dobbiamo risalire all'indice reale
    // const realIndex = versions.length - 1 - displayIndex;
    setRolling(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/kb`, {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({
          action : "rollback_version",
          payload: {
            id           : articleId,
            lang,
            // versionIndex : realIndex,
            versionNumber: confirmRollback.versionNumber,
            author       : authorName ?? "admin",
          },
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setConfirmIndex(realIndex);

      // Ricarica le versioni aggiornate
      const updated = await fetch(
        `${pathUrl}/static/knowledge-base/articles/${lang}/${articleId}.json?_=${Date.now()}`,
        { cache: "no-store" }
      ).then((r) => r.json());

      setVersions([...(updated.versions ?? [])].reverse());
      setConfirmIndex(null);

      if (onRollbackDone) onRollbackDone();

    } catch (err) {
      console.error("Errore rollback:", err);
      setError("Errore durante il rollback. Riprova.");
    } finally {
      setRolling(false);
    }
  };

  const handlePreviewToggle = (index) => {
    setPreviewIndex((prev) => (prev === index ? null : index));
  };

  const handleToggleStatus = (status) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status) // deseleziona
        : [...prev, status] // seleziona
    );
  };

  const filteredVersions =
    statusFilter.length === 0
      ? versions
      : versions.filter((v) => statusFilter.includes(v.status));

  // const liveIndex = versions.findIndex(v => v.status === "published");
  const liveIndex = filteredVersions.findIndex(v => v.status === "published");

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { maxHeight: "95vh" } }}
      sx={{
        height: "95vh"
      }}
    >
      {/* Titolo */}
      <DialogTitle
        sx={{
          display   : "flex",
          alignItems: "center",
          gap       : 1,
          bgcolor   : "grey.900",
          color     : "white",
          py        : 1.5,
        }}
      >
        <HistoryIcon sx={{ opacity: 0.8 }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Storico versioni
          </Typography>
          <Typography variant="body2">
            {articleTitle} · {lang?.toUpperCase()}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            ID: {articleId}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 2, bgcolor: "grey.50" }}>

        {/* Errore */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Rollback in corso */}
        {rolling && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Rollback in corso...
          </Alert>
        )}

        {/* Lista versioni */}
        {!loading && versions.length === 0 && (
          <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
            Nessuna versione disponibile.
          </Typography>
        )}

        {!loading && (
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            {["published", "approved", "draft"].map((status) => {
              const cfg = STATUS_CONFIG[status];
              return (
                <Chip
                  key={status}
                  label={cfg.label}
                  color={cfg.color}
                  size="small"
                  clickable
                  variant={statusFilter.includes(status) ? "filled" : "outlined"}
                  onClick={() => handleToggleStatus(status)}
                  sx={{ fontWeight: 600 }}
                />
              );
            })}
          </Box>
        )}

        {!loading && versions.length > 0 && (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          {/* <TableContainer component={Paper}> */}
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader sx={{ minWidth: 650, minHeight: 440, border:'inherit' }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Versione</TableCell>
                    <TableCell>Stato</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Autore</TableCell>
                    <TableCell>Modifica</TableCell>
                    <TableCell>Online</TableCell>
                    <TableCell>Snapshot</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {/* {versions.map((entry, i) => ( */}
                {filteredVersions.map((entry, i) => (
                  <VersionRow
                    key={i}
                    entry={entry}
                    index={i}
                    isCurrent={entry._isCurrent === true}
                    isLiveVersion={i === liveIndex}
                    onRollback={handleRollback}
                    //  onRequestRollback={(idx) => setConfirmRollback(idx)}
                    onRequestRollback={() => setConfirmRollback(entry)}
                    onPreview={handlePreviewToggle}
                    previewOpen={previewIndex === i}
                  />
                ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          // <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          //   {versions.map((entry, i) => (
          //     <VersionRow
          //       key={i}
          //       entry={entry}
          //       index={i}
          //       isCurrent={entry._isCurrent === true}
          //       isLiveVersion={i === liveIndex}
          //       onRollback={handleRollback}
          //       onRequestRollback={(idx) => setConfirmRollback(idx)}
          //       onPreview={handlePreviewToggle}
          //       previewOpen={previewIndex === i}
          //     />
          //   ))}
          // </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
          {versions.length} {versions.length === 1 ? "versione" : "versioni"} disponibili
        </Typography>
        <Button onClick={onClose}>Chiudi</Button>
      </DialogActions>
    </Dialog>

    <Dialog
    open={confirmRollback !== null}
    onClose={() => setConfirmRollback(null)}
    maxWidth="xs"
    fullWidth
    >
    <DialogTitle>Conferma rollback</DialogTitle>
    <DialogContent>
        <Typography variant="body2">
        Sei sicuro di voler ripristinare questa versione? Il contenuto attuale verrà sostituito e l'articolo tornerà in stato Bozza.
        </Typography>
        {confirmRollback && (
        <Box sx={{ mt: 2, p: 1.5, bgcolor: "grey.100", borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
            Versione da ripristinare
            </Typography>
            <Typography variant="body2" fontWeight={600}>
            {/* v{versions[confirmRollback].versionNumber} · {versions[confirmRollback].date} */}
            {/* v{versions[confirmRollback].versionNumber} · {formatDate(versions[confirmRollback].date, langFromUrl)} */}
            v{confirmRollback.versionNumber} · {formatDate(confirmRollback.date, langFromUrl)}
            </Typography>
            {/* {versions[confirmRollback].changes && ( */}
            {confirmRollback.changes && (
            <Typography variant="caption" color="text.secondary" fontStyle="italic">
                {/* {versions[confirmRollback].changes} */}
                {confirmRollback.changes}
            </Typography>
            )}
        </Box>
        )}
    </DialogContent>
    <DialogActions>
        <Button onClick={() => setConfirmRollback(null)} color="inherit">
        Annulla
        </Button>
        <Button
        variant="contained"
        color="secondary"
        startIcon={<RestoreIcon />}
        onClick={() => {
          // const idx = confirmRollback;
          // setConfirmRollback(null);
          // handleRollback(idx);
          const entry = confirmRollback;
          const realIndex = versions.findIndex(
            (v) => v.versionNumber === entry.versionNumber
          );
          setConfirmRollback(null);
          handleRollback(realIndex);
        }}
        >
        Conferma rollback
        </Button>
    </DialogActions>
    </Dialog>
    </>
  );
}
