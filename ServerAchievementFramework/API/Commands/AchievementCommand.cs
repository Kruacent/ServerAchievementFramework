
using CommandSystem;
using Exiled.API.Features;
using AchievementFeature = ServerAchievementFramework.API.Feature.AchievementController;
using System;
using System.Collections.Generic;
using ServerAchievementFramework.API.Interface;

namespace ServerAchievementFramework.API.Commands
{
    [CommandHandler(typeof(ClientCommandHandler))]
    public class AchievementCommand : ICommand
    {
        public string Command { get; } = "achievement";
        public string[] Aliases { get; } = new string[] { "ach" };
        public string Description { get; } = "List all of the achievement";

        public bool Execute(ArraySegment<string> arguments, ICommandSender sender, out string response)
        {
            Player player = Player.Get((CommandSender)sender);
            response = "Achievements list:\n";
            if(player == null)
                return false;
            foreach (var kv in AchievementFeature.AchievementPlayer)
            {
                IAchievement achievement = kv.Key;
                bool locked = !kv.Value.Contains(player);

                if(achievement.IsHidden && locked)
                    response += "HIDDEN ACHIEVEMENT - Unlock it to know more about it";
                else
                    response += $"{achievement.Name} - {achievement.Description}";
                    
                if (locked)
                    response += " [LOCKED]";
                else
                    response += " [UNLOCKED]";

                response += "\n";
            }
            return true;
        }
    }
}
