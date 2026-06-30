import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import {
  EditorProvider,
  useCurrentEditor,
  BubbleMenu,
  FloatingMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TableKit } from "@tiptap/extension-table";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Blockquote } from "@tiptap/extension-blockquote";
import InvertColorsOffIcon from "@mui/icons-material/InvertColorsOff";
import { LineHeight } from "@tiptap/extension-text-style";
import FormatLineSpacingIcon from "@mui/icons-material/FormatLineSpacing";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import FunctionsOutlinedIcon from "@mui/icons-material/FunctionsOutlined";
import HardBreak from '@tiptap/extension-hard-break';
import {
  Box,
  Divider,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatStrikethroughIcon from "@mui/icons-material/FormatStrikethrough";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import ImageIcon from "@mui/icons-material/Image";
import TableChartIcon from "@mui/icons-material/TableChart";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import CodeIcon from "@mui/icons-material/Code";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import SubscriptIcon from "@mui/icons-material/Subscript";
import SuperscriptIcon from "@mui/icons-material/Superscript";
import HighlightIcon from "@mui/icons-material/Highlight";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import FormatIndentDecreaseIcon from "@mui/icons-material/FormatIndentDecrease";
import { Typography } from "@mui/material";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";

import { Menu, ListItemIcon, ListItemText } from "@mui/material";
import TableRowsIcon from "@mui/icons-material/TableRows";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import DeleteIcon from "@mui/icons-material/Delete";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Color, TextStyle, FontSize } from "@tiptap/extension-text-style";
import { getHierarchicalIndexes, getLinearIndexes, TableOfContents } from '@tiptap/extension-table-of-contents';
import {Heading} from '@tiptap/extension-heading';
import { Plugin } from 'prosemirror-state';
import { ToC } from "./Toc";
import EditorSearchBar from "./editor-search-bar";
import { marked } from "marked";

const MemorizedToC = React.memo(ToC);

function TableMenu({ editor }) {
  const [anchor, setAnchor] = useState(null);
  const isInTable = editor?.isActive("table");

  if (!isInTable) return null;

  const actions = [
    {
      label: "Aggiungi colonna prima",
      icon: <ViewColumnIcon fontSize="small" />,
      fn: () => editor.chain().focus().addColumnBefore().run(),
    },
    {
      label: "Aggiungi colonna dopo",
      icon: <ViewColumnIcon fontSize="small" />,
      fn: () => editor.chain().focus().addColumnAfter().run(),
    },
    {
      label: "Elimina colonna",
      icon: <DeleteIcon fontSize="small" />,
      fn: () => editor.chain().focus().deleteColumn().run(),
    },
    { divider: true },
    {
      label: "Aggiungi riga prima",
      icon: <TableRowsIcon fontSize="small" />,
      fn: () => editor.chain().focus().addRowBefore().run(),
    },
    {
      label: "Aggiungi riga dopo",
      icon: <TableRowsIcon fontSize="small" />,
      fn: () => editor.chain().focus().addRowAfter().run(),
    },
    {
      label: "Elimina riga",
      icon: <DeleteIcon fontSize="small" />,
      fn: () => editor.chain().focus().deleteRow().run(),
    },
    { divider: true },
    {
      label: "Unisci celle",
      icon: <MergeTypeIcon fontSize="small" />,
      fn: () => editor.chain().focus().mergeCells().run(),
    },
    {
      label: "Dividi cella",
      icon: <CallSplitIcon fontSize="small" />,
      fn: () => editor.chain().focus().splitCell().run(),
    },
    {
      label: "Unisci o dividi",
      icon: <MergeTypeIcon fontSize="small" />,
      fn: () => editor.chain().focus().mergeOrSplit().run(),
    },
    { divider: true },
    {
      label: "Intestazione colonna",
      icon: <ViewColumnIcon fontSize="small" />,
      fn: () => editor.chain().focus().toggleHeaderColumn().run(),
    },
    {
      label: "Intestazione riga",
      icon: <TableRowsIcon fontSize="small" />,
      fn: () => editor.chain().focus().toggleHeaderRow().run(),
    },
    {
      label: "Intestazione cella",
      icon: <TableRowsIcon fontSize="small" />,
      fn: () => editor.chain().focus().toggleHeaderCell().run(),
    },
    { divider: true },
    {
      label: "Elimina tabella",
      icon: <DeleteIcon fontSize="small" color="error" />,
      fn: () => editor.chain().focus().deleteTable().run(),
      color: "error.main",
    },
  ];

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Tooltip title="Opzioni tabella">
        <Button
          size="small"
          variant="outlined"
          startIcon={<TableChartOutlinedIcon fontSize="small" />}
          onClick={(e) => setAnchor(e.currentTarget)}
          sx={{ textTransform: "none", fontSize: "0.75rem", py: 0.25 }}
        >
          Tabella
        </Button>
      </Tooltip>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        PaperProps={{ sx: { minWidth: 200 } }}
      >
        {actions.map((action, i) =>
          action.divider ? (
            <Divider key={i} />
          ) : (
            <MenuItem
              key={i}
              dense
              onClick={() => {
                action.fn();
                setAnchor(null);
              }}
              sx={{ color: action.color ?? "inherit" }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>{action.icon}</ListItemIcon>
              <ListItemText primaryTypographyProps={{ fontSize: "0.8rem" }}>
                {action.label}
              </ListItemText>
            </MenuItem>
          ),
        )}
      </Menu>
    </Box>
  );
}

