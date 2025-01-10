using Exiled.API.Features;
using ServerAchievementFramework.API.Interface;
using System.Collections.Generic;

namespace ServerAchievementFramework.API.Feature
{
    public class Achievement
    {
        public static Achievement Instance { get; private set; } = new Achievement();

        private Achievement() { }
        internal HashSet<IAchievement> Achievements = new HashSet<IAchievement>();

        internal Dictionary<IAchievement,List<Player>> AchievementPlayer = new Dictionary<IAchievement, List<Player>>();
        public void Register(IAchievement achievement)
        {
            Log.Debug($"registering achievement {achievement.Name}");
            if(Achievements.Contains(achievement))
            {
                Log.Warn($"achievement {achievement.Name} already exists");
            }
            else
            {
                Achievements.Add(achievement);
            }

        }


        public void GiveAchievement(IAchievement achievement, Player player)
        {
            Log.Debug($"trying giving achievement {achievement.Name} to the player {player.Nickname} ({player.UserId})");
            if(AchievementPlayer.TryGetValue(achievement, out List<Player> players))
            {
                if (players.Contains(player))
                {
                    Log.Debug($"player {player.Nickname} ({player.UserId}) already has the achievement {achievement.Name}");
                    return;
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
            Exiled.API.Features.Broadcast b = new Exiled.API.Features.Broadcast
            {

                Content = $"Player {player.Nickname} has earned the achievement {achievement.Name}!",
                Duration = 10,

            };
            player.Broadcast(b);
        }
    }
}
