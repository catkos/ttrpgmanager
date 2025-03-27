import { useState } from "react";
import { useDB } from "../hooks/ApiHooks";
import { useNavigate } from "react-router";

/*
interface NoteFormProps {
  onFormSubmit: (date: { name: string; game: string; gameId: string }) => void;
}*/

const NewCampaignForm = () => {
  const { postNewCampaign } = useDB();
  const [campaignName, setCampaignName] = useState<string>("");
  const [gameName, setGameName] = useState<string>("");
  const [campaignId, setCampaignId] = useState<string>("");
  const [newCampaign, setNewCampaign] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleNewCampaign = async (e: React.FormEvent) => {
    e.preventDefault();

    // if a new campaign has been generated, navigate to main hub
    if (newCampaign) {
      console.log("yes");
      navigate("/main", { state: { campaignId, gameName, campaignName } });
    } else {
      try {
        // send data to database
        const data = await postNewCampaign(campaignName, gameName);
        console.log(data);
        setCampaignId(data);
        setNewCampaign(true);
        // send form data to parent
        // onFormSubmit({ name, game, gameId });

        /*
          // clear input after submission
          setName("");
          setGame("");
          */
      } catch (error) {
        console.log("error: ", error);
      }
    }
  };

  return (
    <div>
      <form className="pt-5 flex flex-col gap-5">
        {newCampaign ? (
          <div className="">
            <p>Here is your Campaign ID. Please don't lose it:</p>
            <button
              onClick={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText(campaignId);
              }}
              className="font-bold text-xl cursor-pointer hover:text-red transition duration-300"
            >
              {campaignId}
            </button>
          </div>
        ) : (
          <fieldset className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label htmlFor="campaignName" className="uppercase font-bold">
                Campaign Name
              </label>
              <input
                type="text"
                name="campaignName"
                onChange={(e) => setCampaignName(e.target.value)}
                className="bg-white text-black p-2 rounded-md border-black border-2"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="gameName" className="uppercase font-bold">
                Game
              </label>
              <input
                type="text"
                name="gameName"
                placeholder="Pathfinder, Dungeons and Dragons (5E), etc..."
                onChange={(e) => setGameName(e.target.value)}
                className="bg-white text-black p-2 rounded-md border-black border-2"
              />
            </div>
          </fieldset>
        )}
        <button
          onClick={handleNewCampaign}
          className="cursor-pointer uppercase text-green hover:text-white font-bold rounded-full p-2 w-full text-center border-2 border-green hover:bg-green transition duration-300"
        >
          {newCampaign ? "Start your Campaign!" : "Create a new Campaign"}
        </button>
      </form>
    </div>
  );
};

export default NewCampaignForm;