// ─── Estrai headings dall'editor ─────────────────────────────────────────────

function extractHeadings(editor) {
  if (!editor) return [];
  const headings = [];
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === "heading") {
      headings.push({
        level: node.attrs.level,
        text: node.textContent,
        id: `heading-${pos}`,
        pos,
      });
    }
  });
  return headings;
}

// ─── TOC component ────────────────────────────────────────────────────────────

function CustomTableOfContents({ editor }) {
  const headings =
    useEditorState({
      editor,
      selector: ({ editor }) => extractHeadings(editor),
    }) ?? [];

  if (!headings || headings.length < 2) return null;

  const scrollTo = (pos) => {
    if (!editor) return;
    editor.commands.focus();
    const coords = editor.view.coordsAtPos(pos);
    const editorEl = editor.view.dom.closest(".kb-editor-wrap");
    if (editorEl) {
      editorEl.scrollTop = coords.top - 120;
    }
  };

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        p: 1.5,
        mb: 1,
        bgcolor: "grey.50",
      }}
    >
      <Typography
        variant="caption"
        fontWeight={700}
        color="text.secondary"
        sx={{
          display: "block",
          mb: 0.5,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        Indice
      </Typography>
      {headings.map((h, i) => (
        <Box
          key={i}
          onClick={() => scrollTo(h.pos)}
          sx={{
            pl: (h.level - 1) * 1.5,
            py: 0.25,
            cursor: "pointer",
            fontSize: "0.8rem",
            color: "text.secondary",
            borderRadius: 0.5,
            "&:hover": { color: "primary.main", bgcolor: "action.hover" },
          }}
        >
          {h.text}
        </Box>
      ))}
    </Box>
  );
}

// ─── Toolbar button ───────────────────────────────────────────────────────────

