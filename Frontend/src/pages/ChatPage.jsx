import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBirthDetails } from "../services/birth.service";
import ChatBox from "../components/chat/ChatBox";

function ChatPage() {
  const navigate = useNavigate();
  const [birthData, setBirthData] = useState(null);
  const [loadingBirth, setLoadingBirth] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBirth = async () => {
      try {
        const res = await getBirthDetails();
        const data = res.data.data;

        if (!data) {
          navigate("/birth");
          return;
        }

        setBirthData(data);
      } catch (loadError) {
        setError(loadError.response?.data?.message || "Could not load birth details.");
      } finally {
        setLoadingBirth(false);
      }
    };

    loadBirth();
  }, [navigate]);

  return (
    <main className="aistro-shell">
      <div className="aistro-container space-y-6 py-6 sm:py-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button onClick={() => navigate("/dashboard")} className="aistro-button-secondary mb-4 px-4 py-2">
              Back to Dashboard
            </button>
            <p className="aistro-kicker">Oracle Chat</p>
            <h1 className="aistro-title mt-2 text-4xl sm:text-5xl">Ask AIstro</h1>
          </div>
          <button onClick={() => navigate("/report")} className="aistro-button-primary">
            View Report
          </button>
        </header>

        {loadingBirth ? (
          <section className="aistro-card grid min-h-[22rem] place-items-center">
            <p className="aistro-muted italic">Opening the oracle...</p>
          </section>
        ) : error ? (
          <section className="aistro-card text-[#ffc1ba]">{error}</section>
        ) : (
          <ChatBox birthData={birthData} />
        )}
      </div>
    </main>
  );
}

export default ChatPage;
