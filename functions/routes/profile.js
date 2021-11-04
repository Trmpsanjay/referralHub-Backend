const express = require("express");
const Joi = require("joi");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();

router.get("/", async (req, res) => {
  res.send("Working fine");
});

router.post("/add-profile-details", async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      university,
      graduation_year,
      branch,
      cgpa,
      current_company,
      work_experience,
      job_role,
      resume,
      skills,
      account_type,
    } = req.body;
    // input validation
    const schema = Joi.object({
      name: Joi.string().min(3).required().label("name"),
      email: Joi.string().email().required().min(3).label("email"),
      mobile: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required(),
      university: Joi.string().min(5).required().label("university"),
      graduation_year: Joi.number()
        .min(1900)
        .max(2025)
        .required()
        .label("graduation_year"),
      branch: Joi.string().min(3).required().label("branch"),
      cgpa: Joi.number().min(1).max(10).optional().label("cgpa"),
      current_company: Joi.string().min(2).optional().label("current_company"),
      work_experience: Joi.number().min(1).optional().label("work_experience"),
      job_role: Joi.string().min(2).optional().label("job_role"),
      resume: Joi.string().min(3).required().label("resume"),
      skills: Joi.string().min(3).required().label("Skills"),
      account_type: Joi.string()
        .valid("student", "employee")
        .required()
        .label("accout_type"),
    });
    let output = {
      Data: [],
    };
    const { error } = schema.validate(req.body);
    if (error) {
     
      output["Success"] = "N";
      output["Message"] = "Please fill data properly";
      output.Data.push(error.message);
      return res.status(400).send(output);
    } else {
      const newuser = {
        name,
        email,
        mobile,
        university,
        graduation_year,
        branch,
        cgpa,
        current_company : current_company ? current_company : "NA",
        work_experience:  work_experience ? work_experience : "NA",
        job_role : job_role ? job_role : "NA",
        resume,
        skills,
        account_type,
      };
      const user = await db.collection("profile").add(newuser);
      output["Success"] = "Y";
      output["Message"] = "Succesfull";
      output.Data.push(user);
      
    }
    return res.status(201).send(output);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;
