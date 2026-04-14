import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveBirthDetails } from "../../services/birth.service";

function BirthForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    tob: "",
    place: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const validateForm = () => {
    if (formData.name.trim().length < 2) {
      return "Enter your full name.";
    }

    if (!formData.dob) {
      return "Choose your date of birth.";
    }

    if (new Date(formData.dob) > new Date()) {
      return "Date of birth cannot be in the future.";
    }

    if (!formData.tob) {
      return "Choose your time of birth.";
    }

    if (formData.place.trim().length < 2) {
      return "Enter your place of birth.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await saveBirthDetails({
        name: formData.name.trim(),
        dob: formData.dob,
        tob: formData.tob,
        place: formData.place.trim(),
      });
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save birth details.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-lg border border-white/15 bg-white/10 p-3 text-white placeholder-white/40 outline-none transition focus:border-teal-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-300/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        autoComplete="name"
        className={inputClass}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className={inputClass}
        />

        <input
          type="time"
          name="tob"
          value={formData.tob}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <input
        type="text"
        name="place"
        placeholder="Place of Birth"
        value={formData.place}
        onChange={handleChange}
        autoComplete="address-level2"
        className={inputClass}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-teal-300 py-3 font-semibold text-black transition hover:bg-teal-200 disabled:opacity-70"
      >
        {loading ? "Saving..." : "Save & Continue"}
      </button>
    </form>
  );
}

export default BirthForm;
