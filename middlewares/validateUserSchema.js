import Ajv from "ajv";
import userSchema from "../schemas/user.schema.js";

const ajv = new Ajv();

export const validateUserSchema = (req, res, next) => {
  const validate = ajv.compile(userSchema);
  const valid = validate(req.body);

  if (!valid) {
    return res.status(400).json({ errors: validate.errors });
  }
  next();
};
