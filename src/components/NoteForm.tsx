import { useState } from "react";
import { useDB } from "../hooks/ApiHooks";

interface NoteFormProps {
  onFormSubmit: (date: { title: string; description: string }) => void;
  onClose: () => void;
  campaignId: string;
}

const NoteForm: React.FC<NoteFormProps> = ({
  onFormSubmit,
  onClose,
  campaignId,
}) => {
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
        // TODO: add game ID
        const data = await postNote(title, description, campaignId);
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
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 text-white">
      <div className="bg-black p-10 rounded-md shadow-lg w-1/2 border-2 border-white drop-shadow-xl flex flex-col gap-5">
        <div className="flex justify-between border-b-2 border-white pb-5">
          <h2 className="font-bold uppercase">Add a new note</h2>
          <button onClick={onClose} className="hover:text-red cursor-pointer">
            <svg
              aria-hidden="true"
              fill="none"
              strokeWidth={1.5}
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              height={40}
            >
              <path
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <fieldset className="flex flex-col gap-5">
              <div className="flex flex-col">
                <label htmlFor="title" className="uppercase">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-white text-black p-2 rounded-md w-1/2"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="description" className="uppercase">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-white text-black p-2 rounded-md w-1/2"
                />
              </div>
            </fieldset>
            <button
              type="submit"
              className="cursor-pointer w-40 font-bold rounded-full border-white border-2 hover:bg-white hover:text-black p-2 flex items-center justify-center gap-1 uppercase"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoteForm;
