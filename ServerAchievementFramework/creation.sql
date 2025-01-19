CREATE DATABASE IF NOT EXISTS SAFSql;
DROP USER IF EXISTS SAFUser;
CREATE USER 'SAFUser'@'%' IDENTIFIED BY 'gexiled69';
GRANT ALL PRIVILEGES ON SAFSql.* TO 'SAFUser'@'%';

use SAFSql;
DROP TABLE IF EXISTS PlayersAchievement;
DROP TABLE IF EXISTS Achievements;
DROP TABLE IF EXISTS Players;


CREATE TABLE Players(
	userID VARCHAR(50),
	userName VARCHAR(50),
    CONSTRAINT pk_Players PRIMARY KEY (userID)
);


CREATE TABLE Achievements(
	achName VARCHAR(50),
    CONSTRAINT pk_Achievements PRIMARY KEY(achName)
);

CREATE TABLE PlayersAchievement(
	aPlayer VARCHAR(50),
    aAchievement VARCHAR(50),
    
    CONSTRAINT fk_PlayersAchievement_Achievements foreign key (aAchievement) REFERENCES Achievements(achName)
		ON DELETE CASCADE,
    CONSTRAINT fk_PlayersAchievement_Players foreign key (aPlayer) REFERENCES Players(userID)
		ON DELETE CASCADE,
	CONSTRAINT pk_PlayersAchievements PRIMARY KEY(aPlayer,aAchievement)
);