import passport from "passport";
import { OIDCStrategy } from "passport-azure-ad";
import session from "express-session";
import dotenv from "dotenv";
import { getSecret } from "./keyVaultConfig.js";

dotenv.config();

const clientID = await getSecret("AZURE-CLIENT-ID");
const clientSecret = await getSecret("AZURE-CLIENT-SECRET");
const tenantID = await getSecret("AZURE-TENANT-ID");
const options = {
  identityMetadata: `https://login.microsoftonline.com/${tenantID}/v2.0/.well-known/openid-configuration`,
  clientID: clientID,
  clientSecret: clientSecret,
  responseType: "code",
  responseMode: "query",
  redirectUrl: "http://localhost:3000/auth/callback",
  allowHttpForRedirectUrl: true,
  validateIssuer: true,
  passReqToCallback: false,
  loggingLevel: "info",
  scope: ["profile", "email", "openid", "offline_access"],
};

passport.use(
  new OIDCStrategy(
    options,
    (issuer, sub, profile, accessToken, refreshToken, done) => {
      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken;
      return done(null, profile);
    }
  )
);

export default (app) => {
  app.use(
    session({
      secret: clientSecret,
      resave: false,
      saveUninitialized: true,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
