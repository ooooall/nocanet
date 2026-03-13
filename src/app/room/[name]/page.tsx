"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

declare global {
  interface Window {
    JitsiMeetExternalAPI: new (
      domain: string,
      options: {
        roomName: string;
        parentNode: HTMLElement | null;
        width: string;
        height: string;
        configOverwrite?: object;
        interfaceConfigOverwrite?: object;
      }
    ) => JitsiApi;
  }
}

interface JitsiApi {
  dispose: () => void;
  addEventListener: (event: string, handler: () => void) => void;
  executeCommand: (command: string, ...args: unknown[]) => void;
}

function RoomPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const name = typeof params.name === "string" ? params.name : "";
  const password = searchParams.get("pwd");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");
  const [inviteTooltip, setInviteTooltip] = useState(false);

  useEffect(() => {
    if (!name) return;

    let api: JitsiApi | null = null;
    let cancelled = false;
    let script: HTMLScriptElement | null = null;

    function initJitsi() {
      if (cancelled) return;
      const container = document.getElementById("jitsi-container");
      if (!container) return;
      api = new window.JitsiMeetExternalAPI("meet.jit.si", {
        roomName: name,
        parentNode: container,
        width: "100%",
        height: "100%",
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_POWERED_BY: false,
          SHOW_PROMOTIONAL_CLOSE_PAGE: false,
          TOOLBAR_BUTTONS: [
            "microphone",
            "camera",
            "closedcaptions",
            "desktop",
            "fullscreen",
            "fodeviceselection",
            "hangup",
            "chat",
            "settings",
            "raisehand",
            "videoquality",
            "tileview",
          ],
          DISPLAY_WELCOME_PAGE_CONTENT: false,
          DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableThirdPartyRequests: true,
          disableAP: true,
          password: password || undefined,
          e2eping: { enabled: false },
          p2p: {
            enabled: true,
            stunServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
            ],
          },
          enableLayerSuspension: true,
          disableSimulcast: false,
        },
      });
      api.addEventListener("videoConferenceJoined", () => {
        api?.executeCommand("toggleE2EE", true);
        if (password) api?.executeCommand("password", password);
      });
    }

    if (typeof window !== "undefined" && window.JitsiMeetExternalAPI) {
      initJitsi();
    } else {
      script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.onload = () => initJitsi();
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      if (api) api.dispose();
      if (script?.parentNode) script.parentNode.removeChild(script);
    };
  }, [name, password]);

  function handleCopyLink() {
    if (typeof window === "undefined") return;
    window.navigator.clipboard.writeText(window.location.href);
    setCopyStatus("copied");
    setTimeout(() => setCopyStatus("idle"), 2000);
  }

  function handleInvite() {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.delete("pwd");
    window.navigator.clipboard.writeText(url.toString());
    setInviteTooltip(true);
    setTimeout(() => setInviteTooltip(false), 3000);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <header
        style={{
          height: 48,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "0 16px",
          background: "rgba(5,5,8,0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background:
                "linear-gradient(135deg, var(--accent) 0%, var(--accent3) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 12,
              color: "#fff",
            }}
          >
            N
          </div>
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 14,
              color: "var(--text)",
            }}
          >
            NocaNet
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flex: 1,
            justifyContent: "center",
            minWidth: 0,
          }}
        >
          <span style={{ color: "var(--green)", fontSize: 12 }}>🔒</span>
          <span
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 500,
              fontSize: 13,
              color: "var(--text-muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {name || "—"}
          </span>
          <span
            style={{
              fontSize: 10,
              color: "var(--green)",
              border: "1px solid rgba(16,185,129,0.3)",
              background: "rgba(16,185,129,0.08)",
              borderRadius: 4,
              padding: "2px 6px",
            }}
          >
            E2E
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={handleInvite}
              style={{
                background: "var(--surface2)",
                border: "1px solid var(--border-bright)",
                borderRadius: 8,
                padding: "6px 14px",
                fontFamily: "DM Sans, sans-serif",
                fontSize: 12,
                color: "var(--text)",
                cursor: "pointer",
              }}
              title="Пароль отправьте другу отдельно!"
            >
              Пригласить
            </button>
            {inviteTooltip && (
              <span
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "100%",
                  marginTop: 4,
                  transform: "translateX(-50%)",
                  whiteSpace: "nowrap",
                  zIndex: 20,
                  borderRadius: 6,
                  background: "var(--surface2)",
                  padding: "4px 8px",
                  fontSize: 10,
                  color: "var(--text-muted)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                }}
              >
                Пароль отправьте другу отдельно!
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            style={{
              background: "var(--surface2)",
              border: "1px solid var(--border-bright)",
              borderRadius: 8,
              padding: "6px 14px",
              fontFamily: "DM Sans, sans-serif",
              fontSize: 12,
              color: copyStatus === "copied" ? "var(--green)" : "var(--text)",
              cursor: "pointer",
              transition: "color 0.2s ease",
            }}
          >
            {copyStatus === "copied"
              ? "✓ Скопировано!"
              : "⬡ Скопировать ссылку"}
          </button>
        </div>
      </header>

      <div
        id="jitsi-container"
        style={{ width: "100%", height: "calc(100vh - 48px)" }}
      />
    </div>
  );
}

function RoomPageFallback() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <header
        style={{
          height: 48,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: 14,
          }}
        >
          NocaNet
        </span>
        <span
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: 13,
            color: "var(--text-muted)",
          }}
        >
          Загрузка...
        </span>
        <div style={{ width: 120 }} />
      </header>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 48px)",
        }}
      >
        <span style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Подключение к комнате...
        </span>
      </div>
    </div>
  );
}

export default function RoomPage() {
  return (
    <Suspense fallback={<RoomPageFallback />}>
      <RoomPageContent />
    </Suspense>
  );
}
