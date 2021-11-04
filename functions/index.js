const functions = require("firebase-functions");
// setting up permissions
const admin = require("firebase-admin");
const serviceAccount = require("./authentication.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors({origin:true}));

const profile = require("./routes/profile");
app.use("/api/profile",profile);


app.get("/",(req,res)=>{
    return res.status(200).send("testing");
});

app.get("/referral-hub",(req,res)=>{
    return res.send("This is referaal hub route");
})




// exporting api to firebase cloud function

exports.app = functions.https.onRequest(app);