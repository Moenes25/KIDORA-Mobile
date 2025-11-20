import Profile from "../models/profile.js";

// CREATE PROFILE
export const createProfileV1 = async (req, res) => {
  try {
    const { username, name, profession, DOB, titleline, about, img } = req.body;

    const exists = await Profile.findOne({ username });
    if (exists) return res.status(400).json({ msg: "Username already used" });

    const profile = await Profile.create({
      username, name, profession, DOB, titleline, about, img
    });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


export const createProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    const exists = await Profile.findOne({ email });
    if (exists) 
      return res.json(exists);  // return existing profile

    const profile = await Profile.create({
      username:username,
      name: "",
      profession: "",
      DOB: "",
      titleline: "",
      about: "",
      img: ""
    });

    res.json(profile);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};



// GET PROFILE BY USERNAME
export const getProfile = async (req, res) => {
  try {
    const p = await Profile.findOne({ email: req.params.email });
    if (!p) return res.status(404).json({ msg: "Profile not found" });
    res.json(p);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const update = await Profile.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true }
    );
    if (!update) return res.status(404).json({ msg: "Profile not found" });
    res.json(update);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
