import { useState } from "react";
import NewCampaignForm from "../components/NewCampaignForm";
import { useNavigate } from "react-router";

const Home = () => {
  const [isCampaignForm, setIsCampaignForm] = useState<boolean>(false);
  const [campaignId, setCampaignId] = useState<string>("");

  const navigate = useNavigate();

  console.log(isCampaignForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/main", { state: { campaignId } });
  };

  return (
    <article className="bg-black h-screen ">
      <section className="flex justify-center items-center h-full">
        <div className="rounded-md text-black p-10 min-h-[400px]">
          <h1 className="text-white pb-5">Welcome to TTRPG Manager!</h1>
          <div className="flex flex-col justify-center items-center bg-white rounded-md py-5">
            {isCampaignForm ? (
              <NewCampaignForm />
            ) : (
              <form className="pt-5 flex flex-col gap-5">
                <fieldset className="flex flex-col gap-5">
                  <div className="flex flex-col">
                    <label htmlFor="title" className="uppercase font-bold">
                      Campaign ID
                    </label>
                    <input
                      type="text"
                      name="title"
                      onChange={(e) => setCampaignId(e.target.value)}
                      className="bg-white text-black p-2 rounded-md border-black border-2"
                    />
                  </div>
                </fieldset>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="cursor-pointer uppercase text-green hover:text-white font-bold rounded-full p-2 w-full text-center border-2 border-green hover:bg-green transition duration-300"
                >
                  Continue
                </button>
              </form>
            )}

            <p className="pt-5 font-bold">- OR -</p>
            <button
              onClick={() => setIsCampaignForm(!isCampaignForm)}
              className="cursor-pointer uppercase text-green border-b-2 border-white hover:border-green font-bold transition duration-300 p-5"
            >
              {isCampaignForm ? "Continue Campaign" : "New Campaign"}
            </button>
          </div>
        </div>
      </section>
    </article>
  );
};

export default Home;
