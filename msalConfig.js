import { ConfidentialClientApplication } from "@azure/msal-node";
import jwt from "jsonwebtoken";
import logger from "./logger.js";

const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
  },
};

const cca = new ConfidentialClientApplication(msalConfig);

async function checkAccessToken(req, res, next) {
  if (!req.user) {
    logger.error("User is not authenticated.");
    return res.redirect("/login");
  }
  const accessToken = req.user.accessToken;
  const refreshToken = req.user.refreshToken;
  const decodedToken = jwt.decode(accessToken);
  const currentTime = Math.floor(Date.now() / 1000);
  if (!decodedToken || currentTime >= decodedToken.exp) {
    logger.info("attempting to refresh using refresh token");
    try {
      const response = await cca.acquireTokenByRefreshToken({
        refreshToken: refreshToken,
        scopes: [
          "https://graph.microsoft.com/.default",
          "openid",
          "profile",
          "offline_access",
        ],
      });
      logger.info(`Old access token: ${accessToken}`);
      logger.info(
        `New access token obtained via refresh: ${response.accessToken}`
      );
      req.user.accessToken = response.accessToken;

      next();
    } catch (error) {
      logger.error("Error refreshing token:", error.message);
      logger.error("Full error response:", error);
      res.redirect("/login");
    }
  } else {
    logger.info("access token is valid. proceeding with request.");
    next();
  }
}

export default checkAccessToken;
