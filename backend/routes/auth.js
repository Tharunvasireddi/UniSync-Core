const express = require("express");
const authRouter = express.Router();
const user = require("../models/user");

authRouter.post("/login", async (req, res) => {
  try {
    console.log("login request started");
    const { emailId, name, photoUrl } = req.body;

    console.log(photoUrl);

    // check if already there then find and return the usermodel
    const userExsists = await user.findOne({ emailId: emailId });
    console.log(userExsists);
    if (userExsists) {
      console.log("user found in db");
      if (userExsists.profileComplete == false) {
        console.log("profile is pending");
        return res.json({
          message: "pending_profile",
          "user": userExsists,
        });
      } else {
        res.json({
          message: "sucess",
          user: userExsists,
        });
      }
    } else {
      // means he is a new user
      // now ask the user for additional inofrmation and store to mongodb and return
      const newUser = new user(req.body);
      console.log(newUser);
      newUser.profileComplete = false;
      console.log(newUser);
      await newUser.save();
      return res.json({
        message: "pending_profile",
        user: newUser,
      });
    }
  } catch (e) {}
});

authRouter.patch("/complete-profile", async (req, res) => {
  try {
    const { emailId, name, collegeName, semester, year, about } = req.body;

    console.log(req.body);

    const updatedUser = await user.findOneAndUpdate(
      { emailId },
      {
        name,
        collegeName,
        year,
        semester,
        about,
        profileComplete: true,
      },
      { new: true }
    );

    console.log(updatedUser);

    return res.json({
      user: updatedUser,
    });
  } catch (e) {
    console.log(emailId);
    return res.status(500).json({ message: "update failed" + e });
  }
});

authRouter.get("/user-details", async (req,res) => {
    try{
        const{emailId} = req.body;
        const getUser = user.findOne({
            emailId
        });
        res.json({
            "user": getUser
        });
    }catch(e){
        return res.status(500).json({ message: "update failed" + e });

    }
});


module.exports = authRouter;
