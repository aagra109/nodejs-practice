import pool from "../postgresConfig.js";

export const getMoviesWithCallback = (req, res) => {
  pool.query("SELECT * FROM movies", (err, result) => {
    if (err) {
      logger.error(`error fetching movies: ${err.message}`);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(result.rows);
  });
};

export const getMoviesWithPromise = (req, res) => {
  pool
    .query("SELECT * FROM movies")
    .then((result) => {
      res.status(200).json(result.rows);
    })
    .catch((err) => {
      logger.error(`error fetching movies: ${err.message}`);
      res.status(500).json({ error: err.message });
    });
};

export const getMoviesWithAsyncAwait = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM movies");
    res.status(200).json(result.rows);
  } catch (err) {
    logger.error(`error fetching movies: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};
