import { createRequire } from "module";
import logger from "./logger.js";

const require = createRequire(import.meta.url);
const sql = require("mssql/msnodesqlv8");

const connectionString =
  "Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-3C7PBPS;Database=master;Trusted_Connection=Yes;";

const sqlConfig = {
  connectionString: connectionString,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool;

export const getConnection = async () => {
  try {
    if (!pool) {
      pool = sql.connect(sqlConfig);
      logger.info("Connected to SQL Server!!!");
    }
    return pool;
  } catch (err) {
    logger.error("SQL Server connection error");
    throw err;
  }
};
