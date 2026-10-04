-- Create Database if it doesn't exist
CREATE DATABASE IF NOT EXISTS portfolio_db;

-- Use Database
USE portfolio_db;

-- Create Messages Table to store received emails
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
