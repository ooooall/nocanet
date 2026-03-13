"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function randomRoomName(): string {
  return Math.random().toString(36).substring(2, 10);
}

export default function Home() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [showJoinInput, setShowJoinInput] = useState(false);

  function handleCreateRoom() {
    router.push("/room/" + randomRoomName());
  }

  function handleJoin() {
    const code = roomCode.trim();
    if (!code) return;
    router.push("/room/" + code);
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-between px-6 py-16"
      style={{ backgroundColor: "#0f0f0f", color: "#fff" }}
    >
      <main className="flex w-full max-w-md flex-1 flex-col items-center justify-center gap-14">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">NocaNet</h1>
          <p className="mt-2 text-lg text-neutral-400">
            Звонки без границ
          </p>
        </header>

        <div className="flex w-full flex-col gap-4">
          <button
            type="button"
            onClick={handleCreateRoom}
            className="flex h-14 w-full items-center justify-center rounded-xl font-semibold transition hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
              color: "#fff",
            }}
          >
            Создать новый звонок
          </button>

          {!showJoinInput ? (
            <button
              type="button"
              onClick={() => setShowJoinInput(true)}
              className="flex h-14 w-full items-center justify-center rounded-xl border border-neutral-600 font-semibold text-white transition hover:border-indigo-500 hover:bg-neutral-800/50"
            >
              Войти по коду
            </button>
          ) : (
            <div className="flex flex-col gap-3 rounded-xl border border-neutral-600 bg-neutral-900/50 p-4">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                placeholder="Код комнаты"
                className="w-full rounded-lg border border-neutral-600 bg-neutral-800 px-4 py-3 text-white placeholder-neutral-500 outline-none focus:border-indigo-500"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowJoinInput(false);
                    setRoomCode("");
                  }}
                  className="flex-1 rounded-lg border border-neutral-600 py-2.5 font-medium text-neutral-300 transition hover:bg-neutral-800"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleJoin}
                  disabled={!roomCode.trim()}
                  className="flex-1 rounded-lg py-2.5 font-semibold text-white transition disabled:opacity-50 hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
                  }}
                >
                  Войти
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <p className="text-center text-sm text-neutral-500">
        Работает везде. Бесплатно. Без регистрации.
      </p>
    </div>
  );
}
