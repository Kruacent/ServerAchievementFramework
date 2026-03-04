CREATE DATABASE IF NOT EXISTS SAFSql;
DROP USER IF EXISTS SAFUser;
CREATE USER 'SAFUser'@'%' IDENTIFIED BY 'gexiled69';
GRANT ALL PRIVILEGES ON SAFSql.* TO 'SAFUser'@'%';

use SAFSql;
DROP TABLE IF EXISTS PlayersAchievement;
DROP TABLE IF EXISTS Achievements;
DROP TABLE IF EXISTS Players;
DROP TABLE IF EXISTS AuthTypes;



CREATE TABLE AuthTypes (
    authType VARCHAR(10) PRIMARY KEY
);

INSERT INTO AuthTypes (authType) VALUES
('Steam'),
('Discord'),
('Northwood');



CREATE TABLE Players(
	userID VARCHAR(50),
	authType VARCHAR(10),
    CONSTRAINT pk_Players PRIMARY KEY (userID,authType),
	    CONSTRAINT fk_Players_AuthTypes FOREIGN KEY (authType)
        REFERENCES AuthTypes(authType)
		ON DELETE RESTRICT
);


CREATE TABLE Achievements(
	achId VARCHAR(50),
	achPlugin VARCHAR(50),
	achDisplayName VARCHAR(50),
	target INT DEFAULT 1,
    CONSTRAINT pk_Achievements PRIMARY KEY(achId,achPlugin)
);



CREATE TABLE PlayersAchievement(
	aPlayer VARCHAR(50),
	aPlayerAuth VARCHAR(10),
    AchievementId VARCHAR(50),
	aAchievementPlugin VARCHAR(50),
	progress INT DEFAULT 0,
    
    CONSTRAINT fk_PlayersAchievement_Achievements foreign key (AchievementId,aAchievementPlugin) REFERENCES Achievements(achId,achPlugin)
		ON DELETE CASCADE,
    CONSTRAINT fk_PlayersAchievement_Players foreign key (aPlayer,aPlayerAuth) REFERENCES Players(userID,authType)
		ON DELETE CASCADE,
	CONSTRAINT pk_PlayersAchievements PRIMARY KEY(aPlayer,aPlayerAuth,AchievementId,aAchievementPlugin)
);
