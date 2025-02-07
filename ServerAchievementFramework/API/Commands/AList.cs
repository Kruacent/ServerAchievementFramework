using CommandSystem;
using Exiled.API.Features;
using ServerAchievementFramework.API.Interface;
using System;
using AchievementFeature = ServerAchievementFramework.API.Feature.AchievementController;

namespace ServerAchievementFramework.API.Commands
{
    
    public class AList : ICommand
    {
        public string Command { get; } = "list";
        public string[] Aliases { get; } = new string[] { "l","ls","lst" };
        public string Description { get; } = "List all achievements";


        public bool Execute(ArraySegment<string> arguments, ICommandSender sender, out string response)
        {
            if (arguments.Count > 1)
            {
                response = "usage: achievement list <playerName>";
                return false;
            }

            Player player;
            Player playerExe = null;
            if (arguments.Count > 0)
            {
                playerExe = Player.Get((CommandSender)sender);
                player = Player.Get(arguments.At(1));
            }
            else
                player = Player.Get((CommandSender)sender);

            response = $"<color=#0000ff>Achievements list ({player.Nickname}):</color>\n";
            if (player == null)
            {
                response = "player not found";
                return false;
            }
                
            response += ShowAchievements(player,playerExe);
            return true;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="p">The player we wants their achievements</param>
        /// <param name="playerExe">The player wanting the Achievement</param>
        /// <returns></returns>
        private string ShowAchievements(Player p,Player playerExe)
        {
            string response = string.Empty;
            int i = 0;
            foreach (var kv in AchievementFeature.AchievementPlayer)
            {

                IAchievement achievement = kv.Key;
                bool locked = !kv.Value.Contains(p);
                bool exelocked = true;
                if(playerExe != null)
                {
                    exelocked = !kv.Value.Contains(playerExe);
                }
                response += $"<color={(locked ? (i % 2 == 0 ? "#800000" : "#b30000") : (i % 2 == 0 ? "green" : "#00b300"))}>";
                if (achievement.IsHidden && locked && exelocked)
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

            return response;
        }
    }
}
