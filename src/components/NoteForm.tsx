import { useState } from "react";
import { useDB } from "../hooks/ApiHooks";

interface NoteFormProps {
  onFormSubmit: (date: { title: string; description: string }) => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ onFormSubmit }) => {
  const { postNote } = useDB();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // send data to database
    if (description === "") {
      return "description cant be empty";
    } else {
      try {
        const data = await postNote(title, description);
        console.log(data);
        // send form data to parent
        onFormSubmit({ title, description });
        // clear input after submission
        setTitle("");
        setDescription("");
      } catch (error) {
        console.log("error: ", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 text-black">
      <div className="bg-white p-5 rounded-md shadow-lg w-1/2">
        <h2 className="font-bold">Add a new note</h2>
        <div>
          <form onSubmit={handleSubmit}>
            <fieldset>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                name="title"
                onChange={(e) => setTitle(e.target.value)}
              />
              <label htmlFor="description">Description:</label>
              <input
                type="text"
                name="description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </fieldset>
            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoteForm;
