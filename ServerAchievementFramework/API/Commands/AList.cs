using CommandSystem;
using Exiled.API.Features;
using Exiled.API.Features.Pools;
using ServerAchievementFramework.API.Feature;
using ServerAchievementFramework.API.Interface;
using System;
using System.Text;

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
            {
                player = Player.Get((CommandSender)sender);
            }

            if (player == null)
            {
                response = "player not found";
                return false;
            }
            response = $"<color=#0000ff>Achievements list ({player.Nickname}):</color>\n";
            response += ShowAchievements(player,playerExe);
            return true;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="p">The player we wants their achievements</param>
        /// <param name="playerExe">The player doing the command</param>
        /// <returns></returns>
        private string ShowAchievements(Player p,Player playerExe)
        {
            StringBuilder builder = StringBuilderPool.Pool.Get();
            
            int i = 0;
            foreach (var achievement in Achievement.Registered)
            {
                bool locked = !achievement.HasUnlockedIt(p);
                bool exelocked = true;
                if(playerExe != null)
                {
                    exelocked = !achievement.HasUnlockedIt(playerExe);
                }
                builder.Append($"<color={(locked ? (i % 2 == 0 ? "#800000" : "#b30000") : (i % 2 == 0 ? "green" : "#00b300"))}>");
                if (achievement.IsHidden && locked && exelocked)
                {
                    builder.Append("[HIDDEN ACHIEVEMENT] - Unlock it to know more about it");
                }
                else
                {
                    builder.Append($"[{achievement.Name}] - {achievement.Description}");
                }
                    

                if (locked)
                    builder.Append(" (LOCKED)");
                else
                    builder.Append(" (UNLOCKED)");

                if(achievement.Objective != 1)
                {
                    builder.Append(" (");
                    if(achievement.TryGetProgress(p,out uint counter))
                    {
                        builder.Append(counter);
                    }
                    else
                    {
                        builder.Append(Achievement.StartingValue);
                    }

                    builder.Append("/" + achievement.Objective + ")");
                }


                builder.Append("</color>\n\n");
                i++;
            }
            string response = builder.ToString();
            StringBuilderPool.Pool.Return(builder);
            return response;
        }
    }
}
