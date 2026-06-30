import React, { useState, useEffect } from "react";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// Plugin key (IMPORTANT per aggiornamenti corretti)
const searchPluginKey = new PluginKey("searchPlugin");

// --- Search Plugin ---
const createSearchPlugin = () => {
  return new Plugin({
    key: searchPluginKey,

    state: {
      init() {
        return { decorations: DecorationSet.empty, term: "", activeIndex: 0 };
      },

      apply(tr, prev) {
        const meta = tr.getMeta(searchPluginKey);
        if (!meta) return prev;

        const { term, activeIndex } = meta;
        const decorations = [];

        if (!term) {
          return { decorations: DecorationSet.empty, term: "", activeIndex: 0 };
        }

        let matchIndex = 0;

        tr.doc.descendants((node, pos) => {
          if (!node.isText) return;

          const text = node.text.toLowerCase();
          const search = term.toLowerCase();

          let index = text.indexOf(search);

          while (index !== -1) {
            const isActive = matchIndex === activeIndex;

            decorations.push(
              Decoration.inline(
                pos + index,
                pos + index + search.length,
                {
                  class: isActive
                    ? "search-highlight-active"
                    : "search-highlight",
                }
              )
            );

            matchIndex++;
            index = text.indexOf(search, index + 1);
          }
        });

        return {
          decorations: DecorationSet.create(tr.doc, decorations),
          term,
          activeIndex,
        };
      },
    },

    props: {
      decorations(state) {
        return this.getState(state).decorations;
      },
    },
  });
};

// --- Search Bar Component ---
export default function EditoSearchBar({ editor, scrollRef }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Init plugin UNA VOLTA
  useEffect(() => {
    if (!editor) return;

    const plugin = createSearchPlugin();
    editor.registerPlugin(plugin);

    return () => editor.unregisterPlugin(plugin);
  }, [editor]);

  // 🔥 AUTO SEARCH mentre scrivi (NO bottone)
  useEffect(() => {
    if (!editor) return;

    if (!searchTerm) {
      setResults([]);
      editor.view.dispatch(
        editor.state.tr.setMeta(searchPluginKey, {
          term: "",
          activeIndex: 0,
        })
      );
      return;
    }

    const matches = [];
    const term = searchTerm.toLowerCase();

    editor.state.doc.descendants((node, pos) => {
      if (!node.isText) return;

      const text = node.text.toLowerCase();
      let index = text.indexOf(term);

      while (index !== -1) {
        matches.push({ from: pos + index, to: pos + index + term.length });
        index = text.indexOf(term, index + 1);
      }
    });

    setResults(matches);
    setActiveIndex(0);

    editor.view.dispatch(
      editor.state.tr.setMeta(searchPluginKey, {
        term: searchTerm,
        activeIndex: 0,
      })
    );
  }, [searchTerm, editor]);

  // 🔥 NAVIGAZIONE con SCROLL FIX
    const goTo = (index) => {
    if (!results[index] || !editor) return;

    setActiveIndex(index);

    const { from, to } = results[index];

    // selezione ProseMirror
    const tr = editor.state.tr.setSelection(
        editor.state.selection.constructor.create(
        editor.state.doc,
        from,
        to
        )
    );

    editor.view.dispatch(tr);

    // 🔥 SCROLL MANUALE NEL CONTAINER
    requestAnimationFrame(() => {
        const dom = editor.view.domAtPos(from)?.node;

        if (!dom || !scrollRef?.current) return;

        const element = dom.nodeType === 3 ? dom.parentElement : dom;

        element?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        });
    });

    // aggiorna highlight attivo
    editor.view.dispatch(
        editor.state.tr.setMeta(searchPluginKey, {
        term: searchTerm,
        activeIndex: index,
        })
    );
    };

  const next = () => {
    if (!results.length) return;
    const nextIndex = (activeIndex + 1) % results.length;
    goTo(nextIndex);
  };

  const prev = () => {
    if (!results.length) return;
    const prevIndex = (activeIndex - 1 + results.length) % results.length;
    goTo(prevIndex);
  };

  return (
    <div className="search-bar">
      <input
        id='text-field-search-bar'
        type="text"
        placeholder="Cerca..."
        style={{fontSize: '0.8rem', padding: '4px 5px', borderRadius: '4px', borderColor: '#b2b2b2', borderWidth:'1px', borderStyle: 'solid', background: 'none'}}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === "Enter") {
            e.preventDefault();

            if (e.shiftKey) {
                prev();   // Shift + Enter → indietro
            } else {
                next();   // Enter → avanti
            }
            }
        }}
      />

      <span style={{fontSize: '0.7rem'}}>
        {results.length > 0
          ? `${activeIndex + 1} / ${results.length}`
          : ""}
      </span>
      <IconButton onClick={prev} size="small" disabled={!results.length}>
        <ArrowUpwardIcon fontSize="inherit"/>
      </IconButton>
      <IconButton onClick={next} size="small" disabled={!results.length}>
        <ArrowDownwardIcon fontSize="inherit"/>
      </IconButton>
    </div>
  );
}


