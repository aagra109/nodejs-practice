import express from "express";
import {
  getMoviesWithCallback,
  getMoviesWithPromise,
  getMoviesWithAsyncAwait,
} from "../controllers/movie.controller.js";

const router = express.Router();
router.get("/movies-callback", getMoviesWithCallback);
router.get("/movies-promise", getMoviesWithPromise);
router.get("/movies-async-await", getMoviesWithAsyncAwait);

export default router;
