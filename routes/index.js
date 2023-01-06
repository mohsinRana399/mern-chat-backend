const router = require("express").Router();

router.get("/", (req, res) => {
  res.status(200).send("Chat server online...");
});

router.use("/auth", require("./auth"));
router.use("/conversations", require("./conversations"));
router.use("/messages", require("./messages"));

module.exports = router;
