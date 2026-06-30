import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "./virtual-noticeboard.scss";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 1200,
  height: "90%",
  // bgcolor: "background.paper",
  bgcolor: "#1f1f1fd9",
  boxShadow: 24,
  p: 2,
  overflow: "auto",
};

export default function PdfPreviewModal({ file, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <Modal open={!!file} onClose={onClose}>
      <Box sx={modalStyle}>
        <button className="close" onClick={onClose} style={{ marginBottom: 10 }}>
          ✕ Close
        </button>

        {file && (
          // <Document
          //   file={file}
          //   onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          //   onLoadError={(err) => console.error("PDF load error:", err)}
          // >
          //   <Page
          //     pageNumber={currentPage}
          //     width={1000}
          //     renderTextLayer={false}
          //     renderAnnotationLayer={false}
          //   />
          // </Document>
            <Document
              file={file}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
              {Array.from(new Array(numPages), (_, i) => (
                <><Page
                  key={i}
                  pageNumber={i + 1}
                  width={1000}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                /><br/></>
              ))}
            </Document>
        )}

        {/* Controllo pagine */}
        {numPages && (
          <div style={{ marginTop: 10 }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {currentPage} / {numPages}
            </span>
            <button
              disabled={currentPage === numPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </Box>
    </Modal>
  );
}
