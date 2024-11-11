import React, { useState, useEffect } from "react";
import StartPage from "./components/StartPage";
import QuestionPage from "./components/QuestionPage";
import questions from "./questions";
import type { Session } from "./helper/type";

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(120 * 60); // 120 minutes in seconds
  const [availableTest] = useState(true);

  useEffect(() => {
    const storedSession = sessionStorage.getItem("session");
    if (storedSession) {
      try {
        const parsedSession: Session = JSON.parse(storedSession);
        const elapsedTime = (Date.now() - parsedSession.startTime) / 1000;

        if (elapsedTime < 120 * 60) {
          // 120 minutes in seconds
          setSession(parsedSession);
          setTimeLeft(120 * 60 - elapsedTime);
        } else {
          sessionStorage.removeItem("session");
        }
      } catch (error) {
        console.error("Error parsing session:", error);
        sessionStorage.removeItem("session");
      }
    }
  }, []);

  useEffect(() => {
    if (session) {
      const timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft <= 1) {
            clearInterval(timer);
            sessionStorage.removeItem("session");
            setSession(null);
            alert(
              "Waktu sesi telah habis, Anda akan dikembalikan ke halaman awal."
            );
            return 0;
          }
          return prevTimeLeft - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [session]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (session && document.visibilityState === "hidden") {
        sessionStorage.removeItem("session");
        setSession(null);
        alert("Anda meninggalkan tab. Sesi telah diakhiri.");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [session]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen" || (e.ctrlKey && e.key === "p")) {
        alert("Pengambilan screenshot atau print tidak diizinkan.");
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const startSession = () => {
    const shuffledQuestions = [...questions].sort(() => 0.5 - Math.random());
    const selectedQuestion = shuffledQuestions[0];

    const newSession: Session = {
      question: selectedQuestion,
      startTime: Date.now(),
    };
    sessionStorage.setItem("session", JSON.stringify(newSession));
    setSession(newSession);
    setTimeLeft(120 * 60); // Reset the timeLeft state to 120 minutes
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${hours} jam ${minutes} menit ${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds} detik`;
  };

  return (
    <div>
      {availableTest ? (
        !session ? (
          <StartPage startSession={startSession} />
        ) : (
          <>
            <div className="p-5 text-xl font-medium text-center">
              Waktu tersisa: {formatTime(timeLeft)}
              <p>Goodluck!</p>
            </div>
            {session && <QuestionPage question={session.question} />}
          </>
        )
      ) : (
        <div className="flex items-center justify-center flex-col w-[100vw] h-[100vh]">
          <p className="text-4xl font-bold text-slate-900">
            Terima Kasih sudah mengikuti Tes!
          </p>
          <p className="mt-2">Sampai Jumpa di Tes selanjutnya</p>

          <div className="absolute bottom-0 p-8 text-slate-400">
            Copyright &copy; Made by joe - See Yaa!
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
