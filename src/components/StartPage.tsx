import React from "react";
import type { StartPage } from "../helper/type";

const StartPage: React.FC<StartPage> = ({ startSession }) => (
  <>
    <section className="flex items-start justify-center flex-col w-[100vw] h-[100vh] pl-52">
      <div className="px-5 py-2 mb-5 font-medium text-white bg-red-600 rounded-full">
        RAHASIA
      </div>
      <p className="text-4xl font-bold text-slate-900">Selamat Datang!</p>
      <p className="mt-5">
        Website ini dibuat khusus untuk menunjang <br />
        Tes Tengah Semester, Web bersifat{" "}
        <span className="font-semibold highlight highlight-spread-sm highlight-yellow-200 highlight-variant-5">
          Rahasia
        </span>
      </p>

      <p className="mt-2 italic">Tunggu instruksi selanjutnya.</p>
      <button
        onClick={startSession}
        className="px-8 py-3 mt-12 text-black transition-all border-2 border-black rounded-2xl hover:bg-black hover:text-white"
      >
        Start Test
      </button>
      <div className="absolute bottom-0 right-0 p-8 text-slate-400">
        Copyright &copy; Made by joe
      </div>
    </section>
  </>
);

export default StartPage;
