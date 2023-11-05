import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import demodoc from '../assets/demodoc.pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css'; // remove the text from being shown under the PDF

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`; // 

const PdfDisplayer = () => {
  return (
    <Document file={demodoc}>
      <Page pageNumber={3} />
    </Document>
  )
}

export default PdfDisplayer;