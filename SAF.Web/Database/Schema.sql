CREATE TABLE IF NOT EXISTS AuthTypes (
    authType VARCHAR(10) NOT NULL,
    PRIMARY KEY (authType)
);

INSERT IGNORE INTO AuthTypes (authType) VALUES ('Steam'), ('Discord'), ('Northwood');

CREATE TABLE IF NOT EXISTS Players (
    userID VARCHAR(50) NOT NULL,
    authType VARCHAR(10) NOT NULL,
    PRIMARY KEY (userID, authType),
    CONSTRAINT fk_Players_AuthTypes FOREIGN KEY (authType)
        REFERENCES AuthTypes (authType) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS Achievements (
    achId VARCHAR(50) NOT NULL,
    achPlugin VARCHAR(50) NOT NULL,
    achDisplayName VARCHAR(50),
    achDescription VARCHAR(150),
    hidden TINYINT(1) DEFAULT 0,
    target INT DEFAULT 1,
    PRIMARY KEY (achId, achPlugin)
);

CREATE TABLE IF NOT EXISTS PlayersAchievement (
    aPlayer VARCHAR(50) NOT NULL,
    aPlayerAuth VARCHAR(10) NOT NULL,
    AchievementId VARCHAR(50) NOT NULL,
    aAchievementPlugin VARCHAR(50) NOT NULL,
    progress INT DEFAULT 0,
    obtained_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (aPlayer, aPlayerAuth, AchievementId, aAchievementPlugin),
    CONSTRAINT fk_PlayersAchievement_Achievements FOREIGN KEY (AchievementId, aAchievementPlugin)
        REFERENCES Achievements (achId, achPlugin) ON DELETE CASCADE,
    CONSTRAINT fk_PlayersAchievement_Players FOREIGN KEY (aPlayer, aPlayerAuth)
        REFERENCES Players (userID, authType) ON DELETE CASCADE
);
