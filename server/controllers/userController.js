const User = require("../models/User.model");

const addUserSupplement = async (req, res) => {
  try {
    const { _id } = req.body; // Change supplementId to _id
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.personal_supplements.includes(_id)) {
      user.personal_supplements.push(_id);
      await user.save();
    }
    res.status(200).json({ message: "Supplement added to your list." });
  } catch (error) {
    console.error("Error adding supplement:", error); // Log the error for debugging
    res.status(500).json({ message: "Failed to add supplement to user." });
  }
};

module.exports = {
  addUserSupplement,
};
