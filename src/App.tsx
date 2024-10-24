import React, { useState, useEffect } from "react";
import StartPage from "./components/StartPage";
import QuestionPage from "./components/QuestionPage";
import questions from "./questions";
import type { Session } from "./helper/type";

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(40 * 60); // 40 minutes in seconds

  useEffect(() => {
    const storedSession = sessionStorage.getItem("session");
    if (storedSession) {
      try {
        const parsedSession: Session = JSON.parse(storedSession);
        const elapsedTime = (Date.now() - parsedSession.startTime) / 1000;

        if (elapsedTime < 40 * 60) {
          setSession(parsedSession);
          setTimeLeft(40 * 60 - elapsedTime);
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
      setTimeout(() => {
        if (document.visibilityState === "hidden") {
          sessionStorage.removeItem("session");
          setSession(null);
          alert("Anda meninggalkan tab. Sesi telah diakhiri.");
        }
      }, 0);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

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
    setTimeLeft(40 * 60); // Reset the timeLeft state
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div>
      {!session ? (
        <StartPage startSession={startSession} />
      ) : (
        <>
          <div className="p-5 text-xl font-medium text-center">
            Waktu tersisa: {formatTime(timeLeft)}
            <p>Goodluck!</p>
          </div>
          <QuestionPage question={session.question} />
        </>
      )}
    </div>
  );
};

export default App;
