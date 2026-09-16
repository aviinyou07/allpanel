-- Dragon Tiger Admin Panel Schema
-- MySQL Database

CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  username    VARCHAR(50) UNIQUE NOT NULL,
  email       VARCHAR(100),
  full_name   VARCHAR(100) NOT NULL,
  mobile      VARCHAR(20),
  password    VARCHAR(255) NOT NULL,
  role        ENUM('SUPREME','SUPER_ADMIN','MASTER','USER') NOT NULL,
  parent_id   INT DEFAULT NULL,
  status      ENUM('ACTIVE','INACTIVE','SUSPENDED') DEFAULT 'ACTIVE',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at  TIMESTAMP NULL DEFAULT NULL,
  INDEX idx_role (role),
  INDEX idx_parent (parent_id),
  INDEX idx_status (status),
  FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS wallets (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  user_id           INT UNIQUE NOT NULL,
  balance           BIGINT DEFAULT 0,
  total_received    BIGINT DEFAULT 0,
  total_distributed BIGINT DEFAULT 0,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS transactions (
  id                       INT AUTO_INCREMENT PRIMARY KEY,
  txn_id                   VARCHAR(50) UNIQUE NOT NULL,
  from_user_id             INT,
  to_user_id               INT,
  from_role                VARCHAR(20),
  to_role                  VARCHAR(20),
  amount                   BIGINT NOT NULL,
  type                     ENUM('CREDIT','DEBIT','BET','WIN','LOSS','REFUND','REVERSAL') NOT NULL,
  balance_before           BIGINT,
  balance_after            BIGINT,
  receiver_balance_before  BIGINT,
  receiver_balance_after   BIGINT,
  status                   ENUM('SUCCESS','FAILED','PENDING','REVERSED') DEFAULT 'SUCCESS',
  remarks                  TEXT,
  reference_id             VARCHAR(50),
  created_by               INT,
  created_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_from (from_user_id),
  INDEX idx_to (to_user_id),
  INDEX idx_type (type),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS audit_logs (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  actor_id    INT,
  actor_role  VARCHAR(20),
  action      VARCHAR(50) NOT NULL,
  target_id   INT,
  target_type VARCHAR(30),
  details     JSON,
  ip_address  VARCHAR(45),
  status      ENUM('SUCCESS','FAILURE') DEFAULT 'SUCCESS',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_actor (actor_id),
  INDEX idx_action (action),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS game_rounds (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  round_id      VARCHAR(50) UNIQUE NOT NULL,
  dragon_card   VARCHAR(10),
  tiger_card    VARCHAR(10),
  result        ENUM('DRAGON','TIGER','TIE') DEFAULT NULL,
  status        ENUM('BETTING_OPEN','BETTING_CLOSED','COMPLETED','CANCELLED') DEFAULT 'BETTING_OPEN',
  started_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at  TIMESTAMP NULL,
  INDEX idx_status (status),
  INDEX idx_started (started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS game_bets (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  round_id      VARCHAR(50) NOT NULL,
  user_id       INT NOT NULL,
  bet_type      ENUM('DRAGON','TIGER','TIE') NOT NULL,
  amount        BIGINT NOT NULL,
  payout        BIGINT DEFAULT 0,
  result        ENUM('WIN','LOSS','REFUND','PENDING') DEFAULT 'PENDING',
  txn_id        VARCHAR(50),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_round (round_id),
  INDEX idx_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS game_settings (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  setting_key   VARCHAR(50) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  updated_by    INT,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
