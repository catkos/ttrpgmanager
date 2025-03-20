import { useState, useRef } from "react";
import { useGPT } from "../hooks/ApiHooks";

const Transcription = () => {
  const [transcription, setTranscription] = useState("");
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const isRecording = useRef(false);
  const { postGPT } = useGPT();

  const startRecording = async () => {
    isRecording.current = true;
    startNewRecording();
  };

  const startNewRecording = async () => {
    if (!isRecording.current) return;

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
        setTranscription((prev) => prev + response.data.text + " ");

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

  return (
    <div>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <p>{transcription}</p>
    </div>
  );
};

export default Transcription;
