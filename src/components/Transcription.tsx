import React, { useState, useRef, useEffect } from "react";
import { useGPT } from "../hooks/ApiHooks";

interface TranscriptionProps {
  handleRecording: boolean;
}

interface TranscriptionEntry {
  text: string;
  date: Date;
}

const Transcription: React.FC<TranscriptionProps> = ({ handleRecording }) => {
  const [transcriptions, setTranscriptions] = useState<TranscriptionEntry[]>(
    []
  );

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const isRecording = useRef(false);
  const { postGPT } = useGPT();

  const scrollRef = useRef<HTMLDivElement>(null);

  const startRecording = async () => {
    isRecording.current = true;
    startNewRecording();
  };

  const startNewRecording = async () => {
    if (!isRecording.current) return;
    if (!handleRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      // empty chunks for new one
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        const response = await postGPT(formData);

        // add text
        setTranscriptions((prev) => [
          ...prev,
          {
            text: response.data.text,
            date: new Date(response.data.date),
          },
        ]);

        if (isRecording.current) {
          setTimeout(startNewRecording, 0); // Aloita uusi tallennus heti edellisen loputtua.
        }
      };

      mediaRecorder.current.start();
      setTimeout(() => {
        if (
          mediaRecorder.current &&
          mediaRecorder.current.state === "recording"
        ) {
          mediaRecorder.current.stop();
        }
      }, 10000); // Stop rec in 10 secs
    } catch (error) {
      console.error("Error starting recording:", error);
      isRecording.current = false; // Stop rec if error
    }
  };

  const stopRecording = () => {
    isRecording.current = false;
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
  };

  // render new log
  const renderTranscription = () => {
    return transcriptions.map((entry, index) => (
      <div key={index} className="border-l-2 pl-2 border-green">
        <p className="text-xs">
          {entry.date.toLocaleString("fi-FI", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })}
        </p>

        <p className="bg-white">{entry.text}</p>
      </div>
    ));
  };

  // handle recording
  useEffect(() => {
    if (handleRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  });

  // scroll to the bottom when new transcription is added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcriptions]);

  return (
    <div
      ref={scrollRef}
      className="grow h-20 px-5 pb-5 overflow-scroll overscroll-contain flex flex-col gap-3"
    >
      {renderTranscription()}
    </div>
  );
};

export default Transcription;
