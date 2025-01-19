using Exiled.API.Features;
using Exiled.Events.EventArgs.Server;
using ServerAchievementFramework.API.Feature;
using ServerAchievementFramework.API.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAF.Examples.Achievements
{
    public class FuckYouGuys : IAchievement, IEventAchievement
    {
        public string Name => "Fuck You Guys";
        public string Description => "Respawn alone at ALL respawns in the round until the deadman switch";
        public bool IsHidden => true;
        public List<Player> Counter = Player.List.ToList();

        public void SubscribeEvent()
        {
            Exiled.Events.Handlers.Server.RespawningTeam += OnRespawningTeam;
            Exiled.Events.Handlers.Warhead.Detonated += OnDetonated;
        }

        public void UnsubscribeEvent()
        {
            Exiled.Events.Handlers.Server.RespawningTeam -= OnRespawningTeam;
            Exiled.Events.Handlers.Warhead.Detonated -= OnDetonated;
        }

        public void OnDetonated()
        {
            if (Warhead.DeadmanSwitchEnabled)
            {
                Counter.ForEach(p =>
                {
                    AchievementController.Instance.GiveAchievement(this,p);
                });
            }
        }

        public void OnRespawningTeam(RespawningTeamEventArgs ev)
        {
            if (ev.Players.Count != 1)
            {
                Counter = new List<Player>();
                return;
            }

            Counter = Counter.Except(Player.List.Except(ev.Players)).ToList();
            
            
        }
    }
}
