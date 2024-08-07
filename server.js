const express = require("express");
const cors = require("cors");
const middleware = require("./middleware");

const app = express();
const port = 5002;

app.use(cors());

app.get("/api/health", (req, res) => {
  return res.send("OK");
});

app.use(middleware.decodeToken);

app.get("/api/profile", (req, res) => {
  console.log("api calling...");
  return res.json({ email: req.user.email, userId: req.user.user_id });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
