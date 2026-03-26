const BirthDetails = require("../models/birth.model");

const saveBirthDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, dob, tob, place } = req.body;

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