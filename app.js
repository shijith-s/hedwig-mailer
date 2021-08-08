const express = require("express");
const path = require("path");
const app = express();
const userRouter = require("./routes/userRouter");
const mongoose = require("mongoose");
require("dotenv/config");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const scheduleChecker = require("./functional/scheduleChecker");

scheduleChecker();

const static_file_folder = "./Front-end/build";

app.use(express.static(path.resolve(__dirname, static_file_folder)));

//midlleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors());
app.use(cookieParser());

// The below large code is replaced simply by using cors

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*"); //allowing access to any request (cors)
//   res.header("Access-Control-Allow-Headers", "*");
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "*");
//     return res.status(200).json({});
//   }
//   next();
// });

app.use("/user", userRouter);


// ===================== IMPORTANT =======================================

// In the below code we are using "/*" ==> this is for sending the react app index.html 
// for any request other than the request urls we defined in backend.

// This is because, in frontend we uses react routing.ie,for signin we use '/signin'
// This may work at that time, but after a refresh browser searches backend for the url 'baseurl/signin'
// which doesn't exists and causes error.
// To avoid this,we uses '/* for sending the same index.html for any other requests

// ============================================================================

app.get("/*", (req, res) => {         
  res.sendFile(path.resolve(__dirname, static_file_folder, "index.html"));
});

//connecting to database
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const con = mongoose.connection;
con.then(() => {
  console.log("connected to DB");
});

//listen to the server
const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(
    `*****************   server started at ${port}  *********************************`
  );
});
