using Exiled.API.Features;
using MySql.Data.MySqlClient;
using ServerAchievementFramework.API.Feature;
using ServerAchievementFramework.API.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using Utils.NonAllocLINQ;

namespace ServerAchievementFramework.API.Utils
{
    internal class Database
    {
        private string DBConnect;
        private MySqlConnection MSConnection = null;

        internal static Database Instance { get; private set; } = new Database();

        private Database() 
        {
            var config = MainPlugin.Instance.Config;
            DBConnect = $"server={config.ServerHostName};user={config.User};database={config.DBName};port={config.ServerPort};password={config.Password}";

            Instance = this;
        }

        ~Database() 
        {
            Instance = null;
            MSConnection.Close();
            MSConnection = null;
        }

        internal MySqlConnection GetConnection()
        {
            try
            {
                if (MSConnection == null)
                {
                    MSConnection = new MySqlConnection(DBConnect);
                    MSConnection.Open();

                }
                return MSConnection;
            }
            catch (Exception e)
            {
                Log.Error(e);
            }
            return null;

        }


        private MySqlCommand GetMySqlCommand()
        {

            MySqlCommand MSCommand = new MySqlCommand
            {
                Connection = GetConnection()
            };
            return MSCommand;
        }

        internal void CloseConnection()
        {
            if(MSConnection.State != System.Data.ConnectionState.Closed)
            {
                MSConnection.Close();
                MSConnection = null;
            }
        }


        public bool AddIfNotExist(Player p)
        {
            PlayerInfo info = new PlayerInfo(p);
            Log.Debug($"trying to add {p.Nickname} to the database");
            try
            {
                using (MySqlCommand cmd = GetMySqlCommand())
                {
                    cmd.CommandText = "insert into Players VALUES (@value1,@value2);";
                    cmd.Parameters.AddWithValue("@value1", info.UserId);
                    cmd.Parameters.AddWithValue("@value2", info.UserName);
                    cmd.ExecuteNonQuery();
                }
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public bool RemoveIfExist(Player p)
        {
            PlayerInfo info = new PlayerInfo(p);
            Log.Debug($"trying to remove {p.Nickname} to the database");
            try
            {
                using (MySqlCommand cmd = GetMySqlCommand())
                {
                    cmd.CommandText = "DELETE FROM Players WHERE userID=@value";
                    cmd.Parameters.AddWithValue("@value", info.UserId);
                    cmd.ExecuteNonQuery();
                }
                return true;
            }
            catch (Exception e)
            {
                Log.Error(e);
                return false;
            }
        }


        public bool AddAchievement(Player p,IAchievement achievement)
        {
            PlayerInfo info = new PlayerInfo(p);
            Log.Debug($"trying adding {achievement.Name} achievement to player {p.Nickname}");
            try
            {
                using (MySqlCommand cmd = GetMySqlCommand())
                {
                    cmd.CommandText = "insert into PlayersAchievement VALUES (@value1,@value2);";
                    cmd.Parameters.AddWithValue("@value1", info.UserId);
                    cmd.Parameters.AddWithValue("@value2", achievement.Name);
                    cmd.ExecuteNonQuery();
                }
                return true;
            }
            catch (Exception e)
            {
                Log.Error(e);
                return false;
            }
        }

        public void AddAchievementToDB(IAchievement achievement)
        {
            Log.Debug($"trying adding {achievement.Name} achievement to db");
            try
            {
                using (MySqlCommand cmd = GetMySqlCommand())
                {
                    cmd.CommandText = "insert into Achievements VALUES (@value);";
                    cmd.Parameters.AddWithValue("@value", achievement.Name);
                    cmd.ExecuteNonQuery();
                }
            }
            catch (Exception e)
            {
                Log.Warn("already existing");
            }
        }



        public List<IAchievement> GetAchievements(Player p)
        {
            List<IAchievement> result = new List<IAchievement>();
            PlayerInfo info = new PlayerInfo(p);
            Log.Debug($"trying get {info.UserName}'s achievements");
            Log.Debug(info.UserId);

            using (MySqlCommand cmd = GetMySqlCommand())
            {
                cmd.CommandText = "SELECT aAchievement FROM PlayersAchievement WHERE aPlayer = @value";
                cmd.Parameters.AddWithValue("@value", info.UserId);

                using (MySqlDataReader reader = cmd.ExecuteReader())
                {

                    while (reader.Read())
                    {
                        var ad = reader["aAchievement"];
                        Log.Debug(ad);
                        result.Add(Achievement.GetAchievement((string)ad));
                    }
                }
            }
            return result;

        }

        internal class PlayerInfo
        {
            public string UserId { get; private set; }
            public string UserName { get; private set; }
            internal PlayerInfo(string UserId, string UserName)
            {
                this.UserId = UserId;
                this.UserName = UserName;
            }

            internal PlayerInfo(Player p)
            {
                UserId = p.UserId;
                UserName = p.Nickname;
            }
            internal PlayerInfo(string UserId)
            {
                this.UserId = UserId;
            }

            /// <summary>
            /// Gets the online Player
            /// </summary>
            /// <returns>the Player if only; null if not</returns>
            internal Player GetPlayer()
            {
                return Player.List.FirstOrDefault(a => a.UserId == UserId);
            }
        }
    }
}
