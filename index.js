import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import setupSwagger from "./swagger.js";
import setupAuth from "./auth.js";
import passport from "passport";
import axios from "axios";
import checkAccessToken from "./msalConfig.js";
import logger from "./logger.js";
import "./scheduler.js";
import movieRoute from "./routes/movie.route.js";
import { getConnection } from "./mssqlConfig.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api", userRoute);
app.use("/movies", movieRoute);

setupAuth(app);
setupSwagger(app);

app.get("/", (req, res) => {
  logger.info("Hello from Node API");
  res.send("Hello from Node API");
});

app.get(
  "/api/protected",
  passport.authenticate("oauth-bearer", { session: false }),
  (req, res) => {
    res.json({
      message: "You are authenticated with Azure AD!",
      user: req.user,
    });
  }
);

app.get("/login", passport.authenticate("azuread-openidconnect"));

app.get(
  "/auth/callback",
  passport.authenticate("azuread-openidconnect", {
    failureRedirect: "/",
    successRedirect: "/dashboard",
  })
);

app.get("/dashboard", checkAccessToken, async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  const accessToken = req.user.accessToken;

  try {
    const profileResponse = await axios.get(
      "https://graph.microsoft.com/v1.0/me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const userProfile = profileResponse.data;
    res.json({
      message: "authenticated user!",
      profile: userProfile,
    });
  } catch (error) {
    logger.error(
      "Error fetching profile from Microsoft Graph:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      error: "Failed to fetch user profile.",
      details: error.response ? error.response.data : error.message,
    });
  }
});

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    logger.info("Connected to MongoDB");
    app.listen(3000, () => {
      logger.info("Server is running on port 3000");
    });
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB:", error);
  });

const fetchData = async () => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT 1 AS Number");
    console.log(result.recordset);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

fetchData();
