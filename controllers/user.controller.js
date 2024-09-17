import User from "../models/user.model.js";
import memjs from "memjs";
import logger from "../logger.js";

const memcachedClient = memjs.Client.create();

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const users = await User.find({}).skip(skip).limit(limit);
    const totalUsers = await User.countDocuments();
    res.status(200).json({ users, totalUsers: totalUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `user:${id}`;
    const cachedData = await memcachedClient.get(cacheKey);
    if (cachedData.value) {
      logger.info("Cache hit: getting from cache");
      return res
        .status(200)
        .json({ user: JSON.parse(cachedData.value.toString()) });
    }
    logger.info("Cache miss: fetching from db");
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await memcachedClient.set(cacheKey, JSON.stringify(user), { expires: 300 });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body);
    const cacheKey = `user:${id}`;
    await memcachedClient.delete(cacheKey);
    logger.info(`Cache deleted for user: ${id}`);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedUser = await User.findById(id);
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
