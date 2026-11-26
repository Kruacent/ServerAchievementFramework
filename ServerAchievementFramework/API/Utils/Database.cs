using Cryptography;
using Exiled.API.Enums;
using Exiled.API.Features;
using MySql.Data.MySqlClient;
using ServerAchievementFramework.API.Feature;
using ServerAchievementFramework.API.Interface;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing.Design;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Utils.NonAllocLINQ;

namespace ServerAchievementFramework.API.Utils
{
    internal class Database
    {
        private string DBConnect;

        internal static Database Instance { get; set; }

        private static Config Config => MainPlugin.Instance.Config;

        internal Database() 
        {
            DBConnect = $"server={Config.ServerHostName};user={Config.User};database={Config.DBName};port={Config.ServerPort};password={Config.Password}";
        }

        internal MySqlConnection GetConnection()
        {
            MySqlConnection connect = new MySqlConnection(DBConnect);
            try
            {
                connect.Open();
            }
            catch (Exception)
            {
                connect.Dispose();
                throw new Exception("no connection??");
            }
            return connect;

        }


        private MySqlCommand GetMySqlCommand()
        {
            MySqlCommand MSCommand = new MySqlCommand
            {
                Connection = GetConnection()
            };
            return MSCommand;
        }



        public bool AddIfNotExist(Player p)
        {
            if (!PlayerInfo.TryCreate(p, out PlayerInfo info))
            {
                return false;
            }
            LogDebug($"trying to add {p.Nickname} to the database");
            try
            {
                using (MySqlCommand cmd = GetMySqlCommand())
                {
                    cmd.CommandText = "insert into Players VALUES (@value1,@value2);";
                    cmd.Parameters.AddWithValue("@value1", info.UserId);
                    cmd.Parameters.AddWithValue("@value2", info.AuthType);
                    cmd.ExecuteNonQuery();
                }
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public bool RemoveIfExist(Player p)
        {
            if (!PlayerInfo.TryCreate(p, out PlayerInfo info))
            {
                return false;
            }
            LogDebug($"trying to remove {p.Nickname} to the database");
            try
            {
                using (MySqlCommand cmd = GetMySqlCommand())
                {
                    cmd.CommandText = "DELETE FROM Players WHERE userID=@value1 AND authType=@value2";
                    cmd.Parameters.AddWithValue("@value1", info.UserId);
                    cmd.Parameters.AddWithValue("@value2", info.AuthType);
                    cmd.ExecuteNonQuery();
                }
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }


        public void AddAchievementAsync(Player player, Achievement achievement)
        {
            Task.Run(() => AddAchievement(player, achievement));
        }



        /// <summary>
        /// Adds an <see cref="Achievement"/> to a <see cref="Player"/>
        /// </summary>
        /// <param name="p">The <see cref="Player"/></param>
        /// <param name="achievement">The <see cref="Achievement"/></param>
        /// <returns>true if it was successfully added to the database; false otherwise</returns>
        public bool AddAchievement(Player player, Achievement achievement)
        {
            if (!PlayerInfo.TryCreate(player, out PlayerInfo info))
            {
                return false;
            }
            LogDebug($"trying adding {achievement.Name} achievement to player {player.Nickname}");
            


            try
            {
                using (MySqlCommand cmd = GetMySqlCommand())
                {
                    cmd.CommandText = "insert into PlayersAchievement (aPlayer, aPlayerAuth, AchievementId, aAchievementPlugin, progress) VALUES (@value1,@value2,@value3,@value4,@value5);";
                    cmd.Parameters.AddWithValue("@value1", info.UserId);
                    cmd.Parameters.AddWithValue("@value2", info.AuthType);
                    cmd.Parameters.AddWithValue("@value3", achievement.Id);
                    cmd.Parameters.AddWithValue("@value4", achievement.PrefixPlugin);


                    if (achievement is CounterAchievement ca)
                    {
                        var progress = achievement.GetProgress(player);
                        cmd.Parameters.AddWithValue("@value5", progress);
                    }
                    else
                    {
                        cmd.Parameters.AddWithValue("@value5", 1);
                    }

                    cmd.ExecuteNonQuery();
                }
                return true;
            }
            catch (Exception e)
            {
                LogWarn(e);
                return false;
            }
        }


        public void AddProgressAsync(Player player, CounterAchievement achievement)
        {
            Task.Run(() => AddProgress(player, achievement));
        }

        /// <summary>
        /// Adds a progress toward an <see cref="Achievement"/>
        /// </summary>
        /// <param name="player">The <see cref="Player"/></param>
        /// <param name="achievement">The <see cref="CounterAchievement"/></param>
        /// <returns>true if it was successfully added to the database; false otherwise</returns>
        public bool AddProgress(Player player, CounterAchievement achievement)
        {
            if (!achievement.TryGetProgress(player, out uint progress)) return false;
            if (!PlayerInfo.TryCreate(player, out PlayerInfo info))
            {
                return false;
            }

            LogDebug($"trying adding progress {progress} of {achievement} to {player.UserId}");



            try
            {
                using MySqlCommand cmd = GetMySqlCommand();
                cmd.CommandText = "insert into PlayersAchievement (aPlayer, aPlayerAuth, AchievementId, aAchievementPlugin, progress) VALUES (@value1,@value2,@value3,@value4,@value5) ON DUPLICATE KEY UPDATE progress = VALUES(progress);";
                cmd.Parameters.AddWithValue("@value1", info.UserId);
                cmd.Parameters.AddWithValue("@value2", info.AuthType);
                cmd.Parameters.AddWithValue("@value3", achievement.Id);
                cmd.Parameters.AddWithValue("@value4", achievement.PrefixPlugin);
                cmd.Parameters.AddWithValue("@value5", achievement.GetProgress(player));


                cmd.ExecuteNonQuery();
                return true;
            }
            catch (Exception e)
            {
                LogWarn(e);
                return false;
            }



        }

        /// <summary>
        /// Adds an <see cref="Achievement"/> to the database
        /// </summary>
        /// <param name="achievement">The <see cref="Achievement"/> to add</param>
        public void AddAchievementToDB(Achievement achievement)
        {

            LogDebug($"trying adding {achievement.Name} achievement to db");
            try
            {
                using (MySqlCommand cmd = GetMySqlCommand())
                {
                    cmd.CommandText = "insert ignore into Achievements VALUES (@value1,@value2,@value3,@value4,@value5,@value6) ON DUPLICATE KEY UPDATE target = VALUES(target);";

                    cmd.Parameters.AddWithValue("@value1", achievement.Id);
                    cmd.Parameters.AddWithValue("@value2", achievement.PrefixPlugin);
                    cmd.Parameters.AddWithValue("@value3", achievement.Name);
                    cmd.Parameters.AddWithValue("@value4", achievement.Description);
                    cmd.Parameters.AddWithValue("@value5", achievement.IsHidden);

                    if (achievement is CounterAchievement ca)
                    {
                        cmd.Parameters.AddWithValue("@value6", ca.Objective);
                    }
                    else
                    {
                        cmd.Parameters.AddWithValue("@value6", 1);
                    }


                    
                    cmd.ExecuteNonQuery();
                }
            }
            catch (Exception e)
            {
                Log.Error(e);
            }
        }

        

        public IEnumerable<Achievement> SetAchievements(Player player)
        {
            List<Achievement> result = new();
            if(!PlayerInfo.TryCreate(player, out PlayerInfo info))
            {
                return null;
            }
            

            LogDebug($"trying get {info.UserId}'s achievements");

            using (MySqlCommand cmd = GetMySqlCommand())
            {
                cmd.CommandText = "SELECT * FROM PlayersAchievement WHERE aPlayer = @userid AND aPlayerAuth =@auth";
                cmd.Parameters.AddWithValue("@userid", info.UserId);
                cmd.Parameters.AddWithValue("@auth", info.AuthType);

                using (MySqlDataReader reader = cmd.ExecuteReader())
                {

                    while (reader.Read())
                    {
                        var aAchievementName = reader["AchievementId"];
                        var aAchievementPlugin = reader["aAchievementPlugin"];
                        var progress = reader["progress"];
                        LogDebug($"Achievement : {aAchievementName} from {aAchievementPlugin}");

                        

                        if(Achievement.TryGet((string)aAchievementName, (string)aAchievementPlugin, out Achievement achievement))
                        {
                            
                            try
                            {
                                LogDebug("progress db =" + progress);
                                LogDebug("objective =" + achievement.Objective);

                                achievement.SetProgress(player, (uint)(int)progress);
                                result.Add(achievement);
                                LogDebug("unlock =" + achievement.HasUnlockedIt(player));
                            }
                            catch(Exception e)
                            {
                                Log.Error(e);
                            }
                            
                            
                        }
                    }
                }
            }
            return result;

        }


        private static void LogDebug(object obj)
        {
            Log.Debug("[DB] " + obj);
        }


        private static void LogWarn(object obj)
        {
            Log.Warn("[DB] " + obj);
        }

        /// <summary>
        /// Simplified class of the <see cref="Player"/>; used for database handling
        /// </summary>
        internal class PlayerInfo
        {
            public string UserId { get; private set; }
            private AuthenticationType authType { get; set; }


            public string AuthType => Enum.GetName(typeof(AuthenticationType), authType);

            private PlayerInfo(Player p)
            {
                UserId = p.UserId.Remove(p.UserId.LastIndexOf('@'));
                authType = p.AuthenticationType;
            }

            internal static PlayerInfo Create(Player p)
            {
                var auth = p.AuthenticationType;
                if (!Config.AllowedAuthenticationTypes.Contains(auth))
                {
                    Log.Error("couldn't get the player info (wrong auth)");
                    return null;
                }




                return new PlayerInfo(p);
            }
            

            internal static bool TryCreate(Player p,out PlayerInfo pInfo)
            {
                pInfo = Create(p);
                return pInfo != null;
            }
            
            

            /// <summary>
            /// Gets the online <see cref="Player"/>
            /// </summary>
            /// <returns>the <see cref="Player"/> only if it's connected and verified; null otherwise</returns>
            internal Player GetPlayer()
            {
                return Player.Enumerable.FirstOrDefault(a =>
                    a.AuthenticationType == authType && a.UserId.Remove(a.UserId.LastIndexOf('@')) == UserId);
            }
        }
    }
}
