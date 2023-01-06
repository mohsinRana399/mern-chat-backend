const errorCaught = (res, error) => {
  console.log("There was an error", error);
  return res.status(500).json({ message: error.message });
};

module.exports = errorCaught;
