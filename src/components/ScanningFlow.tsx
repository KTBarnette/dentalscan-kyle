"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Camera, RefreshCw, CheckCircle2 } from "lucide-react";

/**
 * CHALLENGE: SCAN ENHANCEMENT
 * 
 * Your goal is to improve the User Experience of the Scanning Flow.
 * 1. Implement a Visual Guidance Overlay (e.g., a circle or mouth outline) on the video feed.
 * 2. Add real-time feedback to the user (e.g., "Face not centered", "Move closer").
 * 3. Ensure the UI feels premium and responsive.
 */

export default function ScanningFlow() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [camReady, setCamReady] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [message, setMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messageStatus, setMessageStatus] = useState<"idle" | "success" | "error">("idle");
  const guardrailState: "good" | "warning" | "bad" = camReady ? "good" : "warning";
  const guardrailBorderColor =
    guardrailState === "good"
      ? "border-green-400"
      : guardrailState === "warning"
        ? "border-yellow-400"
        : "border-red-500";
  const guardrailScaleClass = guardrailState === "good" ? "scale-100" : "scale-95";
  const guardrailOuterRingClass =
    guardrailState === "good"
      ? "scale-105 opacity-70 border-green-300/70"
      : "scale-100 opacity-0 border-transparent";
  const guardrailInstructionText =
    guardrailState === "good"
      ? "Hold steady — capturing soon"
      : guardrailState === "warning"
        ? "Center your face and hold steady"
        : "Move closer if your face looks small, or move farther and center if it is cropped";

  const VIEWS = [
    { label: "Front View", instruction: "Smile and look straight at the camera." },
    { label: "Left View", instruction: "Turn your head to the left." },
    { label: "Right View", instruction: "Turn your head to the right." },
    { label: "Upper Teeth", instruction: "Tilt your head back and open wide." },
    { label: "Lower Teeth", instruction: "Tilt your head down and open wide." },
  ];

  // Initialize Camera
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCamReady(true);
        }
      } catch (err) {
        console.error("Camera access denied", err);
      }
    }
    startCamera();
  }, []);

  const handleCapture = useCallback(() => {
    // Boilerplate logic for capturing a frame from the video feed
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setCapturedImages((prev) => [...prev, dataUrl]);
      setCurrentStep((prev) => prev + 1);
    }
  }, []);

  const handleSendMessage = useCallback(async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isSendingMessage) {
      return;
    }

    setIsSendingMessage(true);
    setMessageStatus("idle");

    try {
      const response = await fetch("/api/messaging", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: trimmedMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setMessage("");
      setMessageStatus("success");
    } catch (error) {
      console.error("Failed to send message", error);
      setMessageStatus("error");
    } finally {
      setIsSendingMessage(false);
    }
  }, [isSendingMessage, message]);

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white">
      {/* Header */}
      <div className="p-4 w-full bg-zinc-900 border-b border-zinc-800 flex justify-between">
        <h1 className="font-bold text-blue-400">DentalScan AI</h1>
        <span className="text-xs text-zinc-500">Step {currentStep + 1}/5</span>
      </div>

      {/* Main Viewport */}
      <div className="relative w-full max-w-md aspect-[3/4] bg-zinc-950 overflow-hidden flex items-center justify-center">
        {currentStep < 5 ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover grayscale opacity-80" 
            />
            
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div
                className={`relative h-52 w-52 sm:h-60 sm:w-60 md:h-72 md:w-72 rounded-full ${guardrailScaleClass} transition-all duration-300`}
              >
                <div className="absolute inset-0 rounded-full shadow-[0_0_0_9999px_rgba(0,0,0,0.3)]" />
                <div
                  className={`absolute -inset-2 rounded-full border ${guardrailOuterRingClass} transition-all duration-500 ease-out`}
                />
                <div
                  className={`absolute inset-0 rounded-full border-4 ${guardrailBorderColor} opacity-80`}
                />
              </div>
            </div>

            <div className="absolute bottom-24 left-0 right-0 text-center pointer-events-none">
              <p className="text-white text-sm opacity-80 transition-all duration-300">
                {guardrailInstructionText}
              </p>
            </div>

            {/* Instruction Overlay */}
            <div className="absolute bottom-10 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent text-center">
              <p className="text-sm font-medium">{VIEWS[currentStep].instruction}</p>
            </div>
          </>
        ) : (
          <div className="text-center p-10">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold">Scan Complete</h2>
            <p className="text-zinc-400 mt-2">Uploading results...</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-10 w-full flex justify-center">
        {currentStep < 5 && (
          <button
            onClick={handleCapture}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-90 transition-transform"
          >
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
               <Camera className="text-black" />
            </div>
          </button>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 p-4 overflow-x-auto w-full">
        {VIEWS.map((v, i) => (
          <div 
            key={i} 
            className={`w-16 h-20 rounded border-2 shrink-0 ${i === currentStep ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-800'}`}
          >
            {capturedImages[i] ? (
               <img src={capturedImages[i]} className="w-full h-full object-cover" />
            ) : (
               <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-700">{i+1}</div>
            )}
          </div>
        ))}
      </div>

      <div className="w-full max-w-md px-4 pb-8">
        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
          <p className="text-sm font-medium mb-2">Quick Message</p>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Send a message to the clinic"
            rows={3}
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 p-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              onClick={handleSendMessage}
              disabled={isSendingMessage || message.trim().length === 0}
              className="rounded-md border border-blue-500 bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSendingMessage ? "Sending..." : "Send"}
            </button>
            {messageStatus === "success" && (
              <span className="text-xs text-green-400">Message sent</span>
            )}
            {messageStatus === "error" && (
              <span className="text-xs text-red-400">Unable to send. Try again.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
