"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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
    ) => { dispose: () => void };
  }
}

export default function RoomPage() {
  const params = useParams();
  const name = typeof params.name === "string" ? params.name : "";
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");

  useEffect(() => {
    if (!name) return;

    let api: { dispose: () => void } | null = null;
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
        },
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
  }, [name]);

  function handleCopyLink() {
    if (typeof window === "undefined") return;
    window.navigator.clipboard.writeText(window.location.href);
    setCopyStatus("copied");
    setTimeout(() => setCopyStatus("idle"), 2000);
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#0f0f0f] text-white">
      <header className="flex h-12 shrink-0 items-center justify-between gap-4 border-b border-neutral-700/80 bg-[#0f0f0f] px-4">
        <span className="text-sm font-semibold text-white">NocaNet</span>
        <span className="flex-1 truncate text-center text-sm text-neutral-300">
          {name || "—"}
        </span>
        <button
          type="button"
          onClick={handleCopyLink}
          className="shrink-0 rounded-lg bg-neutral-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-neutral-600"
        >
          {copyStatus === "copied" ? "Скопировано!" : "Скопировать ссылку"}
        </button>
      </header>
      <div
        id="jitsi-container"
        style={{ width: "100%", height: "calc(100vh - 48px)" }}
      />
    </div>
  );
}
