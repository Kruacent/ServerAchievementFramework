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
    public abstract class Achievement
    {
        public void GiveAchievement(Player player)
        {
            AchievementController.Instance.GiveAchievement(null, player);
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
