
ALTER TABLE user_rewards
  ADD COLUMN legendary_pity_count INT NOT NULL DEFAULT 0 AFTER gacha_pity_count;

ALTER TABLE community_posts
  ADD COLUMN category ENUM('brag', 'tip', 'chat') NOT NULL DEFAULT 'chat' AFTER content;

ALTER TABLE community_posts
  ADD COLUMN image_url LONGTEXT NULL AFTER category;

CREATE TABLE post_likes (
  id         BIGINT      AUTO_INCREMENT PRIMARY KEY,
  post_id    VARCHAR(36) NOT NULL,
  user_id    VARCHAR(36) NOT NULL,
  created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_post_likes UNIQUE (post_id, user_id),
  INDEX idx_post_likes_post_id (post_id),
  INDEX idx_post_likes_user_id (user_id),
  CONSTRAINT fk_post_likes_post FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_post_likes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS community_post_expenses;

CREATE TABLE comments (
  id         BIGINT       AUTO_INCREMENT PRIMARY KEY,
  post_id    VARCHAR(36)  NOT NULL,
  user_id    VARCHAR(36)  NOT NULL,
  parent_id  BIGINT       NULL,
  content    TEXT         NOT NULL,
  image_url  LONGTEXT     NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_comments_post_id   (post_id),
  INDEX idx_comments_user_id   (user_id),
  INDEX idx_comments_parent_id (parent_id),
  CONSTRAINT fk_comments_post   FOREIGN KEY (post_id)   REFERENCES community_posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_user   FOREIGN KEY (user_id)   REFERENCES users(id)           ON DELETE CASCADE,
  CONSTRAINT fk_comments_parent FOREIGN KEY (parent_id) REFERENCES comments(id)         ON DELETE CASCADE
);
