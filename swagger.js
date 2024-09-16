import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User API",
      version: "1.0.0",
      description: "API documentation for the User API",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            firstName: {
              type: "string",
              description: "The user's first name",
            },
            lastName: {
              type: "string",
              description: "The user's last name",
            },
            age: {
              type: "number",
              minimum: 18,
              description: "The user's age (must be at least 18)",
            },
          },
          required: ["firstName", "lastName", "age"],
          additionalProperties: false,
          example: {
            firstName: "John",
            lastName: "Doe",
            age: 30,
          },
        },
        UpdateUser: {
          type: "object",
          properties: {
            firstName: {
              type: "string",
              description: "The user's first name",
            },
            lastName: {
              type: "string",
              description: "The user's last name",
            },
            age: {
              type: "number",
              minimum: 18,
              description: "The user's age (must be at least 18)",
            },
          },
          additionalProperties: false,
          example: {
            firstName: "Jane",
            age: 28,
          },
          anyOf: [
            { required: ["firstName"] },
            { required: ["lastName"] },
            { required: ["age"] },
          ],
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

export default setupSwagger;
