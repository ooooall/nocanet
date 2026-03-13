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
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#0f0f0f] text-white">
      <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-neutral-700/80 bg-[#0f0f0f] px-4">
        <span className="flex items-center gap-2 text-sm font-semibold text-white">
          NocaNet
          <span className="flex items-center gap-1.5 text-xs font-normal text-emerald-400">
            <span aria-hidden>🔒</span>
            E2E Зашифровано
          </span>
          {password && (
            <span className="flex items-center gap-1.5 text-xs font-normal text-amber-400">
              <span aria-hidden>🔐</span>
              Защищено паролем
            </span>
          )}
        </span>
        <span className="flex-1 truncate text-center text-sm text-neutral-300">
          {name || "—"}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={handleInvite}
              className="rounded-lg bg-neutral-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-neutral-600"
              title="Пароль отправьте другу отдельно!"
            >
              Пригласить
            </button>
            {inviteTooltip && (
              <span className="absolute left-1/2 top-full z-20 mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-neutral-800 px-2 py-1 text-[10px] text-neutral-300 shadow-lg">
                Пароль отправьте другу отдельно!
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            className="rounded-lg bg-neutral-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-neutral-600"
          >
            {copyStatus === "copied" ? "Скопировано!" : "Скопировать ссылку"}
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
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#0f0f0f] text-white">
      <header className="flex h-12 shrink-0 items-center justify-between gap-4 border-b border-neutral-700/80 bg-[#0f0f0f] px-4">
        <span className="text-sm font-semibold text-white">NocaNet</span>
        <span className="flex-1 text-center text-sm text-neutral-400">
          Загрузка...
        </span>
        <div className="w-24" />
      </header>
      <div
        className="flex flex-1 items-center justify-center"
        style={{ height: "calc(100vh - 48px)" }}
      >
        <span className="text-neutral-500">Подключение к комнате...</span>
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
