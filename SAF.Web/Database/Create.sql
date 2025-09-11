CREATE DATABASE IF NOT EXISTS SAFSql;
CREATE USER 'SAFUser'@'%' IDENTIFIED BY 'verysecurepassword';
GRANT ALL PRIVILEGES ON SAFSql.* TO 'SAFUser'@'%';
USE SAFSql;

DROP TABLE IF EXISTS PlayersAchievements;
DROP TABLE IF EXISTS Achievements;
DROP TABLE IF EXISTS AchievementCategories;
DROP TABLE IF EXISTS Players;

CREATE TABLE Players (
    userID VARCHAR(50) NOT NULL,
    userName VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (userID)
);

CREATE TABLE AchievementCategories (
    category_id INT UNSIGNED AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    PRIMARY KEY (category_id)
);

CREATE TABLE Achievements (
    achievement_id INT UNSIGNED AUTO_INCREMENT,
    category_id INT UNSIGNED NULL,
    achName VARCHAR(50) NOT NULL,
    description TEXT,
    hidden TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (achievement_id),
    CONSTRAINT fk_ach_category FOREIGN KEY (category_id)
        REFERENCES AchievementCategories(category_id) ON DELETE SET NULL
);

CREATE TABLE PlayersAchievements (
    userID VARCHAR(50) NOT NULL,
    achievement_id INT UNSIGNED NOT NULL,
    obtained_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userID, achievement_id),
    CONSTRAINT fk_pa_player FOREIGN KEY (userID)
        REFERENCES Players(userID) ON DELETE CASCADE,
    CONSTRAINT fk_pa_achievement FOREIGN KEY (achievement_id)
        REFERENCES Achievements(achievement_id) ON DELETE CASCADE
);

CREATE INDEX idx_player_name ON Players(userName);
CREATE INDEX idx_pa_achievement ON PlayersAchievements(achievement_id);
CREATE INDEX idx_pa_player ON PlayersAchievements(userID);
CREATE INDEX idx_recent ON PlayersAchievements(obtained_at DESC);