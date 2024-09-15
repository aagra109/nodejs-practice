import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { validateUserSchema } from "../middlewares/validateUserSchema.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", validateUserSchema, createUser);
router.put("/:id", validateUserSchema, updateUser);
router.delete("/:id", deleteUser);

export default router;
