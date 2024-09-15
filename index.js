import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api", userRoute);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Customer API",
      version: "1.0.0",
      description: "API documentation for the Customer API",
      contact: {
        name: "Amazing Developer",
      },
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
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req, res) => {
  res.send("Hello from Node API");
});

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });
