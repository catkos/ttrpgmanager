import axios from "axios";
import { useCallback } from "react";

// TODO: change url when building to production
// https://ttrpgmanager-backend.vercel.app
// http://localhost:3000
const url = "http://localhost:3000";
const urldb = "/db";
const urlgpt = "/gpt";

const useDB = () => {
  //save note to database
  const postNote = async (
    title: string,
    description: string
  ): Promise<string> => {
    const options: RequestInit = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: title, description: description }),
    };

    try {
      const response = await fetch(url + urldb + "/create", options);

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const data = await response.json();

      console.log(data);

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };

  // delete note from database
  const deleteNote = async (id: string) => {
    try {
      const response = await axios.delete(url + urldb + "/delete/" + id, {
        headers: { "Content-Type": "application/json" },
      });

      return response;
    } catch (e) {
      console.error("API Error:", e);
      throw e;
    }
  };

  //get all documents from wanted collection
  const getNotes = useCallback(async (collectionName: string) => {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(
        url + urldb + "/get/?name=" + collectionName,
        options
      );

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const data = await response.json();

      console.log(data);

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }, []);

  return { postNote, deleteNote, getNotes };
};

const useGPT = () => {
  // send audio file in a formData to gpt backend
  const postGPT = async (formData: FormData) => {
    try {
      const response = await axios.post(
        url + urlgpt + "/transcribe",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };

  return { postGPT };
};

export { useDB, useGPT };
