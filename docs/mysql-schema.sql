CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'USER',
  base_country_code CHAR(2) NOT NULL,
  base_currency ENUM('KRW', 'JPY', 'USD', 'EUR') NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_identities (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  provider ENUM('GOOGLE', 'KAKAO', 'LINE', 'APPLE') NOT NULL,
  provider_user_id VARCHAR(191) NOT NULL,
  provider_email VARCHAR(190) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_identities_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT uq_provider_user UNIQUE (provider, provider_user_id),
  CONSTRAINT uq_user_provider UNIQUE (user_id, provider)
);

CREATE TABLE app_settings (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL UNIQUE,
  notifications TINYINT(1) NOT NULL DEFAULT 1,
  dark_mode TINYINT(1) NOT NULL DEFAULT 1,
  auto_backup TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE expenses (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  expense_date DATETIME NOT NULL,
  category VARCHAR(50) NOT NULL,
  spent_amount DECIMAL(12, 2) NOT NULL,
  spent_currency ENUM('KRW', 'JPY', 'USD', 'EUR') NOT NULL,
  base_amount DECIMAL(12, 2) NOT NULL,
  base_currency ENUM('KRW', 'JPY', 'USD', 'EUR') NOT NULL,
  exchange_rate DECIMAL(12, 6) NOT NULL,
  country_code CHAR(2) NOT NULL,
  memo VARCHAR(255) NOT NULL,
  group_name VARCHAR(100) NULL,
  participants INT NULL,
  receipt_url TEXT NULL,
  shared_to_community TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_expenses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE community_posts (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  content TEXT NOT NULL,
  likes_count INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_posts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_rewards (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL UNIQUE,
  mission_points INT NOT NULL DEFAULT 0,
  attendance_days INT NOT NULL DEFAULT 0,
  streak_days INT NOT NULL DEFAULT 0,
  equipped_character_id INT NULL,
  equipped_title_id INT NULL,
  gacha_pity_count INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_rewards_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_titles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title_id INT NOT NULL,
  obtained_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_titles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT uq_user_title UNIQUE (user_id, title_id),
  INDEX idx_user_titles_user_id (user_id)
);

CREATE TABLE user_characters (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  character_id INT NOT NULL,
  obtained_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_characters_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT uq_user_character UNIQUE (user_id, character_id),
  INDEX idx_user_characters_user_id (user_id)
);

CREATE TABLE community_post_expenses (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  post_id VARCHAR(36) NOT NULL,
  expense_id VARCHAR(36) NOT NULL,
  category VARCHAR(50) NOT NULL,
  memo VARCHAR(255) NOT NULL,
  expense_date DATETIME NOT NULL,
  spent_amount DECIMAL(12, 2) NOT NULL,
  spent_currency ENUM('KRW', 'JPY', 'USD', 'EUR') NOT NULL,
  base_amount DECIMAL(12, 2) NOT NULL,
  base_currency ENUM('KRW', 'JPY', 'USD', 'EUR') NOT NULL,
  exchange_rate DECIMAL(12, 6) NOT NULL,
  country_code CHAR(2) NOT NULL,
  CONSTRAINT fk_post_expenses_post FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_post_expenses_expense FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE
);
