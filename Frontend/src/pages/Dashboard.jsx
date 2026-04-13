import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBirthDetails } from "../services/birth.service";
import { generateAstroReport } from "../services/astro.service";
import { logoutUser } from "../services/auth.service";
import Report from "../components/astro/Report";
import ChatBox from "../components/chat/ChatBox";

function Dashboard({ setIsAuthenticated = () => {} }) {
  const navigate = useNavigate();
  const [birthData, setBirthData] = useState(null);
  const [report, setReport] = useState(null);
  const [reportError, setReportError] = useState("");
  const [loadingBirth, setLoadingBirth] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    const fetchBirthDetails = async () => {
      try {
        const res = await getBirthDetails();
        const data = res.data.data;

        if (!data) {
          navigate("/birth");
          return;
        }

        setBirthData(data);
        generateReportData();
      } catch (error) {
        alert(error.response?.data?.message || "Failed to fetch birth details");
      } finally {
        setLoadingBirth(false);
      }
    };

    fetchBirthDetails();
  }, [navigate]);

  const generateReportData = async () => {
    try {
      setLoadingReport(true);
      setReportError("");
      const res = await generateAstroReport();
      setReport(res.data.data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to generate report";

      setReportError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      alert(res.data.message);
      setIsAuthenticated(false);
      navigate("/", { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Logout failed");
    }
  };

  if (loadingBirth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">🔮 AIstro Dashboard</h1>
            <p className="text-gray-300">Your personalized astrology insights</p>
          </div>

          <button
            onClick={handleLogout}
            className="self-start md:self-auto px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow-lg transition"
          >
            Logout
          </button>
        </div>

        {birthData && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Birth Details</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <p><span className="font-semibold">Name:</span> {birthData.name}</p>
              <p><span className="font-semibold">Date of Birth:</span> {birthData.dob}</p>
              <p><span className="font-semibold">Time of Birth:</span> {birthData.tob}</p>
              <p><span className="font-semibold">Place of Birth:</span> {birthData.place}</p>
            </div>
          </div>
        )}

        {loadingReport ? (
          <div className="text-center text-indigo-300 animate-pulse text-lg">
            Generating your astrology report...
          </div>
        ) : reportError ? (
          <div className="bg-red-500/10 border border-red-300/30 rounded-2xl p-6 mb-8 text-center">
            <p className="text-red-100 mb-4">{reportError}</p>
            <button
              onClick={generateReportData}
              className="px-5 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold shadow-lg transition"
            >
              Try Again
            </button>
          </div>
        ) : (
          <Report report={report} />
        )}

        <ChatBox birthData={birthData} />
      </div>
    </div>
  );
}

export default Dashboard;
