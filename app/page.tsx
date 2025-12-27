"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Pause, ChevronLeft, ChevronRight, Repeat } from "lucide-react";
import L from "../lessons.json";

const A = (() => {
  if (typeof window === "undefined") return { e: () => {}, m: () => {}, c: () => {} };

  const s = speechSynthesis;
  const a = new Audio();
  let v: SpeechSynthesisVoice | null = null;

  const l = () => {
    const x = s.getVoices();
    v = x.find((i) => i.lang === "en-US") || x[0];
  };

  l();
  s.onvoiceschanged = l;

  return {
    e: (t: string, f: () => void) => {
      s.cancel();
      const u = new SpeechSynthesisUtterance(t);
      u.lang = "en-US";
      u.rate = 0.85;
      if (v) u.voice = v;
      u.onend = f;
      s.speak(u);
    },
    m: (t: string, f: () => void) => {
      s.cancel();
      a.src = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(t)}&tl=my&client=tw-ob`;
      a.onended = f;
      a.play().catch(f);
    },
    c: () => {
      s.cancel();
      a.pause();
      a.currentTime = 0;
    },
  };
})();

export default function App() {
  const [i, setI] = useState(0);
  const [p, setP] = useState(false);
  const [r, setR] = useState(false);
  const [s, setS] = useState(0);

  const play = useCallback(
    (n: number = i) => {
      const x = L[n];
      setS(1);
      A.e(x.e, () =>
        setTimeout(() => {
          setS(2);
          A.m(x.m, () =>
            setTimeout(() => {
              setS(0);
              if (r) {
                play(n);
              } else if (p) {
                setI((n + 1) % L.length);
              }
            }, 700)
          );
        }, 400)
      );
    },
    [p, r, i]
  );

  useEffect(() => {
    if (p) {
      play(i);
    } else {
      A.c();
    }
  }, [p, i, play]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <h3 style={{ marginBottom: "30px", fontSize: "24px" }}>English ⇄ Myanmar</h3>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => setI((i - 1 + L.length) % L.length)}
          style={{
            background: "#333",
            border: "none",
            color: "#fff",
            padding: "12px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => setP(!p)}
          style={{
            background: "#333",
            border: "none",
            color: "#fff",
            padding: "12px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          {p ? <Pause /> : <Play />}
        </button>
        <button
          onClick={() => setI((i + 1) % L.length)}
          style={{
            background: "#333",
            border: "none",
            color: "#fff",
            padding: "12px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ChevronRight />
        </button>
      </div>

      <div style={{ marginTop: 40, textAlign: "center" }}>
        <div
          style={{
            fontSize: 32,
            color: s === 1 ? "#6366f1" : "#aaa",
            marginBottom: "15px",
            transition: "color 0.3s",
          }}
        >
          {L[i].e}
        </div>
        <div
          style={{
            fontSize: 24,
            color: s === 2 ? "#10b981" : "#666",
            transition: "color 0.3s",
          }}
        >
          {L[i].m}
        </div>
      </div>

      <button
        onClick={() => setR(!r)}
        style={{
          marginTop: 40,
          background: r ? "#10b981" : "#333",
          border: "none",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: "8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "14px",
          transition: "background 0.3s",
        }}
      >
        <Repeat size={18} /> {r ? "REPEAT" : "AUTO"}
      </button>

      <div
        style={{
          marginTop: 50,
          fontSize: "14px",
          color: "#666",
        }}
      >
        Lesson {i + 1} of {L.length}
      </div>
    </div>
  );
}
