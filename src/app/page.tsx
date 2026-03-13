"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function generateRoomName(): string {
  const array = new Uint8Array(12);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(36))
    .join("")
    .substring(0, 12);
}

const gridSvg = (
  <svg
    width="100%"
    height="100%"
    xmlns="http://www.w3.org/2000/svg"
    style={{ position: "absolute", inset: 0 }}
  >
    <defs>
      <pattern
        id="grid"
        width="60"
        height="60"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M 60 0 L 0 0 0 60"
          fill="none"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="1"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

export default function Home() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");

  function handleCreateRoom() {
    const roomName = generateRoomName();
    router.push("/room/" + roomName);
  }

  function handleJoin() {
    const code = joinCode.trim();
    if (!code) return;
    router.push("/room/" + code);
  }

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          background: "rgba(5,5,8,0.8)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          zIndex: 100,
          animation: "fadeInDown 0.6s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background:
                "linear-gradient(135deg, var(--accent) 0%, var(--accent3) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: 16,
                color: "#fff",
              }}
            >
              N
            </span>
          </div>
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 18,
              color: "var(--text)",
            }}
          >
            NocaNet
          </span>
        </div>
        <div
          style={{
            border: "1px solid rgba(16,185,129,0.3)",
            background: "rgba(16,185,129,0.08)",
            borderRadius: 20,
            padding: "4px 12px",
            fontSize: 11,
            color: "var(--green)",
          }}
        >
          🔒 E2E Encrypted
        </div>
      </nav>

      <main>
        <section
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 24px 120px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background layers */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            {gridSvg}
          </div>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 800,
              height: 800,
              marginLeft: -400,
              marginTop: -400,
              background:
                "radial-gradient(circle, rgba(124,106,255,0.12) 0%, rgba(124,106,255,0.04) 40%, transparent 70%)",
              filter: "blur(60px)",
              zIndex: 1,
              animation: "pulse 4s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "15%",
              width: 300,
              height: 300,
              background:
                "radial-gradient(circle, rgba(124,106,255,0.2), transparent 70%)",
              filter: "blur(80px)",
              zIndex: 2,
              animation: "float1 8s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "60%",
              right: "10%",
              width: 250,
              height: 250,
              background:
                "radial-gradient(circle, rgba(6,182,212,0.15), transparent 70%)",
              filter: "blur(60px)",
              zIndex: 2,
              animation: "float2 10s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "20%",
              left: "40%",
              width: 200,
              height: 200,
              background:
                "radial-gradient(circle, rgba(167,139,250,0.12), transparent 70%)",
              filter: "blur(50px)",
              zIndex: 2,
              animation: "float3 7s ease-in-out infinite reverse",
            }}
          />

          {/* Hero content */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              textAlign: "center",
              maxWidth: 560,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid var(--border-bright)",
                background: "rgba(255,255,255,0.04)",
                borderRadius: 100,
                padding: "6px 16px",
                fontSize: 13,
                color: "var(--text-muted)",
                marginBottom: 24,
                animation: "fadeInUp 0.8s ease 0.2s both",
              }}
            >
              ✦ Звонки нового поколения
            </div>

            <h1
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(52px, 8vw, 96px)",
                letterSpacing: "-3px",
                lineHeight: 0.95,
                color: "var(--text)",
                animation: "fadeInUp 0.8s ease 0.4s both",
              }}
            >
              Звони без
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #fff 0%, var(--accent2) 50%, var(--accent3) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                границ.
              </span>
            </h1>

            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 300,
                fontSize: 18,
                color: "var(--text-muted)",
                maxWidth: 440,
                margin: "0 auto",
                marginTop: 20,
                animation: "fadeInUp 0.8s ease 0.6s both",
              }}
            >
              Зашифрованные звонки из любой точки мира. Без регистрации. Без
              слежки.
            </p>

            {/* Action card */}
            <div
              className="action-card"
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 0 1px rgba(124,106,255,0.1), 0 32px 64px rgba(0,0,0,0.5), 0 0 80px rgba(124,106,255,0.1), inset 0 1px 0 rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 0 1px rgba(124,106,255,0.1), 0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)";
              }}
              style={{
                marginTop: 48,
                background: "var(--surface)",
                border: "1px solid var(--border-bright)",
                borderRadius: 24,
                padding: 32,
                maxWidth: 440,
                marginLeft: "auto",
                marginRight: "auto",
                boxShadow:
                  "0 0 0 1px rgba(124,106,255,0.1), 0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
                animation: "fadeInUp 0.8s ease 0.8s both",
                transition: "all 0.4s ease",
              }}
            >
              <button
                type="button"
                onClick={handleCreateRoom}
                style={{
                  width: "100%",
                  height: 52,
                  background:
                    "linear-gradient(135deg, var(--accent) 0%, #6d28d9 100%)",
                  borderRadius: 14,
                  border: "none",
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 500,
                  fontSize: 15,
                  color: "#fff",
                  cursor: "pointer",
                  boxShadow:
                    "0 4px 24px rgba(124,106,255,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  transition:
                    "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(124,106,255,0.6), inset 0 1px 0 rgba(255,255,255,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 24px rgba(124,106,255,0.4), inset 0 1px 0 rgba(255,255,255,0.15)";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(1px) scale(0.99)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                  }}
                >
                  ☎
                </span>
                Создать звонок
                <span
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 18,
                  }}
                >
                  →
                </span>
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  margin: "20px 0",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: "var(--border)",
                  }}
                />
                <span
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 400,
                    fontSize: 12,
                    color: "var(--text-muted)",
                  }}
                >
                  или
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: "var(--border)",
                  }}
                />
              </div>

              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                  placeholder="Код комнаты..."
                  style={{
                    width: "100%",
                    height: 52,
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    padding: "0 16px",
                    paddingRight: 90,
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 400,
                    fontSize: 15,
                    color: "var(--text)",
                    outline: "none",
                    caretColor: "var(--accent)",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--accent)";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(124,106,255,0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={handleJoin}
                  disabled={!joinCode.trim()}
                  style={{
                    position: "absolute",
                    right: 8,
                    background: "var(--surface)",
                    border: "1px solid var(--border-bright)",
                    borderRadius: 10,
                    padding: "6px 14px",
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 500,
                    fontSize: 13,
                    color: "var(--text)",
                    cursor: joinCode.trim() ? "pointer" : "not-allowed",
                    opacity: joinCode.trim() ? 1 : 0.5,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (joinCode.trim()) {
                      e.currentTarget.style.background = "var(--accent)";
                      e.currentTarget.style.borderColor = "transparent";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--surface)";
                    e.currentTarget.style.borderColor =
                      "var(--border-bright)";
                  }}
                >
                  Войти
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          style={{
            marginTop: 120,
            padding: "0 24px 80px",
            maxWidth: 1100,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 36,
              textAlign: "center",
              color: "var(--text)",
              marginBottom: 8,
            }}
          >
            Почему NocaNet?
          </h2>
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 300,
              fontSize: 16,
              color: "var(--text-muted)",
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            Безопасность и свобода в каждом звонке
          </p>

          <div
            className="features-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                icon: "🔐",
                title: "E2E Шифрование",
                text: "Ключи только на ваших устройствах. Никто не может прослушать.",
                iconBg: "rgba(16,185,129,0.1)",
                iconBorder: "rgba(16,185,129,0.2)",
                hoverBorder: "rgba(16,185,129,0.3)",
              },
              {
                icon: "🕵️",
                title: "Ноль логов",
                text: "Мы не знаем кто вы. Нет аккаунтов, нет истории, нет следов.",
                iconBg: "rgba(124,106,255,0.1)",
                iconBorder: "rgba(124,106,255,0.2)",
                hoverBorder: "rgba(124,106,255,0.3)",
              },
              {
                icon: "🌍",
                title: "Без границ",
                text: "Работает в России, Иране, Китае и везде где есть интернет.",
                iconBg: "rgba(6,182,212,0.1)",
                iconBorder: "rgba(6,182,212,0.2)",
                hoverBorder: "rgba(6,182,212,0.3)",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="feature-card"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 20,
                  padding: 28,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = card.hoverBorder;
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: card.iconBg,
                    border: `1px solid ${card.iconBorder}`,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    marginBottom: 16,
                  }}
                >
                  {card.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 800,
                    fontSize: 18,
                    color: "var(--text)",
                    marginBottom: 8,
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 300,
                    fontSize: 14,
                    color: "var(--text-muted)",
                    lineHeight: 1.5,
                  }}
                >
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <footer
          style={{
            padding: 40,
            borderTop: "1px solid var(--border)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 300,
              fontSize: 13,
              color: "var(--text-muted)",
            }}
          >
            NocaNet © 2026 · Сделано с ♥ · Звони свободно
          </p>
        </footer>
      </main>

    </>
  );
}
