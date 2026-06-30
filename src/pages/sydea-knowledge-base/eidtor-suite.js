// import { Color } from "@tiptap/extension-color";
// import "./editor-suite.scss";
// import ListItem from "@tiptap/extension-list-item";
// import TextStyle from "@tiptap/extension-text-style";
// import { EditorProvider, useCurrentEditor, BubbleMenu, FloatingMenu } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import React from "react";
// import CharacterCount from "@tiptap/extension-character-count";
// import Document from "@tiptap/extension-document";
// import Paragraph from "@tiptap/extension-paragraph";
// import Text from "@tiptap/extension-text";
// import Bold from "@tiptap/extension-bold";
// import { Box, Button, Chip, IconButton, Menu, MenuItem } from "@mui/material";
// import Divider, { dividerClasses } from '@mui/material/Divider';
// import parse from "html-react-parser";
// import FormatBoldIcon from '@mui/icons-material/FormatBold';
// import FormatItalicIcon from '@mui/icons-material/FormatItalic';
// import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
// import CodeIcon from '@mui/icons-material/Code';
// import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
// import ClearAllIcon from '@mui/icons-material/ClearAll';
// import TitleIcon from '@mui/icons-material/Title';
// import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
// import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
// import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
// import UndoIcon from '@mui/icons-material/Undo';
// import RedoIcon from '@mui/icons-material/Redo';
// import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
// import Highlight from '@tiptap/extension-highlight'
// import TextAlign from '@tiptap/extension-text-align'
// import HighlightIcon from '@mui/icons-material/Highlight';
// import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
// import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
// import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
// import Table from '@tiptap/extension-table';
// import TableCell from '@tiptap/extension-table-cell';
// import TableHeader from '@tiptap/extension-table-header';
// import TableRow from '@tiptap/extension-table-row';
// import Underline from '@tiptap/extension-underline';
// import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
// import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
// import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
// import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';
// import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

// const limit = 20000;

// const CustomTableCell = TableCell.extend({
//   addAttributes() {
//     return {
//       // extend the existing attributes …
//       ...this.parent?.(),

//       // and add a new one …
//       backgroundColor: {
//         default: null,
//         parseHTML: element => element.getAttribute('data-background-color'),
//         renderHTML: attributes => {
//           return {
//             'data-background-color': attributes.backgroundColor,
//             style: `background-color: ${attributes.backgroundColor}`,
//           }
//         },
//       },
//     }
//   },
// })

// export const tableHTML = `
//   <table style="width:100%">
//     <tr>
//       <th>Firstname</th>
//       <th>Lastname</th>
//       <th>Age</th>
//     </tr>
//     <tr>
//       <td>Jill</td>
//       <td>Smith</td>
//       <td>50</td>
//     </tr>
//     <tr>
//       <td>Eve</td>
//       <td>Jackson</td>
//       <td>94</td>
//     </tr>
//     <tr>
//       <td>John</td>
//       <td>Doe</td>
//       <td>80</td>
//     </tr>
//   </table>
// `

