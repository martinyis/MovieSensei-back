import User from "./../models/userModel.js";

//getCredits
export const getCredits = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      status: "success",
      credits: user.credits,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

//decsreseCreditsby one
export const decreaseCredits = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.credits = user.credits - 1;
    await user.save();
    res.status(200).json({
      status: "success",
      credits: user.credits,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
