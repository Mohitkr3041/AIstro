const BirthDetails = require("../models/birth.model");

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^\d{2}:\d{2}$/;

const validateBirthDetails = ({ name, dob, tob, place }) => {
  const cleaned = {
    name: typeof name === "string" ? name.trim() : "",
    dob: typeof dob === "string" ? dob.trim() : "",
    tob: typeof tob === "string" ? tob.trim() : "",
    place: typeof place === "string" ? place.trim() : "",
  };

  if (cleaned.name.length < 2) {
    return { message: "Name must be at least 2 characters long" };
  }

  if (!dateRegex.test(cleaned.dob) || Number.isNaN(Date.parse(cleaned.dob))) {
    return { message: "Please enter a valid date of birth" };
  }

  if (new Date(cleaned.dob) > new Date()) {
    return { message: "Date of birth cannot be in the future" };
  }

  const [hours, minutes] = cleaned.tob.split(":").map(Number);

  if (!timeRegex.test(cleaned.tob) || hours > 23 || minutes > 59) {
    return { message: "Please enter a valid time of birth" };
  }

  if (cleaned.place.length < 2) {
    return { message: "Place of birth must be at least 2 characters long" };
  }

  return { value: cleaned };
};

const saveBirthDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const validation = validateBirthDetails(req.body);

    if (validation.message) {
      return res.status(400).json({ message: validation.message });
    }

    const { name, dob, tob, place } = validation.value;

    let birth = await BirthDetails.findOne({ userId });

    if (birth) {
      birth.name = name;
      birth.dob = dob;
      birth.tob = tob;
      birth.place = place;
      await birth.save();
    } else {
      birth = await BirthDetails.create({
        userId,
        name,
        dob,
        tob,
        place,
      });
    }

    res.status(200).json({
      message: "Birth details saved successfully",
      data: birth,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyBirthDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const birth = await BirthDetails.findOne({ userId });

    res.status(200).json({
      message: "Birth details fetched successfully",
      data: birth || null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveBirthDetails,
  getMyBirthDetails,
};
