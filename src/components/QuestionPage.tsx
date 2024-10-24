import React, { useEffect, useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { fetchPDF } from "../helper/proxyHandler";
import type { Question } from "../helper/type";

type QuestionPageProps = {
  question: Question;
};

const QuestionPage: React.FC<QuestionPageProps> = ({ question }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadPDF = async () => {
      const pdfBlobUrl = await fetchPDF(question.pdfUrl);
      setPdfUrl(pdfBlobUrl);
    };
    loadPDF();
  }, [question.pdfUrl]);

  return (
    <div>
      {pdfUrl ? (
        <div
          style={{
            height: "90vh", // Mengatur tinggi tampilan
            width: "60vw", // Mengatur lebar tampilan
            margin: "0 auto", // Memusatkan tampilan
            border: "1px solid #ccc",
          }}
        >
          <Worker
            workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
          >
            <Viewer fileUrl={pdfUrl} plugins={[]} />
          </Worker>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <div className="absolute bottom-0 p-8 text-slate-400">
        Copyright &copy; Made by joe
      </div>
    </div>
  );
};

export default QuestionPage;
