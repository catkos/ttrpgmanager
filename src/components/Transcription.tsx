import React, { useState, useRef, useEffect } from "react";
import { useDB, useGPT } from "../hooks/ApiHooks";

interface TranscriptionProps {
  handleRecording: boolean;
  campaignId: string;
}

interface TranscriptionEntry {
  id: string;
  log: {
    duration: number;
    language: string;
    task: string;
    text: string;
  };
  campaignId: string;
  date: {
    seconds: number;
    nanoseconds: number;
  };
}

const Transcription: React.FC<TranscriptionProps> = ({
  handleRecording,
  campaignId,
}) => {
  const [transcriptions, setTranscriptions] = useState<TranscriptionEntry[]>(
    []
  );
  const [newTranscription, setNewTranscription] = useState<boolean>(false);

  const { getNotes } = useDB();

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
        formData.append("campaignId", campaignId);

        const response = await postGPT(formData);

        // if transcription has been received, refresh transcription log
        if (response) {
          console.log("ayyy");
          setNewTranscription(true);
        }

        // add text
        /*
        setTranscriptions((prev) => [
          ...prev,
          {
            text: response.data.text,
            date: new Date(response.data.date),
          },
        ]);*/

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

  // render transription logs
  const renderTranscriptions = (transcriptions: TranscriptionEntry[]) => {
    return transcriptions.map((entry, index) => (
      <div key={index} className="border-l-2 pl-2 border-green">
        <p className="text-xs">
          {new Date(entry.date.seconds * 1000).toLocaleString("fi-FI", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })}
        </p>
        <p className="bg-white">{entry.log.text}</p>
      </div>
    ));
  };

  // get transcription logs, refresh when new transcription has been sent
  useEffect(() => {
    const handleNotes = async () => {
      try {
        const data = await getNotes("gpt", campaignId);
        setTranscriptions(data);
        setNewTranscription(false);
      } catch (e) {
        console.log(e);
      }
    };
    handleNotes();
  }, [getNotes, campaignId, newTranscription]);

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
      {renderTranscriptions(transcriptions)}
    </div>
  );
};

export default Transcription;
