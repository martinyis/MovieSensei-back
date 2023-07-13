export const validate = async (req, res, next) => {
  try {
    const {
      quantity,
      lowestYear,
      highestYear,
      lowestRate,
      highestRate,
      description,
    } = req.body;
    const errors = [];

    if (quantity > 10) {
      errors.push("quantity should not be more than 10");
    }
    if (lowestYear < 1900) {
      errors.push("lowest year should not be less than 1000");
    }
    if (highestYear > new Date().getFullYear()) {
      errors.push("highest year should not be higher than the current year");
    }
    if (lowestRate < 0) {
      errors.push("lowest rate should not be less than 0");
    }
    if (highestRate > 10) {
      errors.push("highest rate should not be higher than 10");
    }
    if (description.length > 400) {
      errors.push("description should not be more than 400 characters");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        status: "fail",
        message: errors.join(", "),
      });
    }

    next();
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
