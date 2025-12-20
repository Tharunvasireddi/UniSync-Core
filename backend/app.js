const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const { connectDb } = require("./configs/database");

app.use(express.json());
app.use(cookieParser());

app.get("/" , (req,res) => {
  console.log("yaay hot me");
  res.send("Hello form the server");
});

const authRouter = require("./routes/auth");
app.use("/",authRouter);



connectDb()
  .then(() => {
    console.log("DB connected successfully");
    app.listen(3000,"0.0.0.0", () => {
      console.log("Server listening on port 3000");
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });