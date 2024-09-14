// Import AJV
const Ajv = require("ajv");

// Create an AJV instance
const ajv = new Ajv();

// Define a schema
const schema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    age: { type: "number", minimum: 18 },
  },
  required: ["firstName", "lastName", "age"],
  additionalProperties: false, // Ensure no extra fields are allowed
};

// Compile the schema
const validate = ajv.compile(schema);

// Test valid data
const validData = {
  firstName: "John",
  lastName: "Doe",
  age: 25,
};

// Test invalid data
const invalidData = {
  firstName: "Jane",
  lastName: "Doe",
  age: 16, // Below minimum age
};

// Validate the data
console.log("Valid Data:", validate(validData)); // Should print: true
console.log("Invalid Data:", validate(invalidData)); // Should print: false

// If invalid, log errors
if (!validate(invalidData)) {
  console.log("Validation Errors:", validate.errors); // Detailed error output
}
