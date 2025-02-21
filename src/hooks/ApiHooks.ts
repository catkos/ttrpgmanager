import { useCallback } from "react";

// TODO: change url when building to production
// https://ttrpgmanager-backend.vercel.app
// http://localhost:3000
const url = "https://ttrpgmanager-backend.vercel.app";
const urldb = "/db";

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

  return { postNote, getNotes };
};

export { useDB };
