const mysql = require("mysql2/promise");
require("dotenv").config();

let pool = null;
let lastInitError = null;

function getDbConfig() {
  return {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    database: process.env.DB_NAME || "portfolio_db"
  };
}

// Initialize Database & Messages Table automatically
async function initDB() {
  const dbConfig = getDbConfig();
  try {
    lastInitError = null;

    // 1. Connection without DB name to ensure DB exists
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });

    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
    await tempConnection.end();

    // 2. Create connection pool with database selected
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // 3. Create table if not exists
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createTableQuery);
    console.log(`✅ MySQL Connected successfully! Database '${dbConfig.database}' and table 'messages' are ready.`);
    return true;
  } catch (error) {
    lastInitError = error;
    console.error("⚠️ MySQL Initialization Error:", error.message);
    console.error("💡 Tip: Make sure MySQL service is running and credentials in .env are correct.");
    return false;
  }
}

// Helper to ensure database pool is ready
async function ensurePool() {
  if (!pool) {
    require("dotenv").config(); // reload .env if changed
    await initDB();
  }
  if (!pool) {
    throw new Error(`MySQL Connection Failed: ${lastInitError ? lastInitError.message : "Database pool not initialized"}`);
  }
}

// Function to save an incoming mail/message to MySQL
async function saveMessage(name, email, message) {
  await ensurePool();
  const query = "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)";
  const [result] = await pool.execute(query, [name, email, message]);
  return result;
}

// Function to fetch all stored mails/messages
async function getMessages() {
  await ensurePool();
  const [rows] = await pool.query("SELECT * FROM messages ORDER BY created_at DESC");
  return rows;
}

// Initialize on startup
initDB();

module.exports = {
  saveMessage,
  getMessages,
  initDB
};
