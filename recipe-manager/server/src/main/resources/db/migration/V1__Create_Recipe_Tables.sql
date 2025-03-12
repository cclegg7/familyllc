-- Create recipes table
CREATE TABLE recipes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    prep_time INT,
    cook_time INT,
    servings INT,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);Docker Desktop - Unexpected WSL error

-- Create ingredients table
CREATE TABLE ingredients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipe_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity VARCHAR(100),
    unit VARCHAR(50),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- Create instructions table
CREATE TABLE instructions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipe_id BIGINT NOT NULL,
    step_number INT NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- Create index for faster recipe lookup
CREATE INDEX idx_recipe_title ON recipes(title);
CREATE INDEX idx_recipe_category ON recipes(category);
