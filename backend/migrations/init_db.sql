-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS family_inc;

-- Use the database
USE family_inc;

-- Create the tasks table if it doesn't exist
CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    complete BOOLEAN NOT NULL DEFAULT FALSE
);