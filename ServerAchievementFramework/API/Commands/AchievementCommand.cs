
using CommandSystem;
using Exiled.API.Features;
using AchievementFeature = ServerAchievementFramework.API.Feature.Achievement;
using System;
using System.Collections.Generic;
using ServerAchievementFramework.API.Interface;

namespace ServerAchievementFramework.API.Commands
{

    public class AchievementCommand : ICommand
    {
        public string Command { get; } = "achievement";
        public string[] Aliases { get; } = new string[] { "ach" };
        public string Description { get; } = "List all of the achievement";

        public bool Execute(ArraySegment<string> arguments, ICommandSender sender, out string response)
        {
            Player player = Player.Get((CommandSender)sender);
            response = "Achievement list:\n";
            if(player == null)
                return false;
            foreach (IAchievement achievement in AchievementFeature.Instance.Achievements)
            {
                if(AchievementFeature.Instance.AchievementPlayer.TryGetValue(achievement, out List<Player> players))
                {
                    response += $"{achievement.Name} - {achievement.Description}";
                    if (players.Contains(player))
                    {
                        response += "[UNLOCKED] ";
                    }
                    else
                    {
                        response += "[LOCKED]";
                    }
                    response += "\n";

                }
                else
                {
                    Log.Error("uh something wrong happened");
                }
            }
            return true;
        }
    }
}
