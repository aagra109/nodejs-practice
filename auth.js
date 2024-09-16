import passport from "passport";
import { OIDCStrategy } from "passport-azure-ad";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

console.log("AZURE_CLIENT_ID:", process.env.AZURE_CLIENT_ID);
console.log("AZURE_TENANT_ID:", process.env.AZURE_TENANT_ID);
console.log("AZURE_CLIENT_SECRET:", process.env.AZURE_CLIENT_SECRET);

const options = {
  identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`,
  clientID: process.env.AZURE_CLIENT_ID,
  clientSecret: process.env.AZURE_CLIENT_SECRET,
  responseType: "code",
  responseMode: "query",
  redirectUrl: "http://localhost:3000/auth/callback",
  allowHttpForRedirectUrl: true,
  validateIssuer: true,
  passReqToCallback: false,
  loggingLevel: "info",
  scope: ["profile", "email", "openid"],
};

passport.use(
  new OIDCStrategy(
    options,
    (issuer, sub, profile, accessToken, refreshToken, done) => {
      profile.accessToken = accessToken;
      return done(null, profile);
    }
  )
);

export default (app) => {
  app.use(
    session({
      secret: process.env.AZURE_CLIENT_SECRET,
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
