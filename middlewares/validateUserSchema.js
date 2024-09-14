const Ajv = require("ajv");
const userSchema = require("../schemas/user.schema");

const ajv = new Ajv();

const validateUserSchema = (req, res, next) => {
  const validate = ajv.compile(userSchema);
  const valid = validate(req.body);

  if (!valid) {
    return res.status(400).json({ errors: validate.errors });
  }
  next();
};

module.exports = validateUserSchema;
