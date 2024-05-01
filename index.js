import express, { urlencoded } from "express";
import dotenv from "dotenv";
import session from "express-session";
import path from "path";


dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "public"), { index: false }));

app.get("/getsession", (req, res) => {
  if (Date.now() - req.session.lastActive <= 120000) {
    res.send((120000 - (Date.now() - req.session.lastActive)).toString());
  } else {
    res.send("-1");
  }
});

app.use((req, res, next) => {
  if (req.session.lastActive && Date.now() - req.session.lastActive <= 120000) {
    console.log("Session Renewed");
    req.session.lastActive = Date.now();
  }
  next();
});

app.post("/", (req, res) => {
  let uname = req.body.username;
  let pass = req.body.password;
  req.session.userId = btoa(pass + uname);
  req.session.lastActive = Date.now();
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (err) {
    console.error("Error Destroying Session: ", err);
    res.status(500).send("??SERVER ERROR??");
  }
});

app.get("/", (req, res) => {
  if (req.session.lastActive) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  } else {
    res.sendFile(path.join(__dirname, "public", "login.html"));
  }
});

app.get("/active", (req, res) => {
  res.send((12000 - (Date.now() - req.session.lastActive)).toString());
});

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
