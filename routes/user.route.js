const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const validateUserSchema = require("../middlewares/validateUserSchema");

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", validateUserSchema, createUser);
router.put("/:id", validateUserSchema, updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
