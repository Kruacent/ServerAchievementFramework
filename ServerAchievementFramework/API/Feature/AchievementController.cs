using Achievements;
using Exiled.API.Features;
using ServerAchievementFramework.API.Interface;
using ServerAchievementFramework.API.Utils;
using System;
using System.Collections.Generic;
using Utils.NonAllocLINQ;

namespace ServerAchievementFramework.API.Feature
{
    public class AchievementController
    {
        public static AchievementController Instance { get; private set; } = new AchievementController();

        private AchievementController() { }

        internal static Dictionary<IAchievement,List<Player>> AchievementPlayer = new Dictionary<IAchievement, List<Player>>();
        public static void Register(IAchievement achievement)
        {
            Log.Send($"REGISTERING {achievement.Name}", Discord.LogLevel.Info, ConsoleColor.DarkBlue);
            if (AchievementPlayer.ContainsKey(achievement))
            {
                Log.Warn($"achievement {achievement.Name} already exists");
            }
            else
            {
                if (achievement is IEventAchievement eventAchievement)
                {
                    eventAchievement.SubscribeEvent();
                }
                AchievementPlayer.Add(achievement,new List<Player>());
                Database.Instance.AddAchievementToDB(achievement);
            }

        }


        public void GiveAchievement(IAchievement achievement, Player player)
        {
            Log.Debug($"trying giving achievement {achievement.Name} to the player {player.Nickname} ({player.UserId})");
            if(AchievementPlayer.TryGetValue(achievement, out List<Player> players))
            {
                if (players.Contains(player))
                {
                    Log.Warn($"player {player.Nickname} ({player.UserId}) already has the achievement {achievement.Name}");
                    return;
                }
                try
                {
                    Database.Instance.AddAchievement(player, achievement);
                }
                catch (Exception)
                {
                    Log.Warn("Error while adding the record to the db ; the database is probably off");
                }
                players.Add(player);
                Show(achievement, player);
            }
            else
            {
                Log.Warn("Achievement not found, please register it before using it");
            }
            
        }

        private void Show(IAchievement achievement, Player player)
        {
            Hint hint = new Hint()
            {
                Content = $"Achievement Unlocked!\n{achievement.Name}!",
                Duration = 10,
            };
            player.ShowHint(hint);
            
        }


        internal void DeactivateAll()
        {
            AchievementPlayer.ForEachKey(a =>
            {
                if (a is IEventAchievement e)
                {
                    e.UnsubscribeEvent();
                }
            });
        }



        internal void AddListOfAchievement(Player player,List<IAchievement> achievement)
        {
            foreach (IAchievement a in achievement)
            {
                AchievementPlayer[a].Add(player);
            }
        }
    }
}
