using Exiled.API.Features;
using Exiled.Events.EventArgs.Player;
using Exiled.Events.EventArgs.Server;
using Exiled.Events.EventArgs.Warhead;
using ServerAchievementFramework.API.Feature;
using ServerAchievementFramework.API.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAF.Examples.Achievements
{
    public class ButIDontNeedYou : IAchievement, IEventAchievement
    {
        public string Name => "...but I don't need you";
        public string Description => "Be the sole human on surface when the deadman explode";
        public bool IsHidden => false;

        public void SubscribeEvent()
        {
            Exiled.Events.Handlers.Warhead.Detonated += OnDetonated;
        }

        public void UnsubscribeEvent()
        {
            Exiled.Events.Handlers.Warhead.Detonated -= OnDetonated;
        }

        public void OnDetonated()
        {
            if (Warhead.DeadmanSwitchEnabled)
            {
                var aliveHumans = Player.List.Where(p => p.IsAlive && p.IsHuman).ToList();
                if (aliveHumans.Count() == 1)
                {
                    AchievementController.Instance.GiveAchievement(this, aliveHumans[0]);
                }
            }
        }
    }
}