// const MenuBar = () => {
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const open = Boolean(anchorEl);
//   const { editor } = useCurrentEditor();

  
//   const ITEM_HEIGHT = 48;
//   const options = [
//     { label: 'Normal', html: <p style={{margin: 0}}>Normal</p>, action: () => editor.chain().focus().setParagraph().run(), isActive: editor.isActive("paragraph") },
//     { label: 'Headline 1', html: <h1 style={{margin: 0}}>Headline 1</h1>, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: editor.isActive("heading", { level: 1 }) },
//     { label: 'Headline 2', html: <h2 style={{margin: 0}}>Headline 2</h2>, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: editor.isActive("heading", { level: 2 }) },
//     { label: 'Headline 3', html: <h3 style={{margin: 0}}>Headline 3</h3>, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: editor.isActive("heading", { level: 3 }) },
//     { label: 'Headline 4', html: <h4 style={{margin: 0}}>Headline 4</h4>, action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(), isActive: editor.isActive("heading", { level: 4 }) },
//     { label: 'Headline 5', html: <h5 style={{margin: 0}}>Headline 5</h5>, action: () => editor.chain().focus().toggleHeading({ level: 5 }).run(), isActive: editor.isActive("heading", { level: 5 }) },
//     { label: 'Headline 6', html: <h6 style={{margin: 0}}>Headline 6</h6>, action: () => editor.chain().focus().toggleHeading({ level: 6 }).run(), isActive: editor.isActive("heading", { level: 6 }) },
//   ];

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   if (!editor) {
//     return null;
//   }

//   return (
//     <div className="control-group">
//       <div className="button-group">
//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           border: '1px solid',
//           borderColor: 'divider',
//           borderRadius: 1,
//           bgcolor: 'background.paper',
//           color: 'text.secondary',
//           '& svg': {
//             m: 1,
//           },
//           [`& .${dividerClasses.root}`]: {
//             mx: 0.5,
//           },
//         }}
//       >
//         <IconButton size="small"
//           onClick={() => editor.chain().focus().toggleBold().run()}
//           disabled={!editor.can().chain().focus().toggleBold().run()}
//           className={editor.isActive("bold") ? "is-active" : ""}
//         >
//           <FormatBoldIcon fontSize="inherit"/>
//         </IconButton>
//         <IconButton size="small"
//           onClick={() => editor.chain().focus().toggleItalic().run()}
//           disabled={!editor.can().chain().focus().toggleItalic().run()}
//           className={editor.isActive("italic") ? "is-active" : ""}
//         >
//           <FormatItalicIcon fontSize="inherit"/>
//         </IconButton>
//         <IconButton size="small"
//           onClick={() => editor.chain().focus().toggleUnderline().run()}
//           disabled={!editor.can().chain().focus().toggleUnderline().run()}
//           className={editor.isActive("underline") ? "is-active" : ""}
//         >
//           <FormatUnderlinedIcon fontSize="inherit"/>
//         </IconButton>
//         <IconButton size="small"
//           onClick={() => editor.chain().focus().toggleStrike().run()}
//           disabled={!editor.can().chain().focus().toggleStrike().run()}
//           className={editor.isActive("strike") ? "is-active" : ""}
//         >
//           <StrikethroughSIcon fontSize="inherit"/>
//         </IconButton>

//         <Divider orientation="vertical" flexItem />

//         <IconButton size="small" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}>
//           <FormatAlignLeftIcon fontSize="inherit"/>
//         </IconButton>
//         <IconButton size="small" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}>
//           <FormatAlignCenterIcon fontSize="inherit"/>
//         </IconButton>
//         <IconButton size="small" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}>
//           <FormatAlignRightIcon fontSize="inherit"/>
//         </IconButton>
//         <IconButton size="small" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}>
//           <FormatAlignJustifyIcon fontSize="inherit"/>
//         </IconButton>

//         <Divider orientation="vertical" flexItem />

//         <IconButton size="small"
//           onClick={() => editor.chain().focus().toggleBulletList().run()}
//           className={editor.isActive("bulletList") ? "is-active" : ""}
//         >
//           <FormatListBulletedIcon fontSize="inherit"/>
//         </IconButton>
//         <IconButton size="small"
//           onClick={() => editor.chain().focus().toggleOrderedList().run()}
//           className={editor.isActive("orderedList") ? "is-active" : ""}
//         >
//           <FormatListNumberedIcon fontSize="inherit"/>
//         </IconButton>
//         <IconButton size="small"
//           onClick={() => editor.chain().focus().toggleBlockquote().run()}
//           className={editor.isActive("blockquote") ? "is-active" : ""}
//         >
//           <FormatQuoteIcon fontSize="inherit"/>
//         </IconButton>

//         <Divider orientation="vertical" flexItem />

//         <div>
//           <IconButton
//             aria-label="more"
//             id="long-button"
//             aria-controls={open ? 'long-menu' : undefined}
//             aria-expanded={open ? 'true' : undefined}
//             aria-haspopup="true"
//             onClick={handleClick}
//             size="small"
//           >
//             <TitleIcon fontSize="inherit"/>
//             <ArrowDropDownIcon fontSize="inherit"/>
//           </IconButton>
//             <Menu
//               id="long-menu"
//               anchorEl={anchorEl}
//               open={open}
//               onClose={handleClose}
//               // slotProps={{
//               //   paper: {
//               //     style: {
//               //       maxHeight: ITEM_HEIGHT * 4.5,
//               //       width: '20ch',
//               //     },
//               //   },
//               //   list: {
//               //     'aria-labelledby': 'long-button',
//               //   },
//               // }}
//             >
//               {options.map((option) => (
//                 <MenuItem
//                   key={option.label}
//                   selected={option.isActive}
//                   onClick={() => {
//                     option.action();
//                     handleClose();
//                   }}
//                 >
//                   {option.html}
//                 </MenuItem>
//               ))}
//             </Menu>
//         </div>
        
//         <Divider orientation="vertical" flexItem />

//         <IconButton size="small"
//           onClick={() => editor.chain().focus().toggleCode().run()}
//           disabled={!editor.can().chain().focus().toggleCode().run()}
//           className={editor.isActive("code") ? "is-active" : ""}
//         >
//           <CodeIcon fontSize="inherit"/>
//         </IconButton>
//         <IconButton size="small"
//           onClick={() => editor.chain().focus().toggleCodeBlock().run()}
//           className={editor.isActive("codeBlock") ? "is-active" : ""}
//         >
//           <DeveloperModeIcon fontSize="inherit"/>
//           {/* code block */}
//         </IconButton>

//          <Divider orientation="vertical" flexItem />

//         <IconButton size="small" onClick={() => editor.chain().focus().unsetAllMarks().run()}>
//           <CleaningServicesIcon fontSize="inherit"/>
//         </IconButton>
//         <IconButton size="small" onClick={() => editor.chain().focus().clearNodes().run()}>
//           <ClearAllIcon fontSize="inherit"/>
//           {/* Clear nodes */}
//         </IconButton>

//          <Divider orientation="vertical" flexItem />

//         <IconButton size="small"
//           onClick={() => editor.chain().focus().undo().run()}
//           disabled={!editor.can().chain().focus().undo().run()}
//         >
//           <UndoIcon fontSize="inherit"/>
//         </IconButton>
//         <IconButton size="small"
//           onClick={() => editor.chain().focus().redo().run()}
//           disabled={!editor.can().chain().focus().redo().run()}
//         >
//           <RedoIcon fontSize="inherit"/>
//         </IconButton>

//          <Divider orientation="vertical" flexItem />

//         <IconButton size="small" onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'is-active' : ''}>
//           <DriveFileRenameOutlineIcon fontSize="inherit"/>
//         </IconButton>

//         <IconButton size="small" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
//           <HorizontalRuleIcon fontSize="inherit"/>
//           {/* Horizontal rule */}
//         </IconButton>

//         <IconButton size="small" onClick={() => editor.chain().focus().setHardBreak().run()}>
//           <SubdirectoryArrowLeftIcon fontSize="inherit"/>
//           {/* Hard break */}
//         </IconButton>
        
//         <Divider orientation="vertical" flexItem />

//         <IconButton size="small" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
//           <TableChartOutlinedIcon fontSize="inherit"/>
//           {/* Insert table */}
//         </IconButton>

//         <IconButton size="small" onClick={() => editor.chain().focus().insertContent(tableHTML, {parseOptions: {preserveWhitespace: false,},}).run()}>
//           <TableChartOutlinedIcon fontSize="inherit"/>
//           {/* Insert HTML table */}
//         </IconButton>

//       </Box>

//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           border: '1px solid',
//           borderColor: 'divider',
//           borderRadius: 1,
//           bgcolor: 'background.paper',
//           color: 'text.secondary',
//           '& svg': {
//             m: 1,
//           },
//           [`& .${dividerClasses.root}`]: {
//             mx: 0.5,
//           },
//         }}
//       >
//         {editor.isActive("table") && (
//           <>
//           <div>
//             <Chip label="Add column before" variant="outlined" size="small" onClick={() => editor.chain().focus().addColumnBefore().run()} disabled={!editor.can().addColumnBefore()}/>
//             <Chip label="Add column after" variant="outlined" size="small" onClick={() => editor.chain().focus().addColumnAfter().run()} disabled={!editor.can().addColumnAfter()}/>
//             <Chip label="Delete column" variant="outlined" size="small" onClick={() => editor.chain().focus().deleteColumn().run()} disabled={!editor.can().deleteColumn()}/>
//             <Chip label="Add row before" variant="outlined" size="small" onClick={() => editor.chain().focus().addRowBefore().run()} disabled={!editor.can().addRowBefore()}/>
//             <Chip label="Add row after" variant="outlined" size="small" onClick={() => editor.chain().focus().addRowAfter().run()} disabled={!editor.can().addRowAfter()}/>
//             <Chip label="Delete row" variant="outlined" size="small" onClick={() => editor.chain().focus().deleteRow().run()} disabled={!editor.can().deleteRow()}/>
//             <Chip label="Delete table" variant="outlined" size="small" onClick={() => editor.chain().focus().deleteTable().run()} disabled={!editor.can().deleteTable()}/>
//           </div>
//           <Divider orientation="vertical" flexItem />
//           <div>
//             <Chip label="Merge cells" variant="outlined" size="small" onClick={() => editor.chain().focus().mergeCells().run()} disabled={!editor.can().mergeCells()}/>
//             <Chip label="Split cell" variant="outlined" size="small" onClick={() => editor.chain().focus().splitCell().run()} disabled={!editor.can().splitCell()}/>
//           </div>
//           <Divider orientation="vertical" flexItem />
//           <div>
//             <Chip label="ToggleHeaderColumn" variant="outlined" size="small" onClick={() => editor.chain().focus().toggleHeaderColumn().run()} disabled={!editor.can().toggleHeaderColumn()}/>
//             <Chip label="Toggle header row" variant="outlined" size="small" onClick={() => editor.chain().focus().toggleHeaderRow().run()} disabled={!editor.can().toggleHeaderRow()}/>
//             <Chip label="Toggle header cell" variant="outlined" size="small" onClick={() => editor.chain().focus().toggleHeaderCell().run()} disabled={!editor.can().toggleHeaderCell()}/>
//             {/* <Chip label="Merge or split" variant="outlined" size="small" onClick={() => editor.chain().focus().mergeOrSplit().run()} disabled={!editor.can().mergeOrSplit()}/> */}
//             <Chip label="Set cell attribute" variant="outlined" size="small" onClick={() => editor.chain().focus().setCellAttribute('backgroundColor', '#FAF594').run()} disabled={!editor.can().setCellAttribute('backgroundColor', '#FAF594')}/>
//             <Chip label="Fix tables" variant="outlined" size="small" onClick={() => editor.chain().focus().fixTables().run()} disabled={!editor.can().fixTables()}/>
//             {/* <Chip label="Go to next cell" variant="outlined" size="small" onClick={() => editor.chain().focus().goToNextCell().run()} disabled={!editor.can().goToNextCell()}/>
//             <Chip label="Go to previous cell" variant="outlined" size="small" onClick={() => editor.chain().focus().goToPreviousCell().run()} disabled={!editor.can().goToPreviousCell()}/> */}
//           </div>
//           </>
//         )}


//       </Box>
        




      



// {/* 
//         <button
//           onClick={() => editor.chain().focus().setColor("#958DF1").run()}
//           className={
//             editor.isActive("textStyle", { color: "#958DF1" })
//               ? "is-active"
//               : ""
//           }
//         >
//           Purple
//         </button> */}

//         <div className="button-group">
          


//         {/* <button onClick={() => editor.chain().focus().addColumnBefore().run()} disabled={!editor.can().addColumnBefore()}>
//           Add column before
//         </button>
//         <button onClick={() => editor.chain().focus().addColumnAfter().run()} disabled={!editor.can().addColumnAfter()}>
//           Add column after
//         </button>
//         <button onClick={() => editor.chain().focus().deleteColumn().run()} disabled={!editor.can().deleteColumn()}>
//           Delete column
//         </button>
//         <button onClick={() => editor.chain().focus().addRowBefore().run()} disabled={!editor.can().addRowBefore()}>
//           Add row before
//         </button>
//         <button onClick={() => editor.chain().focus().addRowAfter().run()} disabled={!editor.can().addRowAfter()}>
//           Add row after
//         </button>
//         <button onClick={() => editor.chain().focus().deleteRow().run()} disabled={!editor.can().deleteRow()}>
//           Delete row
//         </button>
//         <button onClick={() => editor.chain().focus().deleteTable().run()} disabled={!editor.can().deleteTable()}>
//           Delete table
//         </button>
//         <button onClick={() => editor.chain().focus().mergeCells().run()} disabled={!editor.can().mergeCells()}>
//           Merge cells
//         </button>
//         <button onClick={() => editor.chain().focus().splitCell().run()} disabled={!editor.can().splitCell()}>
//           Split cell
//         </button>
//         <button onClick={() => editor.chain().focus().toggleHeaderColumn().run()} disabled={!editor.can().toggleHeaderColumn()}>
//           ToggleHeaderColumn
//         </button>
//         <button onClick={() => editor.chain().focus().toggleHeaderRow().run()} disabled={!editor.can().toggleHeaderRow()}>
//           Toggle header row
//         </button>
//         <button onClick={() => editor.chain().focus().toggleHeaderCell().run()} disabled={!editor.can().toggleHeaderCell()}>
//           Toggle header cell
//         </button>
//         <button onClick={() => editor.chain().focus().mergeOrSplit().run()} disabled={!editor.can().mergeOrSplit()}>
//           Merge or split
//         </button>
//         <button onClick={() => editor.chain().focus().setCellAttribute('backgroundColor', '#FAF594').run()} disabled={!editor.can().setCellAttribute('backgroundColor', '#FAF594')}>
//           Set cell attribute
//         </button>
//         <button onClick={() => editor.chain().focus().fixTables().run()} disabled={!editor.can().fixTables()}>
//           Fix tables
//         </button>
//         <button onClick={() => editor.chain().focus().goToNextCell().run()} disabled={!editor.can().goToNextCell()}>
//           Go to next cell
//         </button>
//         <button onClick={() => editor.chain().focus().goToPreviousCell().run()} disabled={!editor.can().goToPreviousCell()}>
//           Go to previous cell
//         </button> */}
//       </div>
//       </div>
//     </div>
//   );
// };

// const content1 = `
// <h2>
//   Hi there,
// </h2>
// <p>
//   this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
// </p>
// <ul>
//   <li>
//     That’s a bullet list with one …
//   </li>
//   <li>
//     … or two list items.
//   </li>
// </ul>
// <p>
//   Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
// </p>
// <pre><code class="language-css">body {
//   display: none;
// }</code></pre>
// <p>
//   I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
// </p>
// <blockquote>
//   Wow, that’s amazing. Good work, boy! 👏
//   <br />
//   — Mom
// </blockquote>
// `;

// const content = "<div class='wrapper-know-base'><div class='section-know-base'>Overview [ICONA-BACK-TO-TOP]<div class='body-section'><p>Lo scopo di questo documento è di spiegare la procedura di gestione di pianificazione delle risorse, utilizzando lo strumento di pianificazione di Odoo. </p></div></div><div class='section-know-base'><span>Regolamento [ICONA-BACK-TO-TOP]</span><div class='subsection-know-base'>Definizioni [ICONA-BACK-TO-TOP]<div class='body-section'><ul><li><b>Idle/tempo non allocato</b>: tempo lavorativo non utilizzato per alcuna attività/tempo di inattività. </li><li><b>Progetto</b>: commessa operativa composta da un team di risorse che svolgono un insieme di task/attività predefiniti che può generare costi e ricavi per l’azienda. È coordinato da un PM. </li><li><b>Pianificazione/allocazione:</b> atto di attribuire una risorsa a uno specifico progetto per un determinato lasso temporale </li><li><b>Risorse</b>: insieme della forza lavoro dell’azienda (tutti i dipendenti della stessa). </li></ul></div></div><div class='subsection-know-base'>Figure professionali in ambito [ICONA-BACK-TO-TOP]<div class='body-section'><ul><li><b>PM (<i>Project Manager</i>)</b>: gestisce e detiene la responsabilità del progetto. </li><li><b>PO (<i>Project Owner</i>) o Team Leader</b>: gestisce e detiene parte delle attività di un progetto subordinato al PM dello stesso progetto. </li><li><b>Responsabile della Pianificazione:</b> gestisce e detiene la responsabilità rispetto all’allocazione delle risorse. </li><li><b>Risorse</b></li></ul></div></div><div class='subsection-know-base'>Regolamento Generale [ICONA-BACK-TO-TOP]<div class='body-section'><ul style='list-style: decimal'><li>La pianificazione è <b>obbligatoria per tutte le attività che coinvolgono le risorse dell’azienda</b>. </li><li>Il PM, oppure il PO/Team Leader se delegati, è responsabile dell’invio delle richieste di pianificazione. </li><li>La pianificazione è soggetta a un iter che prevede una richiesta fatta dal PM/PO e da una successiva approvazione eseguita dal Responsabile della Pianificazione. </li><li>Le richieste sono effettuate a <b>cadenza settimanale</b>.<br />È possibile inserire richieste per periodi più estesi, tenendo presente che l’approvazione sarà sempre settimanale, salvo casi eccezionali che potranno essere approvati con anticipo superiore a una settimana. </li><li>L’inserimento della richiesta di pianificazione per la settimana successiva deve essere effettuato entro il giovedì della settimana in corso. </li><li>L’approvazione delle richieste per una determinata settimana deve essere effettuata entro il venerdì della settimana precedente. </li><li>È possibile richiedere l’approvazione anticipata a seguito di una motivazione; il responsabile della pianificazione valuterà la fattibilità dell’assegnazione. </li><li>La pianificazione deve essere <b>realistica</b> e <b>puntuale</b>, evitando sovrapposizioni o ambiguità. <ul><li>Nel caso in cui la pianificazione di una risorsa non ricopra l’intera giornata lavorativa, il PM è tenuto ad indicare con precisione la fascia oraria in cui intende allocare la risorsa. Questo è particolarmente importante considerando che, alla data di stesura del presente documento, i team hanno una dimensione contenuta e una complessità di gestione limitata, rendendo quindi possibile una pianificazione dettagliata. </li></ul></li><li>È consentito effettuare modifiche alla pianificazione purché le richieste non siano già approvate. </li></ul></div></div><div class='subsection-know-base'>Casistiche particolari [ICONA-BACK-TO-TOP]<div class='subsubsection-know-base'>Persone non allocate [ICONA-BACK-TO-TOP]<p class='normal-text-know-base'>La pianificazione può subire la deroga dell’approvazione settimanale nel caso la persona non sia allocata su alcuna attività. Il PM avvia la procedura standard di pianificazione della risorsa e parallelamente contatta, tramite i canali aziendali, il Responsabile della Pianificazione che approverà la richiesta più o meno tempestivamente in base all’urgenza/priorità/necessità progettuali. </p></div><div class='subsubsection-know-base'>Ore di Straordinario o Reperibilità [ICONA-BACK-TO-TOP]<p class='normal-text-know-base'>Lo straordinario pianificabile o le ore di reperibilità devono essere richiesti allo stesso modo delle ore standard. Sarà cura del PM indicare correttamente la fascia oraria di allocazione della risorsa. </p></div><div class='subsubsection-know-base'>Modifiche in deroga [ICONA-BACK-TO-TOP]<p class='normal-text-know-base'>Il PM comunica (tramite i canali aziendali) una richiesta di modifica al Responsabile della Pianificazione che verrà valutata più o meno tempestivamente in base all’urgenza/priorità/necessità progettuali. La verifica consiste nella valutazione di eventuali sovrapposizioni, cercando di mediare con i PM o clienti al fine si risolverle per ottenere il massimo beneficio. </p><p class='normal-text-know-base'>Sono considerate modifiche in deroga tutte le richieste già approvate che ricadono in una delle seguenti casistiche: </p><ul class='normal-text-know-base'><li><b>Richieste già approvate che subiscono dei cambiamenti improvvisi</b></li><li><b>Annullamento o riduzione di allocazione</b></li><li><b>Assenze impreviste del personale</b>: il Responsabile della Pianificazione viene informato dall’ufficio HR o, se del caso, dal team leader di riferimento. Successivamente, si confronta con il Project Manager per valutare l’eventuale riallocazione della risorsa. Il Responsabile della Pianificazione ha inoltre il compito di verificare se sia necessario informare il cliente finale destinatario della commessa. </li><li><b>Incremento di allocazione</b>: qualora il PM identifichi un fabbisogno maggiore rispetto a quanto pianificato, comunica al Responsabile della Pianificazione l’esigenza di incremento che verrà presa in carico più o meno tempestivamente in base all’urgenza/priorità/necessità progettuali. </li></ul></div></div></div><div class='section-know-base'><span>Panoramica Planning Odoo [ICONA-BACK-TO-TOP]</span><div style='padding: 1rem'><a href='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-home-odoo.webp' target='blank' ><figure style='margin: 0'><img src='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-home-odoo.webp' style='width: 100%; border-radius: 0.3rem; border: 1px solid currentColor' /><figcaption style=' text-decoration: none; font-size: 0.6rem; text-align: center; margin-top: 0.5rem; font-weight: 600; '>Odoo modulo Planning, schermata principale </figcaption></figure></a ></div><div class='body-section'><p class='normal-text-know-base'>La schermata del modulo Planning di Odoo si presenta come un calendario riepilogativo del personale, con informazioni sull'allocazione delle risorse nei vari progetti. </p></div><div class='subsection-know-base'>Colonna dei dipendenti e barra di avanzamento [ICONA-BACK-TO-TOP]<div class='body-section'><p class='normal-text-know-base'>La prima colonna del calendario, contenente i nomi dei dipendenti, include una barra di avanzamento che rappresenta la <b>percentuale di pianificazione della risorsa nel periodo visualizzato</b> (giorno, settimana, mese o anno). La barra di avanzamento può assumere i seguenti colori: </p><ul><li><b>Verde</b>: indica la percentuale di ore pianificate rispetto alla disponibilità della risorsa. Una barra completamente verde rappresenta una pianificazione al 100%. <div style='padding-top: 0.5rem; padding-bottom: 0.5rem'><a href='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-user-bar.webp' target='blank' ><figure style='margin: 0'><img src='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-user-bar.webp' style=' width: 100%; border-radius: 0.3rem; border: 1px solid currentColor; ' /></figure ></a></div></li><li><b>Rossa</b>: indica un sovraccarico di pianificazione, ovvero quando la risorsa è assegnata a un numero di ore superiore alla sua disponibilità effettiva (considerando anche ferie o permessi già approvati). <div style='padding-top: 0.5rem; padding-bottom: 0.5rem'><a href='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-user-bar-red.webp' target='blank' ><figure style='margin: 0'><img src='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-user-bar-red.webp' style=' width: 100%; border-radius: 0.3rem; border: 1px solid currentColor; ' /></figure ></a></div></li><li><b>Bianca</b>: rappresenta la parte residua di disponibilità non ancora allocata.</li></ul><p class='normal-text-know-base'>Posizionando il cursore sulla barra, viene mostrato il rapporto delle ore pianificate rispetto alle ore disponibili. </p><div style='padding: 0.5rem 1rem'><a href='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-user-mouse-hover.webp' target='blank' ><figure style='margin: 0; text-align: center'><img src='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-user-mouse-hover.webp' style=' width: 60%; border-radius: 0.3rem; border: 1px solid currentColor; ' /></figure ></a></div></div></div><div class='subsection-know-base'>Griglia di pianificazione e orari non lavorativi [ICONA-BACK-TO-TOP]<div class='body-section'><p class='normal-text-know-base'>Nella griglia centrale, la pianificazione è suddivisa per giorni o fasce orarie, in base alla modalità di visualizzazione selezionata. Gli <b>slot non lavorativi sono indicati con un riquadro grigio</b>, che può indicare: </p><ul><li>Ferie approvate</li><li>Festività</li><li>Permessi orari (ROL, permessi, ecc.)</li></ul><p class='normal-text-know-base'>La visualizzazione degli slot non lavorativi varia in base al livello di dettaglio scelto: </p><ul><li><i>Vista mensile/settimanale</i>: viene mostrato un riquadro grigio per l’intera giornata, solo se la risorsa ha ferie a giornata intera. </li><li><i>Vista giornaliera</i>: i riquadri grigi evidenziano assenze parziali su specifiche fasce orarie (es. permessi orari o assenze parziali). </li></ul></div><div style='padding: 1rem'><a href='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-ferie-vista-mese-sett.webp' target='blank' ><figure style='margin: 0'><img src='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-ferie-vista-mese-sett.webp' style='width: 100%; border-radius: 0.3rem; border: 1px solid currentColor' /><figcaption style=' text-decoration: none; font-size: 0.6rem; text-align: center; margin-top: 0.5rem; font-weight: 600; '>Slot non lavorativi nelle viste mensile e settimanale </figcaption></figure></a ></div><p class='normal-text-know-base'>Quando una richiesta di ferie/permessi non è ancora stata approvata, viene visualizzata con un riquadro grigio scuro che presenta, nell’angolo in alto a sinistra, un triangolino giallo. All’interno del riquadro compare una dicitura del tipo: <code>-INT-Time Off 💬 - 9:00 AM - 6:00 PM (8h)</code>, che indica la tipologia di permesso, la durata complessiva e l’orario di inizio e fine. </p><p class='normal-text-know-base'>Una volta approvata, la richiesta viene aggiornata: il riquadro diventa grigio chiaro e la dicitura scompare. </p><div style='padding: 1rem'><a href='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-ferie-non-approvate.webp' target='blank' ><figure style='margin: 0'><img src='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-ferie-non-approvate.webp' style='width: 100%; border-radius: 0.3rem; border: 1px solid currentColor' /><figcaption style=' text-decoration: none; font-size: 0.6rem; text-align: center; margin-top: 0.5rem; font-weight: 600; '>Ferie/permessi non ancora approvati </figcaption></figure></a ></div><div style='padding: 1rem'><a href='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-home-odoo-day.webp' target='blank' ><figure style='margin: 0'><img src='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-home-odoo-day.webp' style='width: 100%; border-radius: 0.3rem; border: 1px solid currentColor' /><figcaption style=' text-decoration: none; font-size: 0.6rem; text-align: center; margin-top: 0.5rem; font-weight: 600; '>Odoo modulo Planning, visualizzazione giornaliera </figcaption></figure></a ></div></div><div class='subsection-know-base'>Celle del calendario [ICONA-BACK-TO-TOP]<p class='normal-text-know-base'>All’interno della pagina Planning, le celle del calendario possono assumere diverse configurazioni grafiche e indicatori visivi, utili per comprendere rapidamente lo stato della pianificazione e la presenza di eventuali criticità. Di seguito una panoramica dei principali elementi: </p><div class='subsubsection-know-base'>Triangoli di segnalazione [ICONA-BACK-TO-TOP]<ul><li class='normal-text-know-base'><b>Triangolo giallo</b> (in alto a sinistra): indica che sono state apportate modifiche alla pianificazione rispetto alla versione pubblicata. </li><li class='normal-text-know-base'><b>Triangolo rosso</b> (in alto a sinistra): segnala un errore o conflitto di pianificazione: la risorsa è stata pianificata oltre il proprio monte ore disponibile per quella giornata. È necessario verificare e correggere la sovrapposizione. </li></ul><div style='padding-top: 0.5rem; padding-bottom: 0.5rem'><a href='https://www.sydea.com/static/knowledge-base/images/planning/PLANING-triangoli-segnalazione.webp' target='blank' ><figure style='margin: 0'><img src='https://www.sydea.com/static/knowledge-base/images/planning/PLANING-triangoli-segnalazione.webp' style=' width: 100%; border-radius: 0.3rem; border: 1px solid currentColor; ' /></figure ></a></div></div><div class='subsubsection-know-base'>Colorazione grigia (assenze) [ICONA-BACK-TO-TOP]<ul><li class='normal-text-know-base'><b>Grigio scuro con etichetta</b>: rappresenta ferie o permessi non ancora approvati. La cella mostra un’etichetta del tipo: <code>–INT– Time Off 💬 – 9:00 AM – 6:00 PM (8h)</code>. Vengono riportati il tipo di assenza, l’orario di inizio/fine e la durata. </li><li class='normal-text-know-base'><b>Grigio chiaro</b>: indica ferie o permessi già approvati. Non viene mostrata alcuna etichetta aggiuntiva nella cella. </li></ul><div style='padding-top: 0.5rem; padding-bottom: 0.5rem'><a href='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-ferie-approvate-non-approvate.webp' target='blank' ><figure style='margin: 0'><img src='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-ferie-approvate-non-approvate.webp' style=' width: 100%; border-radius: 0.3rem; border: 1px solid currentColor; ' /></figure ></a></div></div><div class='subsubsection-know-base'>Slot di pianificazione [ICONA-BACK-TO-TOP]<ul><li class='normal-text-know-base'><b>Colorazione zebrata</b>: indica che la pianificazione non è stata ancora approvata. </li><li class='normal-text-know-base'><b>Colorazione piena</b>: indica che la pianificazione è stata approvata e confermata. </li></ul><div style='padding-top: 0.5rem; padding-bottom: 0.5rem'><a href='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-pianificazione-approvata-non-approvata.webp' target='blank' ><figure style='margin: 0'><img src='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-pianificazione-approvata-non-approvata.webp' style=' width: 100%; border-radius: 0.3rem; border: 1px solid currentColor; ' /></figure ></a></div><p class='normal-text-know-base'>Ogni box di pianificazione include informazioni sul nome del progetto e la durata di allocazione della risorsa. </p></div></div></div><div class='section-know-base'><span>Procedura di Richiesta [ICONA-BACK-TO-TOP]</span><div class='subsection-know-base'>Nuova richiesta di Pianificazione [ICONA-BACK-TO-TOP]<div class='body-section'><p class='normal-text-know-base'>Per inserire una nuova pianificazione è necessario cliccare sul pulsante <code>NEW</code> in alto a sinistra nella schermata principale o cliccare sulla cella desiderata del calendario in base alla visualizzazione corrente (giorno, settimana, mese). </p><div style='padding: 1rem'><a href='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-button-new.webp' target='blank' ><figure style='margin: 0'><img src='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-button-new.webp' style=' width: 100%; border-radius: 0.3rem; border: 1px solid currentColor; ' /></figure ></a></div><p class='normal-text-know-base'>Si aprirà una finestra pop-up contenente diversi campi, alcuni da compilare e altri precompilati o di sola lettura. </p><div style='padding: 1rem'><a href='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-new-request.webp' target='blank' ><figure style='margin: 0'><img src='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-new-request-modal.webp' style='width: 100%; border-radius: 0.3rem; border: 1px solid currentColor' /><figcaption style=' text-decoration: none; font-size: 0.6rem; text-align: center; margin-top: 0.5rem; font-weight: 600; '>Nuova richiesta di pianificazione </figcaption></figure></a ></div><p class='normal-text-know-base'><b>Campi di sola lettura</b></p><ul><li><code>Created on</code>: data e ora in cui è stata creata la pianificazione. Si valorizza automaticamente al momento del salvataggio. </li><li><code>Created by</code>: utente che ha creato la pianificazione. Si valorizza automaticamente al momento del salvataggio. </li><li><code>Project Manager</code>: Project Manager associato al progetto. Si compila automaticamente in base al progetto selezionato. </li><li><code>Changed on</code>: data e ora dell’ultima modifica alla pianificazione.</li><li><code>Changed by</code>: utente che ha effettuato l’ultima modifica alla pianificazione. </li></ul><p class='normal-text-know-base'><b>Campi da compilare</b></p><ul><li><code>Resource</code>: risorsa per la quale si sta creando la pianificazione.</li><li><code>Project</code>: progetto su cui la risorsa selezionata sarà allocata.</li><li><code>Date</code>(range data/ora di inizio e fine): specifica l’intervallo di tempo della pianificazione. Il comportamento varia in base alla modalità di visualizzazione attiva e al modo in cui viene aperta la finestra di creazione: <ul><li>Clic su <code>NEW</code>: <ul><li><i>Vista giornaliera</i>: l’intervallo copre l’intera giornata lavorativa. </li><li><i>Vista settimanale</i>: l’intervallo copre l’intera settimana lavorativa. </li><li><i>Vista mensile</i>: l’intervallo copre l’intero mese lavorativo.</li></ul></li></ul><ul><li>Clic su una cella del calendario: <ul><li><i>Vista giornaliera</i>: l’ora di inizio corrisponde allo slot orario selezionato; l’ora di fine coincide con la fine della giornata lavorativa. </li><li><i>Vista settimanale/mensile</i>: l’intervallo corrisponde all’intera giornata lavorativa selezionata. </li></ul></li></ul></li><li><code>Allocated time</code>: indica il tempo di allocazione della risorsa, con indicazione della percentuale di carico. Il comportamento varia in base alla modalità di apertura della finestra e alla vista selezionata: <ul><li>Clic su <code>NEW</code>: <ul><li><i>Vista giornaliera</i>: mostra il totale delle ore disponibili per la giornata selezionata. </li><li><i>Vista settimanale</i>: mostra il totale delle ore disponibili nell’intera settimana lavorativa. </li><li><i>Vista mensile</i>: mostra il totale delle ore disponibili nell’intero mese lavorativo. </li></ul></li></ul><ul><li>Clic su una cella del calendario: <ul><li><i>Vista giornaliera</i>: mostra le ore disponibili a partire dall’orario selezionato fino alla fine della giornata lavorativa. </li><li><i>Vista settimanale/mensile</i>: mostra le ore disponibili nella giornata lavorativa selezionata. </li></ul></li></ul></li><li><code>Additonal note</code>: Campo testuale libero per inserire note opzionali. Il contenuto di questo campo verrà incluso nella notifica email inviata al dipendente per informarlo della nuova pianificazione. </li></ul></div></div><div class='subsection-know-base'>Modificare/eliminare una richiesta di Pianificazione [ICONA-BACK-TO-TOP]<p class='normal-text-know-base'>Le modifiche o la cancellazione di una richiesta di pianificazione già inserita possono essere compiute dal PM solo se la <b>richiesta di pianificazione non è stata ancora approvata</b> e devono essere effettuate esclusivamente dalla pagina Planning, dove è possibile intervenire direttamente sugli elementi pianificati. </p><p class='normal-text-know-base'>Cliccando sul blocco pianificato in corrispondenza della risorsa si aprirà la finestra di dettaglio della pianificazione, dalla quale sarà possibile modificare i valori inseriti in precedenza o eliminare l'intera richiesta. </p><div style='padding: 1rem'><a href='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-change-request.webp' target='blank' ><figure style='margin: 0'><img src='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-change-request.webp' style='width: 100%; border-radius: 0.3rem; border: 1px solid currentColor' /><figcaption style=' text-decoration: none; font-size: 0.6rem; text-align: center; margin-top: 0.5rem; font-weight: 600; '>Modifica richiesta di pianificazione </figcaption></figure></a ></div><p class='normal-text-know-base'>Una volta eliminata, la pianificazione non sarà più visibile nella pagina Planning. </p><div style='padding: 1rem'><a href='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-delete-request-alert.webp' target='blank' ><figure style='margin: 0'><img src='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-delete-request-alert.webp' style='width: 100%; border-radius: 0.3rem; border: 1px solid currentColor' /><figcaption style=' text-decoration: none; font-size: 0.6rem; text-align: center; margin-top: 0.5rem; font-weight: 600; '>Eliminazione richiesta di pianificazione </figcaption></figure></a ></div></div></div><div class='section-know-base'><span>Procedura di Approvazione [ICONA-BACK-TO-TOP]</span><div class='subsection-know-base'>Approvare una richiesta di Pianificazione [ICONA-BACK-TO-TOP]<p class='normal-text-know-base'>Il Responsabile della Pianificazione è l’unico utente autorizzato ad approvare, modificare o eliminare le richieste di pianificazione caricate su Odoo dai PM, PO o Team Leader. </p><div class='subsubsection-know-base'>Approvazione singola [ICONA-BACK-TO-TOP]<p class='normal-text-know-base'>Per approvare una singola richiesta, il Responsabile accede alla vista Planning e clicca sulla cella della richiesta di pianificazione da approvare. </p><div style='padding: 1rem'><a href='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-approvazione-singola.webp' target='blank' ><figure style='margin: 0'><img src='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-approvazione-singola.webp' style='width: 100%; border-radius: 0.3rem; border: 1px solid currentColor' /><figcaption style=' text-decoration: none; font-size: 0.6rem; text-align: center; margin-top: 0.5rem; font-weight: 600; '>Selezione di una singola richiesta di pianificazione da approvare </figcaption></figure></a ></div><p class='normal-text-know-base'>Contestualmente si aprirà un pop-up con il riepilogo completo della pianificazione: autore della richiesta, risorsa, progetto, data e ora, tempo di allocazione e note aggiuntive. </p><div style='padding: 1rem'><a href='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-popup-riepilogo-richiesta-pianificazione.webp' target='blank' ><figure style='margin: 0'><img src='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-popup-riepilogo-richiesta-pianificazione.webp' style='width: 100%; border-radius: 0.3rem; border: 1px solid currentColor' /><figcaption style=' text-decoration: none; font-size: 0.6rem; text-align: center; margin-top: 0.5rem; font-weight: 600; '>Popup di riepilodo di una richiesta di pianificazione </figcaption></figure></a ></div><ul class='normal-text-know-base'><li>Premendo <code>PUBLISH & SEND</code> la richiesta verrà confermata e verranno automaticamente <b>inviate due email di notifica</b>, una al PM richiedente e una alla risorsa assegnata, contenenti il riepilogo della pianificazione. </li><li>Qualora si preferisca non inviare alcuna mail, si può optare per <code>PUBLISH</code>, che approva la pianificazione senza l'invio di notifiche. </li></ul></div><div class='subsubsection-know-base'>Approvazione massiva [ICONA-BACK-TO-TOP]<p class='normal-text-know-base'>Per gestire più richieste contemporaneamente, il Responsabile della pianificazione, dopo avere controllato nella vista settimanale o mensile che non ci siano conflitti di pianificazione tra le risorse, passa alla vista <i>List</i>.<br />Si consiglia di inserire i filtri <i>Next week</i> e <i>Draft</i> per avere una visione chiara e pulita delle richieste da approvare per la settimana succesiva. </p><div style='padding: 1rem'><a href='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-filtro-next-week.webp' target='blank' ><figure style='margin: 0'><img src='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-filtro-next-week.webp' style='width: 100%; border-radius: 0.3rem; border: 1px solid currentColor' /><figcaption style=' text-decoration: none; font-size: 0.6rem; text-align: center; margin-top: 0.5rem; font-weight: 600; '>Selezione del filtro <i>Next week</i></figcaption></figure></a ></div><div style='padding: 1rem'><a href='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-filtro-draft.webp' target='blank' ><figure style='margin: 0'><img src='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-filtro-draft.webp' style='width: 100%; border-radius: 0.3rem; border: 1px solid currentColor' /><figcaption style=' text-decoration: none; font-size: 0.6rem; text-align: center; margin-top: 0.5rem; font-weight: 600; '>Selezione del filtro <i>Draft</i></figcaption></figure></a ></div><p class='normal-text-know-base'>Dopo aver selezionato le righe risultanti dalla liste filtrata, dal menu <i>Action</i> è possibile eseguire il comando <code>Publish & Send</code> per confermare e notificare in blocco PM e risorse, oppure <code>Publish</code> se si desidera un aggiornamento silenzioso. </p><div style='padding: 1rem'><a href='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-dropdown-action-publish.webp' target='blank' ><figure style='margin: 0'><img src='https://www.sydea.com/static/knowledge-base/images/planning/PLANNING-dropdown-action-publish.webp' style='width: 100%; border-radius: 0.3rem; border: 1px solid currentColor' /><figcaption style=' text-decoration: none; font-size: 0.6rem; text-align: center; margin-top: 0.5rem; font-weight: 600; '>Approvazione massiva delle richieste di pianificazione </figcaption></figure></a ></div></div></div><div class='subsection-know-base'>Modificare/eliminare una richiesta di Pianificazione [ICONA-BACK-TO-TOP]<p class='normal-text-know-base'>Il Responsabile della Pianificazione può intervenire su una richiesta in qualsiasi momento semplicemente riaprendo il medesimo pop-up utilizzato per l’approvazione. All’interno di questa finestra è possibile aggiornare i campi editabili e confermare la modifica scegliendo se notificare nuovamente il PM e la risorsa (con <code>Publish & Send</code>) o applicare le variazioni in modo silenzioso (con <code>Publish</code>). </p><p class='normal-text-know-base'>L’eliminazione di una richiesta è anch’essa gestita dalla stessa interfaccia e può avvenire sia in modalità singola che massiva.<br />Per la cancellazione singola, basta aprire il pop-up di dettaglio e selezionare <code>Delete</code> dal menu <i>Action</i>.<br />Per l’eliminazione in blocco, si utilizzano la vista <i>Lista</i> e i filtri <i>Next week</i> e <i>Draft</i>, si selezionano le righe interessate e si sceglie <code>Delete</code> dal menu <i>Action</i>.<br />Se la richiesta da eliminare era già stata approvata, al momento della cancellazione Odoo invierà automaticamente due email di notifica, una al PM e una alla risorsa, per comunicare l’avvenuta rimozione. </p></div></div></div>";

// const CharacterCountIndicator = ({ limit }) => {
//   const { editor } = useCurrentEditor();

//   if (!editor) {
//     return null;
//   }

//   const characterCount = editor.storage.characterCount?.characters() || 0;
//   const words = editor.storage.characterCount?.words() || 0;
//   const percentage = Math.round((100 / limit) * characterCount);

//   return (
//     <div
//       className={`character-count ${
//         characterCount >= limit ? "character-count--warning" : ""
//       }`}
//     >
//       <svg height="20" width="20" viewBox="0 0 20 20">
//         <circle r="10" cx="10" cy="10" fill="#e9ecef" />
//         <circle
//           r="5"
//           cx="10"
//           cy="10"
//           fill="transparent"
//           stroke="currentColor"
//           strokeWidth="10"
//           strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
//           transform="rotate(-90) translate(-20)"
//         />
//         <circle r="6" cx="10" cy="10" fill="white" />
//       </svg>
//       {characterCount} / {limit} characters
//       <br />
//       {words} words
//     </div>
//   );
// };

// const SaveButton = () => {
//   const { editor } = useCurrentEditor();

//   if (!editor) {
//     return null;
//   }

//   const handleSave = () => {
//     const html = editor.getHTML();
//     console.log("Contenuto HTML:", html);
//     // 👉 Qui puoi fare:
//     // - invio a un backend con fetch/axios
//     // - salvataggio su localStorage
//     // - altro uso personalizzato
//   };

//   return <Button onClick={handleSave}>Save HTML</Button>;
// };

// const BubbleMenuText = () => {
//   const { editor } = useCurrentEditor();

//   if (!editor) {
//     return null;
//   }

//   return (
// <>
//       {editor && <BubbleMenu className="bubble-menu" tippyOptions={{ duration: 100 }} editor={editor}>
//         <button
//           onClick={() => editor.chain().focus().toggleBold().run()}
//           className={editor.isActive('bold') ? 'is-active' : ''}
//         >
//           Bold
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleItalic().run()}
//           className={editor.isActive('italic') ? 'is-active' : ''}
//         >
//           Italic
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleStrike().run()}
//           className={editor.isActive('strike') ? 'is-active' : ''}
//         >
//           Strike
//         </button>
//       </BubbleMenu>}

