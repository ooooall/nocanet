"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { ConnectionState } from "livekit-client";

export default function RoomPage() {
  const params = useParams();
  const name = typeof params.name === "string" ? params.name : "";
  const [token, setToken] = useState("");
  const [liveKitUrl, setLiveKitUrl] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [copied, setCopied] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.Disconnected
  );

  async function getToken(roomName: string, user: string) {
    const res = await fetch(
      "/api/token?room=" + encodeURIComponent(roomName) + "&username=" + encodeURIComponent(user)
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Failed to get token");
    setToken(data.token);
    setLiveKitUrl(data.url ?? "");
  }

  function copyLink() {
    if (typeof window === "undefined") return;
    window.navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleJoin() {
    if (!username.trim() || !name) return;
    await getToken(name, username.trim());
    setJoined(true);
  }

  if (!joined) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#050508",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 400,
            background: "#0d0d14",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: 32,
            boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background:
                  "linear-gradient(135deg, #7c6aff 0%, #06b6d4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: 18,
                color: "#fff",
              }}
            >
              N
            </div>
            <span
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: 20,
                color: "#f0f0ff",
              }}
            >
              NocaNet
            </span>
          </div>

          <p
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: "rgba(240,240,255,0.6)",
              marginBottom: 8,
            }}
          >
            Комната:
          </p>
          <p
            style={{
              fontWeight: 700,
              fontSize: 18,
              color: "#f0f0ff",
              marginBottom: 24,
              wordBreak: "break-all",
            }}
          >
            {name || "—"}
          </p>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            placeholder="Ваше имя..."
            style={{
              width: "100%",
              height: 48,
              background: "#13131e",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12,
              padding: "0 16px",
              fontSize: 15,
              color: "#f0f0ff",
              outline: "none",
              marginBottom: 20,
              boxSizing: "border-box",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#7c6aff";
              e.target.style.boxShadow = "0 0 0 3px rgba(124,106,255,0.2)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.06)";
              e.target.style.boxShadow = "none";
            }}
          />

          <button
            type="button"
            onClick={handleJoin}
            disabled={!username.trim()}
            style={{
              width: "100%",
              height: 52,
              background: "linear-gradient(135deg, #7c6aff 0%, #6d28d9 100%)",
              border: "none",
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 600,
              color: "#fff",
              cursor: username.trim() ? "pointer" : "not-allowed",
              opacity: username.trim() ? 1 : 0.5,
              transition: "opacity 0.2s",
            }}
          >
            Войти в звонок
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#050508",
        color: "#f0f0ff",
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
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background:
                "linear-gradient(135deg, #7c6aff 0%, #06b6d4 100%)",
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
              color: "#f0f0ff",
            }}
          >
            NocaNet
          </span>
        </div>

        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 13,
            color: "rgba(240,240,255,0.6)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name || "—"}
        </span>

        <button
          type="button"
          onClick={copyLink}
          style={{
            background: "#13131e",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 8,
            padding: "6px 14px",
            fontSize: 12,
            color: copied ? "#10b981" : "#f0f0ff",
            cursor: "pointer",
            transition: "color 0.2s",
          }}
        >
          {copied ? "Скопировано!" : "Скопировать ссылку"}
        </button>
      </header>

      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        {token && liveKitUrl && (
          <div style={{ position: "absolute", inset: 0 }}>
            <LiveKitRoom
              token={token}
              serverUrl={liveKitUrl}
              connect={true}
              video={false}
              audio={true}
              onConnected={() => setConnectionState(ConnectionState.Connected)}
              onDisconnected={() => {
                setConnectionState(ConnectionState.Disconnected);
                setJoined(false);
              }}
              onError={(error) => console.error("LiveKit error:", error)}
              options={{
                adaptiveStream: true,
                dynacast: true,
                reconnectPolicy: {
                  nextRetryDelayInMs(context) {
                    if (context.retryCount >= 10) return null;
                    return Math.min(
                      1000 * Math.pow(2, context.retryCount),
                      30000
                    );
                  },
                },
              }}
              connectOptions={{
                rtcConfig: {
                  iceTransportPolicy: "all",
                  iceServers: [
                    { urls: "stun:stun.l.google.com:19302" },
                    { urls: "stun:stun1.l.google.com:19302" },
                    {
                      urls: "turn:relay1.expressturn.com:3478",
                      username: "efRISD9BKUBO6BGCAP",
                      credential: "hGnsSLpJGJ5CqrUq",
                    },
                  ],
                },
              }}
            >
              <VideoConference />
              <RoomAudioRenderer />
            </LiveKitRoom>
          </div>
        )}
      </div>
    </div>
  );
}
