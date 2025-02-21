import { useEffect, useState } from "react";
import NoteForm from "../components/NoteForm";
import { useDB } from "../hooks/ApiHooks";

const MainHub = () => {
  const { getNotes } = useDB();
  const [addNewNote, setAddNewNote] = useState<boolean>(false);
  const [isNoteFormOpen, setIsNoteFormOpen] = useState<boolean>(false);
  const [noteFormData, setNoteFormData] = useState<
    {
      title: string;
      description: string;
      date: { seconds: number };
    }[]
  >([]);

  /* render the notes */
  const renderNotes = (
    notes: { title: string; description: string; date: { seconds: number } }[]
  ) => {
    return (
      <div className="grid lg:grid-cols-4 lg:gap-4 lg:p-5 divide-black divide-y-4">
        {notes.map((note, i) => {
          const dateObj = new Date(note.date.seconds * 1000);
          const formattedDate =
            dateObj.toLocaleDateString("de-DE") +
            " " +
            dateObj.toLocaleTimeString("de-DE", {
              hour: "2-digit",
              minute: "2-digit",
            });
          return (
            <div
              key={i}
              className="drop-shadow-xl bg-white lg:rounded-md p-5 lg:border-black lg:border-2"
            >
              <div className="flex justify-between items-center">
                <p>{formattedDate}</p>
                {/* TODO: add button functionality - delete */}
                <button className="hover:text-red cursor-pointer">
                  <svg
                    aria-hidden="true"
                    fill="none"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    height={30}
                  >
                    <path
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <h3>{note.title}</h3>
              <p>{note.description}</p>
            </div>
          );
        })}
      </div>
    );
  };

  // handle new note modal
  const handleNewNoteButton = () => {
    setIsNoteFormOpen(!isNoteFormOpen);
  };

  // after new note has added, close modal
  const handleNoteFormSubmit = () => {
    setAddNewNote(true);
    setIsNoteFormOpen(!isNoteFormOpen);
  };

  // get all notes when user has added a new note
  useEffect(() => {
    // get all notes
    const handleNotes = async () => {
      try {
        const data = await getNotes("notes");
        console.log("data:", data);
        setNoteFormData(data);
        //reset add new note to false
        setAddNewNote(false);
      } catch (e) {
        console.log(e);
      }
    };
    handleNotes();
  }, [addNewNote, getNotes]);

  return (
    <article className="">
      {isNoteFormOpen && <NoteForm onFormSubmit={handleNoteFormSubmit} />}
      <div className="flex flex-col md:flex-row bg-black h-full md:h-screen gap-2">
        <section className="flex flex-col w-1/3 flex-grow my-4 ml-4 rounded-md bg-white text-black divide-black divide-y-4">
          <div className="bg-gray-300 p-5 w-full flex flex-col gap-5">
            <h1 className="uppercase">Campaign name</h1>
            <div>
              <p>Start the session to begin recoding!</p>
            </div>
            <button className="cursor-pointer uppercase text-white font-bold rounded-full bg-green p-2 w-full text-center hover:drop-shadow-xl">
              Start session
            </button>
          </div>
          <div className="p-5">
            <h2>Transcription Log:</h2>
            <div></div>
          </div>
        </section>
        {/* NOTES SECTION */}
        <section className="flex flex-col w-full my-4 mr-4 bg-white rounded-md h-full">
          <div className="flex flex-col gap-5 p-5 border-b-4 border-black ">
            <h2 className="uppercase">Notes</h2>
            <button
              onClick={handleNewNoteButton}
              className="cursor-pointer w-40 font-bold rounded-full bg-white border-black border-2 hover:bg-black hover:text-white p-2 flex items-center justify-center gap-1 uppercase"
            >
              <svg
                aria-hidden="true"
                fill="none"
                strokeWidth={1.5}
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                height={25}
              >
                <path
                  d="M12 4.5v15m7.5-7.5h-15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              New note
            </button>
          </div>
          {renderNotes(noteFormData)}
        </section>
      </div>
    </article>
  );
};

export default MainHub;
