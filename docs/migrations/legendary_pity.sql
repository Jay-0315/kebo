
ALTER TABLE user_rewards
  ADD COLUMN legendary_pity_count INT NOT NULL DEFAULT 0 AFTER gacha_pity_count;
