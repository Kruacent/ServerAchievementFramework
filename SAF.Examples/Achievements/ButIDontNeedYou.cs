using Exiled.API.Features;
using KE.Utils.API.Interfaces;
using ServerAchievementFramework.API.Feature;
using System.Linq;

namespace SAF.Examples.Achievements
{
    public class ButIDontNeedYou : Achievement, IUsingEvents
    {
        public override string Name => "...but I don't need you";
        public override string Description => "Be the sole human on surface when the deadman explode";
        public override bool IsHidden => false;

        public void SubscribeEvents()
        {
            Exiled.Events.Handlers.Warhead.Detonated += OnDetonated;
        }

        public void UnsubscribeEvents()
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
                    GiveAchievement(aliveHumans.First());
                }
            }
        }
    }
}