//       {editor && <FloatingMenu className="floating-menu" tippyOptions={{ duration: 100 }} editor={editor}>
//         <button
//           onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
//           className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
//         >
//           H1
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
//           className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
//         >
//           H2
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleBulletList().run()}
//           className={editor.isActive('bulletList') ? 'is-active' : ''}
//         >
//           Bullet list
//         </button>
//       </FloatingMenu>}
//     </>
//   );
// };


// export const EditorSuite = () => {
//   const extensions = [
//     Color.configure({ types: [TextStyle.name, ListItem.name] }),
//     TextStyle.configure({ types: [ListItem.name] }),
//     StarterKit.configure({
//       bulletList: {
//         keepMarks: true,
//         keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
//       },
//       orderedList: {
//         keepMarks: true,
//         keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
//       },
//     }),
//     Document,
//     Paragraph,
//     Text,
//     Underline,
//     CharacterCount.configure({
//       limit,
//     }),
//     Bold,
//     TextAlign.configure({
//       types: ['heading', 'paragraph'],
//     }),
//     Highlight,
//       Table.configure({
//         resizable: true,
//       }),
//       TableRow,
//       TableHeader,
//       // Default TableCell
//       // TableCell,
//       // Custom TableCell with backgroundColor attribute
//       CustomTableCell,
//   ];

//   return (
//     <>
//       <EditorProvider
//         slotBefore={<MenuBar />}
//         extensions={extensions}
//         content={content}
//       >
//         <CharacterCountIndicator limit={limit} />
//         <BubbleMenuText />
//         <div>
//           <SaveButton />
//         </div>
//       </EditorProvider>
//     </>
//   );
// };
