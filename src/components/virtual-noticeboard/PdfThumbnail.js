import { Document, Page } from "react-pdf";
import React, { useContext, useEffect, useState, useRef } from "react";
import PDFIcon from '../../assets/icons/PDF_file_icon.png';


export default function PdfThumbnail({ file, onClick }) {
  const [numPages, setNumPages] = useState(null);

  return (
    <div onClick={onClick} style={{ cursor: "pointer", width: 160, position: 'relative', filter: 'drop-shadow(2px 4px 6px #00000020)' }}>
      <Document
        file={file}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        onLoadError={(err) => console.error("PDF load error:", err)}
      >
        <Page
          pageNumber={1}
        //   width={160}
          height={200}
        // scale={0.3}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
      <img src={PDFIcon} alt="PDF" style={{    height: '40px',
    width: 'auto',
    position: 'absolute',
    bottom: '-3%',
    right: '-3%'}}/>
    </div>
  );
}

