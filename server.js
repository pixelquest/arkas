const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

const dbConfig = require("./app/config/db.config");

const app = express();

// Define allowed origins
const allowedOrigins = ['http://localhost:4200', 'http://arkasfacilities.com', 'https://arkasfacilities.com'];


// app.use(cors());
// /* for Angular Client (withCredentials) */
app.use(
  cors({
    credentials: true,
    // origin: ["*"]
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true); // Allow the origin
      } else {
        callback(new Error('Not allowed by CORS')); // Reject the origin
      }
    }
  })
);

app.use(cors({ credentials: true }));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "arkas-session",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true
  })
);

const db = require("./app/models");
const Role = db.role;

// db.mongoose
//   .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
db.mongoose
  .connect(`mongodb+srv://arkasAdmin:O3Lah7Gaa8veL5z8@cluster0.dox15.mongodb.net/arkas_app`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to ARKAS application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/role.routes")(app);
require("./app/routes/location.routes")(app);
require("./app/routes/password-reset.routes")(app);
require("./app/routes/bank.routes")(app);

// set port, listen for requests
// const PORT = process.env.PORT || 8080;
const PORT = 3000;

console.log(PORT);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "User"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'User' to roles collection");
      });

      new Role({
        name: "Supervisor"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Supervisor' to roles collection");
      });

      new Role({
        name: "Admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Admin' to roles collection");
      });
    }
  });
}