function ToolbarButton({ title, onClick, active, disabled, children }) {
  return (
    <Tooltip title={title}>
      <span>
        <IconButton
          size="small"
          onClick={onClick}
          disabled={disabled}
          sx={{
            borderRadius: 1,
            bgcolor: active ? "action.selected" : "transparent",
            color: active ? "primary.main" : "text.secondary",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
}

function ToolbarDivider() {
  return <Divider orientation="vertical" flexItem sx={{ mx: 0.25, my: 0.5 }} />;
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

function Toolbar({ editor, onImageUpload, scrollRef }) {
  const [lineHeightAnchor, setLineHeightAnchor] = useState(null);
  const [scriptAnchor, setScriptAnchor] = useState(null);

  const addLink = () => {
    const prev = editor.getAttributes("link").href ?? "";
    const url = window.prompt("Inserisci URL:", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
    }
  };

  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      color: ctx.editor?.getAttributes("textStyle").color ?? "#000000",
      isBold: ctx.editor?.isActive("bold"),
      isItalic: ctx.editor?.isActive("italic"),
      lineHeight: ctx.editor.isActive("textStyle", { lineHeight: "1.5" })
        ? "1.5"
        : ctx.editor.isActive("textStyle", { lineHeight: "2.0" })
          ? "2.0"
          : ctx.editor.isActive("textStyle", { lineHeight: "4.0" })
            ? "4.0"
            : "default",
    }),
  });

  if (!editor) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 0.25,
        p: 0.75,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "grey.50",
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}
    >
      {/* Undo / Redo */}
      <ToolbarButton
        title="Annulla"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <UndoIcon fontSize="small" />
      </ToolbarButton>
      <ToolbarButton
        title="Ripeti"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <RedoIcon fontSize="small" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Stile paragrafo */}
      <Select
        size="small"
        value={
          editor.isActive("heading", { level: 1 })
            ? "h1"
            : editor.isActive("heading", { level: 2 })
              ? "h2"
              : editor.isActive("heading", { level: 3 })
                ? "h3"
                : editor.isActive("heading", { level: 4 })
                  ? "h4"
                  : "p"
        }
        onChange={(e) => {
          const val = e.target.value;
          if (val === "p") editor.chain().focus().setParagraph().run();
          else
            editor
              .chain()
              .focus()
              .toggleHeading({ level: parseInt(val.replace("h", "")) })
              .run();
        }}
        sx={{ height: 28, fontSize: "0.8rem", mr: 0.5, minWidth: 110 }}
      >
        <MenuItem value="h1" sx={{ fontSize: '1.825rem', fontWeight: 700, lineHeight: '1.825rem' }}>
          Titolo 1
        </MenuItem>
        <MenuItem value="h2" sx={{ fontSize: '1.375rem', fontWeight: 700, lineHeight: '1.375rem' }}>
          Titolo 2
        </MenuItem>
        <MenuItem value="h3" sx={{ fontSize: '1.125rem', fontWeight: 700, lineHeight: '1.125rem' }}>
          Titolo 3
        </MenuItem>
        <MenuItem value="p" sx={{ fontSize: "1rem" }}>
          Paragrafo
        </MenuItem>
      </Select>

      <Select
        size="small"
        value={editor.getAttributes('textStyle').fontSize || 'default'}
        onChange={(e) => {
          const value = e.target.value;
          if (value === 'default') {
            editor.chain().focus().unsetFontSize().run();
          } else {
            editor.chain().focus().setFontSize(value).run();
          }
        }}
        sx={{ height: 28, fontSize: "0.8rem", mr: 0.5, minWidth: 90 }}
        // disabled={
        //   editor.isActive('heading', { level: 1 }) ||
        //   editor.isActive('heading', { level: 2 }) ||
        //   editor.isActive('heading', { level: 3 })
        // }
        disabled={
          [1, 2, 3, 4].some(level => editor.isActive('heading', { level }))
        }
      >
        <MenuItem value="default">Default</MenuItem>
        <MenuItem value="12px">12px</MenuItem>
        <MenuItem value="14px">14px</MenuItem>
        <MenuItem value="16px">16px</MenuItem>
        <MenuItem value="18px">18px</MenuItem>
        <MenuItem value="24px">24px</MenuItem>
        <MenuItem value="32px">32px</MenuItem>
      </Select>

      <Tooltip title="Interlinea">
        <IconButton
          size="small"
          onClick={(e) => setLineHeightAnchor(e.currentTarget)}
          sx={{
            borderRadius: 1,
            color:
              editorState?.lineHeight !== "default"
                ? "primary.main"
                : "text.secondary",
            bgcolor:
              editorState?.lineHeight !== "default"
                ? "action.selected"
                : "transparent",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <FormatLineSpacingIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={lineHeightAnchor}
        open={Boolean(lineHeightAnchor)}
        onClose={() => setLineHeightAnchor(null)}
      >
        {[
          { label: "Predefinita", value: "0" },
          { label: "Singola (1.5)", value: "1.5" },
          { label: "Doppia (2.0)", value: "2.0" },
          { label: "Tripla (4.0)", value: "4.0" },
        ].map((opt) => (
          <MenuItem
            key={opt.value}
            selected={editorState?.lineHeight === opt.value}
            dense
            onClick={() => {
              if (opt.value === "default") {
                editor.chain().focus().unsetLineHeight().run();
              } else {
                editor
                  .chain()
                  .focus()
                  .toggleTextStyle({ lineHeight: opt.value })
                  .run();
              }
              setLineHeightAnchor(null);
            }}
          >
            <ListItemText primaryTypographyProps={{ fontSize: "0.85rem" }}>
              {opt.label}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>

      <ToolbarDivider />

      {/* Formattazione testo */}
      <ToolbarButton
        title="Grassetto"
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
      >
        <FormatBoldIcon fontSize="small" />
      </ToolbarButton>
      <ToolbarButton
        title="Corsivo"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
      >
        <FormatItalicIcon fontSize="small" />
      </ToolbarButton>
      <ToolbarButton
        title="Sottolineato"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
      >
        <FormatUnderlinedIcon fontSize="small" />
      </ToolbarButton>
      <ToolbarButton
        title="Barrato"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
      >
        <FormatStrikethroughIcon fontSize="small" />
      </ToolbarButton>
      <ToolbarDivider />
      <Tooltip title="Colore testo">
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <input
            type="color"
            value={editorState?.color ?? "#000000"}
            onChange={(e) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
            style={{
              width: 28,
              height: 28,
              padding: 2,
              border: "1px solid #ccc",
              borderRadius: 4,
              cursor: "pointer",
              background: "none",
            }}
          />
        </Box>
      </Tooltip>

      <Tooltip title="Rimuovi colore">
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().unsetColor().run()}
          sx={{ color: "text.secondary" }}
        >
          <InvertColorsOffIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <ToolbarButton
        title="Evidenzia"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        active={editor.isActive("highlight")}
      >
        <HighlightIcon fontSize="small" />
      </ToolbarButton>
      <ToolbarButton
        title="Codice inline"
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive("code")}
      >
        <CodeIcon fontSize="small" />
      </ToolbarButton>
      {/* <ToolbarButton
        title="Pedice"
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        active={editor.isActive("subscript")}
      >
        <SubscriptIcon fontSize="small" />
      </ToolbarButton>
      <ToolbarButton
        title="Apice"
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        active={editor.isActive("superscript")}
      >
        <SuperscriptIcon fontSize="small" />
      </ToolbarButton> */}

      <Tooltip title="Pedice / Apice">
        <IconButton
          size="small"
          onClick={(e) => setScriptAnchor(e.currentTarget)}
          sx={{
            borderRadius: 1,
            color:
              editor.isActive("subscript") || editor.isActive("superscript")
                ? "primary.main"
                : "text.secondary",
            bgcolor:
              editor.isActive("subscript") || editor.isActive("superscript")
                ? "action.selected"
                : "transparent",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          {editor.isActive("superscript") ? (
            <SuperscriptIcon fontSize="small" />
          ) : (
            <SubscriptIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={scriptAnchor}
        open={Boolean(scriptAnchor)}
        onClose={() => setScriptAnchor(null)}
      >
        <MenuItem
          dense
          selected={editor.isActive("subscript")}
          onClick={() => {
            editor.chain().focus().toggleSubscript().run();
            setScriptAnchor(null);
          }}
        >
          <ListItemIcon>
            <SubscriptIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: "0.85rem" }}>
            Pedice
          </ListItemText>
        </MenuItem>
        <MenuItem
          dense
          selected={editor.isActive("superscript")}
          onClick={() => {
            editor.chain().focus().toggleSuperscript().run();
            setScriptAnchor(null);
          }}
        >
          <ListItemIcon>
            <SuperscriptIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: "0.85rem" }}>
            Apice
          </ListItemText>
        </MenuItem>
      </Menu>

      <ToolbarDivider />

      {/* Liste */}
      <ToolbarButton
        title="Lista puntata"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
      >
        <FormatListBulletedIcon fontSize="small" />
      </ToolbarButton>
      <ToolbarButton
        title="Lista numerata"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
      >
        <FormatListNumberedIcon fontSize="small" />
      </ToolbarButton>
      <ToolbarButton
        title="Aumenta indentazione"
        onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
        disabled={!editor.can().sinkListItem("listItem")}
      >
        <FormatIndentIncreaseIcon fontSize="small" />
      </ToolbarButton>
      <ToolbarButton
        title="Diminuisci indentazione"
        onClick={() => editor.chain().focus().liftListItem("listItem").run()}
        disabled={!editor.can().liftListItem("listItem")}
      >
        <FormatIndentDecreaseIcon fontSize="small" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Allineamento */}
      <ToolbarButton
        title="Allinea a sinistra"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        active={editor.isActive({ textAlign: "left" })}
      >
        <FormatAlignLeftIcon fontSize="small" />
      </ToolbarButton>
      <ToolbarButton
        title="Centra"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        active={editor.isActive({ textAlign: "center" })}
      >
        <FormatAlignCenterIcon fontSize="small" />
      </ToolbarButton>
      <ToolbarButton
        title="Allinea a destra"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        active={editor.isActive({ textAlign: "right" })}
      >
        <FormatAlignRightIcon fontSize="small" />
      </ToolbarButton>
      <ToolbarButton
        title="Giustifica"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        active={editor.isActive({ textAlign: "justify" })}
      >
        <FormatAlignJustifyIcon fontSize="small" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Blocchi */}
      <ToolbarButton
        title="Citazione"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
      >
        <FormatQuoteIcon fontSize="small" />
      </ToolbarButton>
      <ToolbarButton
        title="Separatore orizzontale"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <HorizontalRuleIcon fontSize="small" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Link */}
      <ToolbarButton
        title="Inserisci / modifica link"
        onClick={addLink}
        active={editor.isActive("link")}
      >
        <LinkIcon fontSize="small" />
      </ToolbarButton>
      <ToolbarButton
        title="Rimuovi link"
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive("link")}
      >
        <LinkOffIcon fontSize="small" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Immagine e tabella */}
      <ToolbarButton title="Inserisci immagine" onClick={onImageUpload}>
        <ImageOutlinedIcon fontSize="small" />
      </ToolbarButton>
      <ToolbarButton title="Inserisci tabella" onClick={addTable}>
        <TableChartOutlinedIcon fontSize="small" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Rimuovi formattazione */}
      <ToolbarButton
        title="Rimuovi formattazione"
        onClick={() =>
          editor.chain().focus().unsetAllMarks().clearNodes().run()
        }
      >
        <FormatClearIcon fontSize="small" />
      </ToolbarButton>

      <TableMenu editor={editor} />
      
      <EditorSearchBar editor={editor} scrollRef={scrollRef} />
    </Box>
  );
}

