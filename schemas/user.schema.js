const userSchema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    age: { type: "number", minimum: 18 },
  },
  required: ["firstName", "lastName", "age"],
  additionalProperties: false,
};

module.exports = userSchema;
