export type Question = {
  id: number;
  pdfUrl: string;
};

export type StartPage = {
  startSession: () => void;
};

export type Session = {
  question: { id: number; pdfUrl: string };
  startTime: number;
};

// export default ;
