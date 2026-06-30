import { pdfjs } from "react-pdf";

// Imposta il worker statico (CRA serve tutto ciò che è in public/)
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
