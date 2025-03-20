import { useState, useRef } from "react";
import axios from "axios";

function App() {
  const [transcription, setTranscription] = useState("");
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  // do it ONCE
  //*
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });

      const formData = new FormData();

      formData.append("audio", audioBlob, "recording.webm");

      try {
        const response = await axios.post(
          "http://localhost:3000/gpt/transcribe",

          formData,

          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        setTranscription(response.data.text);
      } catch (error) {
        console.error("Error sending audio:", error);
      }

      audioChunks.current = [];
    };

    mediaRecorder.current.start();
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
  };
  //

  return (
    <div>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <p>{transcription}</p>
    </div>
  );
}

export default App;