// ─── Componente principale ────────────────────────────────────────────────────

/**
 * KbEditor
 *
 * Props:
 *   value         {string}    — HTML corrente
 *   onChange      {function}  — (html) => void
 *   onImageUpload {function}  — () => void
 *   minHeight     {number}    — altezza minima in px (default 420)
 */
const KbEditor = forwardRef(function KbEditor(
  { value, summaryEnabled, onChange, onImageUpload, minHeight = 420 },
  ref,
) {
  const isInternalUpdate = useRef(false);
  const [items, setItems] = useState([]);
  const scrollRef = useRef(null);
  const countersRef = useRef([]);
//   const [tocItems, setTocItems] = useState([]);

    const CustomHeading = Heading.extend({
        addAttributes() {
            return {
            ...this.parent?.(),
            id: {
                default: null,
                renderHTML: attributes => {
                if (!attributes.id) return {}
                return {
                    id: attributes.id,
                    'data-toc-id': attributes.id,
                }
                },
            },
            }
        },
    });

    const generateId = (text) =>
    text
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');


    const HeadingIdPlugin = new Plugin({
    appendTransaction: (transactions, oldState, newState) => {
        let tr = newState.tr
        let modified = false

        newState.doc.descendants((node, pos) => {
        if (node.type.name === 'heading') {
            if (!node.attrs.id) {
            const text = node.textContent
            const id = generateId(text)

            tr = tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                id,
            })

            modified = true
            }
        }
        })

        return modified ? tr : null
    },
    })

    function buildHierarchicalToc(items) {
    const counters = [];

    return items.map((item) => {
        let level = Number(item.originalLevel ?? item.level ?? 1);
        if (!Number.isFinite(level) || level < 1) level = 1;

        while (counters.length < level) {
        counters.push(0);
        }

        counters[level - 1] += 1;
        counters.length = level;

        return {
        ...item,
        displayIndex: counters.join('.'),
        };
    });
    }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        blockquote: {},
        codeBlock: {},
        horizontalRule: {},
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
      }),
      Image.configure({
        HTMLAttributes: { style: "max-width:100%;height:auto;display:block;" },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          style: "border-color: #fece2f",
        },
      }),
      TableKit.configure({
        table: { resizable: true },
      }),
      TableOfContents.configure({
          // anchorTypes: ['heading', 'customAnchorType'],
          // getIndex: (anchor, previousAnchors, level) => {
          //     return 1
          // },
          // getIndex: (anchor, previousAnchors) => {
          //     const indexes = []

          //     // risali la gerarchia dal livello corrente fino a 1
          //     for (let level = anchor.level; level >= 1; level--) {
          //         let count = 0

          //         for (let i = previousAnchors.length - 1; i >= 0; i--) {
          //         const a = previousAnchors[i]

          //         if (a.level < level) break
          //         if (a.level === level) count++
          //         }

          //         // +1 per includere l'anchor corrente
          //         if (level === anchor.level) count += 1

          //         indexes.unshift(count)
          //     }

          //     return indexes.join('.')
          // },
          // getIndex: getHierarchicalIndexes,
          onUpdate(content) {
              setItems(buildHierarchicalToc(content));
              // setItems(content)
          },
          scrollParent: () => editor.view.dom,
      }),
      HardBreak.configure({
        keepMarks: true,
      }),
    CustomHeading,
      TableRow,
      TableHeader,
      TableCell,
      Highlight,
      Subscript,
      Superscript,
      TextStyle,
      Color,
      LineHeight,
      FontSize
    ],
    editorProps: {
      attributes: {
        class: 'editor',
      },

      handlePaste(view, event) {
        const text = event.clipboardData?.getData("text/plain");

        if (!text) return false;

        // rileva markdown
        const looksLikeMarkdown =
          /^#{1,6}\s/m.test(text) ||
          /\*\*/.test(text) ||
          /^-\s/m.test(text) ||
          /^>\s/m.test(text) ||
          /```/.test(text);

        if (!looksLikeMarkdown) {
          return false;
        }

        event.preventDefault();

        const html = marked.parse(text);

        editor.chain().focus().insertContent(html).run();

        return true;
      },
    },
    content: value ?? "",
    // onUpdate: ({ editor }) => {
    //   onChange(editor.getHTML());
    // },
    parseOptions: {
      preserveWhitespace: 'full',
    },
    // onUpdate: ({ editor }) => {
    //   isInternalUpdate.current = true;
    //   onChange(editor.getHTML());
    // },
    onUpdate: ({ editor }) => {
      isInternalUpdate.current = true;
      let html = editor.getHTML();
      html = html.replace(/<p><\/p>/g, '<p>&nbsp;</p>');
      html = html.replace(/<p>\s*<\/p>/g, '<p>&nbsp;</p>');
      onChange(html);
    },
    plugins: [HeadingIdPlugin],
    shouldRerenderOnTransaction: true,
  });

  useEffect(() => {
    if (!editor) return;
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    editor.commands.setContent(value ?? "", false);
  }, [value, editor]);

  useImperativeHandle(ref, () => ({
    insertImage: (url) => {
      editor?.chain().focus().setImage({ src: url }).run();
    },
  }));

  return (
    <Box
      className="kb-editor-wrap"
      sx={{ display: "flex", flexDirection: "column" }}
    >
        {/* <div className="sidebar">
            <div className="sidebar-options">
            <div className="label-large">Table of contents</div>
            <div className="table-of-contents">
                <MemorizedToC editor={editor} items={items} scrollRef={scrollRef}/>
            </div>
            </div>
        </div>
        <Box
            sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            overflow: "hidden",
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
            height: "500px",

            // Editor area
            "& .ProseMirror": {
                minHeight: minHeight,
                p: 2,
                outline: "none",
                fontSize: "0.9rem",
                lineHeight: 1.7,
                // overflowY: "auto",
                // height: "100%"
            },

            // Placeholder
            "& .ProseMirror p.is-empty:first-of-type::before": {
                content: '"Inizia a scrivere..."',
                color: "text.disabled",
                pointerEvents: "none",
                float: "left",
                height: 0,
            },

            // Headings
            "& .ProseMirror h1": {
                fontSize: "1.6rem",
                fontWeight: 700,
                mt: 2,
                mb: 1,
            },
            "& .ProseMirror h2": {
                fontSize: "1.3rem",
                fontWeight: 700,
                mt: 2,
                mb: 1,
            },
            "& .ProseMirror h3": {
                fontSize: "1.1rem",
                fontWeight: 600,
                mt: 1.5,
                mb: 0.5,
            },
            "& .ProseMirror h4": {
                fontSize: "1rem",
                fontWeight: 600,
                mt: 1,
                mb: 0.5,
            },

            // Paragrafi
            "& .ProseMirror p": { margin: "0.5rem 0" },

            // Blockquote
            "& .ProseMirror blockquote": {
                borderLeft: "4px solid",
                borderColor: "primary.main",
                pl: 2,
                ml: 0,
                color: "text.secondary",
                fontStyle: "italic",
            },

            // Code
            "& .ProseMirror code": {
                bgcolor: "grey.100",
                borderRadius: "4px",
                px: 0.75,
                py: 0.25,
                fontFamily: "monospace",
                fontSize: "0.85em",
            },
            "& .ProseMirror pre": {
                bgcolor: "grey.900",
                color: "grey.100",
                borderRadius: 1,
                p: 2,
                overflow: "auto",
                fontFamily: "monospace",
                fontSize: "0.85rem",
            },

            // Immagini
            "& .ProseMirror img": {
                maxWidth: "100%",
                height: "auto",
                display: "block",
                my: 1,
            },

            // Tabelle
            "& .ProseMirror table": {
                width: "100%",
                borderCollapse: "collapse",
                my: 1.5,
                fontSize: "0.9rem",
            },
            "& .ProseMirror td, & .ProseMirror th": {
                border: "1px solid",
                borderColor: "divider",
                p: "6px 12px",
                minWidth: 60,
                verticalAlign: "top",
            },
            "& .ProseMirror th": {
                bgcolor: "grey.100",
                fontWeight: 600,
            },
            "& .ProseMirror .selectedCell": {
                bgcolor: "primary.50",
            },

            // HR
            "& .ProseMirror hr": {
                border: "none",
                borderTop: "2px solid",
                borderColor: "divider",
                my: 2,
            },

            // Liste numerate gerarchiche
            "& .ProseMirror ol": {
                counterReset: "level1",
                listStyle: "none",
                paddingLeft: 0,
                margin: "0.5rem 0",
            },
            "& .ProseMirror ol > li": {
                counterIncrement: "level1",
                counterReset: "level2",
                position: "relative",
                paddingLeft: "2.5rem",
                marginBottom: "0.25rem",
            },
            "& .ProseMirror ol > li::before": {
                content: 'counter(level1) ". "',
                position: "absolute",
                left: 0,
                fontWeight: 600,
                minWidth: "2rem",
            },
            "& .ProseMirror ol > li > ol": {
                counterReset: "level2",
                marginTop: "0.25rem",
            },
            "& .ProseMirror ol > li > ol > li": {
                counterIncrement: "level2",
                counterReset: "level3",
                paddingLeft: "2.5rem",
            },
            "& .ProseMirror ol > li > ol > li::before": {
                content: 'counter(level1) "." counter(level2) " "',
                fontWeight: 500,
            },
            "& .ProseMirror ol > li > ol > li > ol > li": {
                counterIncrement: "level3",
                paddingLeft: "2.5rem",
            },
            "& .ProseMirror ol > li > ol > li > ol > li::before": {
                content:
                'counter(level1) "." counter(level2) "." counter(level3) " "',
                fontWeight: 400,
            },

            // Liste puntate
            "& .ProseMirror ul": {
                paddingLeft: "1.5rem",
                margin: "0.5rem 0",
            },
            "& .ProseMirror ul li": {
                marginBottom: "0.25rem",
            },

            // Highlight
            "& .ProseMirror mark": {
                bgcolor: "#fece2f",
                borderRadius: "2px",
                px: 0.25,
            },

            // Link
            "& .ProseMirror a": {
                color: "primary.main",
                textDecoration: "underline",
                cursor: "pointer",
            },

            // Contatori per headings gerarchici
            // "& .ProseMirror": {
            // counterReset: "h1counter",
            // },
            // "& .ProseMirror h1": {
            // counterReset    : "h2counter",
            // counterIncrement: "h1counter",
            // },
            // "& .ProseMirror h1::before": {
            // content: 'counter(h1counter) ". "',
            // },
            // "& .ProseMirror h2": {
            // counterReset    : "h3counter",
            // counterIncrement: "h2counter",
            // },
            // "& .ProseMirror h2::before": {
            // content: 'counter(h1counter) "." counter(h2counter) " "',
            // },
            // "& .ProseMirror h3": {
            // counterReset    : "h4counter",
            // counterIncrement: "h3counter",
            // },
            // "& .ProseMirror h3::before": {
            // content: 'counter(h1counter) "." counter(h2counter) "." counter(h3counter) " "',
            // },
            // "& .ProseMirror h4": {
            // counterIncrement: "h4counter",
            // },
            // "& .ProseMirror h4::before": {
            // content: 'counter(h1counter) "." counter(h2counter) "." counter(h3counter) "." counter(h4counter) " "',
            // },
            }}
        >
            <Toolbar editor={editor} onImageUpload={onImageUpload} />
            <Box
            ref={scrollRef}
    sx={{
        flex: 1,
        overflowY: "auto", // 🔥 SCROLL QUI
    }}
    >
            
            <EditorContent editor={editor} />
    </Box>

        </Box> */}

        <div className="col-group">
            <div className="main">
                <Box
                    sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    overflow: "hidden",
                    bgcolor: "background.paper",
                    display: "flex",
                    flexDirection: "column",
                    height: "70vh",

                    // Editor area
                    "& .ProseMirror": {
                        minHeight: minHeight,
                        p: 2,
                        outline: "none",
                        fontSize: "1rem",
                        lineHeight: 1.7,
                        // overflowY: "auto",
                        // height: "100%"
                    },

                    // Placeholder
                    "& .ProseMirror p.is-empty:first-of-type::before": {
                        content: '"Inizia a scrivere..."',
                        color: "text.disabled",
                        pointerEvents: "none",
                        float: "left",
                        height: 0,
                    },

                    // Headings
                    "& .ProseMirror h1": {
                        // fontSize: "1.6rem",
                        // fontWeight: 700,
                        // mt: 0,
                        // mb: 1,
                      fontSize: '1.825rem',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      margin: "1.5rem 0 1rem"
                    },
                    "& .ProseMirror h2": {
                        // fontSize: "1.3rem",
                        // fontWeight: 700,
                        // mt: 0,
                        // mb: 1,
                      fontSize: '1.375rem',
                      fontWeight: 600,
                      lineHeight: 1.3,
                      margin: '1.25rem 0 0.75rem'
                    },
                    "& .ProseMirror h3": {
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        mt: 0,
                        mb: 0.5,
                    },
                    "& .ProseMirror h4": {
                        // fontSize: "1rem",
                        // fontWeight: 600,
                        // mt: 0,
                        // mb: 0.5,
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        lineHeight: 1.4,
                        margin: '1rem 0 0.5rem'
                    },

                    // Paragrafi
                    "& .ProseMirror p": { margin: "5px" },

                    // Blockquote
                    "& .ProseMirror blockquote": {
                        borderLeft: "4px solid",
                        borderColor: "primary.main",
                        pl: 2,
                        ml: 0,
                        color: "text.secondary",
                        fontStyle: "italic",
                    },

                    // Code
                    "& .ProseMirror code": {
                        bgcolor: "grey.100",
                        borderRadius: "4px",
                        px: 0.75,
                        py: 0.25,
                        fontFamily: "monospace",
                        fontSize: "0.85em",
                    },
                    "& .ProseMirror pre": {
                        bgcolor: "grey.900",
                        color: "grey.100",
                        borderRadius: 1,
                        p: 2,
                        overflow: "auto",
                        fontFamily: "monospace",
                        fontSize: "0.85rem",
                    },

                    // Immagini
                    "& .ProseMirror img": {
                        maxWidth: "100%",
                        height: "auto",
                        display: "block",
                        my: 1,
                    },

                    // Tabelle
                    "& .ProseMirror table": {
                        width: "100%",
                        borderCollapse: "collapse",
                        my: 1.5,
                        fontSize: "0.9rem",
                    },
                    "& .ProseMirror td, & .ProseMirror th": {
                        border: "1px solid",
                        borderColor: "divider",
                        p: "6px 12px",
                        minWidth: 60,
                        verticalAlign: "top",
                    },
                    "& .ProseMirror td p, & .ProseMirror th p": {
                      margin: 0,
                    },
                    "& .ProseMirror th": {
                        bgcolor: "grey.100",
                        fontWeight: 600,
                    },
                    "& .ProseMirror .selectedCell": {
                        bgcolor: "primary.50",
                    },

                    // HR
                    "& .ProseMirror hr": {
                        border: "none",
                        borderTop: "2px solid",
                        borderColor: "divider",
                        my: 2,
                    },

                    // // Liste numerate gerarchiche
                    "& .ProseMirror ol": {
                      margin: 0
                    },
                    "& .ProseMirror ul": {
                      margin: 0
                    },
                    // "& .ProseMirror ol": {
                    //     counterReset: "level1",
                    //     listStyle: "none",
                    //     paddingLeft: 0,
                    //     margin: "0.5rem 0",
                    // },
                    // "& .ProseMirror ol > li": {
                    //     counterIncrement: "level1",
                    //     counterReset: "level2",
                    //     position: "relative",
                    //     paddingLeft: "2.5rem",
                    //     marginBottom: "0.25rem",
                    // },
                    // "& .ProseMirror ol > li::before": {
                    //     content: 'counter(level1) ". "',
                    //     position: "absolute",
                    //     left: 0,
                    //     fontWeight: 600,
                    //     minWidth: "2rem",
                    // },
                    // "& .ProseMirror ol > li > ol": {
                    //     counterReset: "level2",
                    //     marginTop: "0.25rem",
                    // },
                    // "& .ProseMirror ol > li > ol > li": {
                    //     counterIncrement: "level2",
                    //     counterReset: "level3",
                    //     paddingLeft: "2.5rem",
                    // },
                    // "& .ProseMirror ol > li > ol > li::before": {
                    //     content: 'counter(level1) "." counter(level2) " "',
                    //     fontWeight: 500,
                    // },
                    // "& .ProseMirror ol > li > ol > li > ol > li": {
                    //     counterIncrement: "level3",
                    //     paddingLeft: "2.5rem",
                    // },
                    // "& .ProseMirror ol > li > ol > li > ol > li::before": {
                    //     content:
                    //     'counter(level1) "." counter(level2) "." counter(level3) " "',
                    //     fontWeight: 400,
                    // },

                    // // Liste puntate
                    // "& .ProseMirror ul": {
                    //     paddingLeft: "1.5rem",
                    //     margin: "0",
                    // },
                    // // "& .ProseMirror ul li": {
                    // //     marginBottom: "0.25rem",
                    // // },

                    // Highlight
                    "& .ProseMirror mark": {
                        bgcolor: "#fece2f",
                        borderRadius: "2px",
                        px: 0.25,
                    },

                    // Link
                    "& .ProseMirror a": {
                        color: "primary.main",
                        textDecoration: "underline",
                        cursor: "pointer",
                    },
                    }}
                >
                    <Toolbar editor={editor} onImageUpload={onImageUpload} scrollRef={scrollRef} />
                    <Box
                        ref={scrollRef}
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                        }}
                    >
                    <EditorContent editor={editor} />
                </Box>

                </Box>
            </div>
            {
                summaryEnabled &&
                <div className="sidebar">
                    <div className="sidebar-options">
                        <div className="label-large"><b>Indice</b></div>
                        <div className="table-of-contents">
                            <MemorizedToC editor={editor} items={items} scrollRef={scrollRef}/>
                        </div>
                    </div>
                </div>
            }
        </div>
    </Box>
  );
});
export default KbEditor;
