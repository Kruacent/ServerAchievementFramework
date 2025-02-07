using Exiled.API.Features;
using ServerAchievementFramework.API.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utils.NonAllocLINQ;

namespace ServerAchievementFramework.API.Feature
{
    public abstract class Achievement : IAchievement
    {
        public abstract string Name { get; }
        public abstract string Description { get; }
        public abstract bool IsHidden { get; }

        protected void GiveAchievement(Player player)
        {
            AchievementController.Instance.GiveAchievement(this, player);
        }

        protected void GiveAchievement(IEnumerable<Player> players)
        {
            foreach (Player p in players)
            {
                GiveAchievement(p);
            }
        }


        public static IAchievement GetAchievement(string name)
        {
            foreach (IAchievement a in AchievementController.AchievementPlayer.Keys)
            {
                if (a.Name == name)
                    return a;
            }
            return null;
        }
    }
}
