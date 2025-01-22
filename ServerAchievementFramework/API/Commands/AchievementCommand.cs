
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
            response = "<color=#0000ff>Achievements list:</color>\n";
            if(player == null)
                return false;
            
            int i = 0;
            foreach (var kv in AchievementFeature.AchievementPlayer)
            {
                
                IAchievement achievement = kv.Key;
                bool locked = !kv.Value.Contains(player);
                response += $"<color={(locked ? (i%2==0 ? "#800000" : "#b30000") : (i%2==0 ? "green" : "#00b300"))}>";
                if (achievement.IsHidden && locked)
                    response += "[HIDDEN ACHIEVEMENT] - Unlock it to know more about it";
                else
                    response += $"[{achievement.Name}] - {achievement.Description}";
                    
                if (locked)
                    response += " (LOCKED)";
                else
                    response += " (UNLOCKED)";

                response += "</color>\n\n";
                i++;
            }
            return true;
        }
    }
}
