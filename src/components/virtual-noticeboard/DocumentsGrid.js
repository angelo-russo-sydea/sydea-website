// import { useState } from "react";
// import PdfThumbnail from "./PdfThumbnail";
// import PdfPreviewModal from "./PdfPreviewModal";
// import "./virtual-noticeboard.scss";

// export default function DocumentsGrid() {
//   const [selectedFile, setSelectedFile] = useState(null);

//   const documents = [
//     { name: "Organigramma", file: "https://www.sydea.com/static/sydea-privacy-policy.pdf" },
//     { name: "Codice condotta", file: "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf" },
//   ];

//   return (
//     <>
//       <div className="grid">
//         {documents.map((doc) => (
//           <div key={doc.file} className="card">
//             <PdfThumbnail
//               file={doc.file}
//               onClick={() => setSelectedFile(doc.file)}
//             />
//             <p>{doc.name}</p>
//           </div>
//         ))}
//       </div>

//       {selectedFile && (
//         <PdfPreviewModal
//           file={selectedFile}
//           onClose={() => setSelectedFile(null)}
//         />
//       )}
//     </>
//   );
// }

import React, { useContext, useEffect, useState, useRef } from "react";
import PdfThumbnail from "./PdfThumbnail";
import PdfPreviewModal from "./PdfPreviewModal";
import "./virtual-noticeboard.scss";
import { useParams } from "react-router-dom";

export default function DocumentsGrid() {
  const [selectedFile, setSelectedFile] = useState(null);
  const { lang } = useParams();

  const documents = [
    {
      name: "Organigramma",
      file: "https://www.sydea.com/static/sydea-privacy-policy.pdf",
      date: "18/07/2025"
    },
    {
      name: "Codice condotta",
      file: "https://pdfobject.com/pdf/sample.pdf",
      date: "18/07/2025"
    },
  ];

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    const date = new Date(+year, month - 1, + day); 
    return date.toLocaleDateString(lang || "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="grid-thumbnail">
        {documents.map((doc, i) => (
          <div key={i} className="thumbnail-card">
            <PdfThumbnail
              file={doc.file}
              onClick={() => setSelectedFile(doc.file)}
            />
            <p className="label-thumbnail-card m-0 mt-2">{doc.name}</p>
            <p className="m-0" style={{fontSize: '14px'}}>{formatDate(doc.date)}</p>
          </div>
        ))}
      </div>

      {selectedFile && (
        <PdfPreviewModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </>
  );
}
