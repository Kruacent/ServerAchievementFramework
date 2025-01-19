using Exiled.API.Features;
using Exiled.Events.EventArgs.Player;
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
    public class SorryGuys : IAchievement, IEventAchievement
    {
        public string Name => "Sorry Guys...";
        public string Description => "Respawn alone";
        public bool IsHidden => false;

        public void SubscribeEvent()
        {
            Exiled.Events.Handlers.Server.RespawningTeam += OnRespawningTeam;
        }

        public void UnsubscribeEvent()
        {
            Exiled.Events.Handlers.Server.RespawningTeam -= OnRespawningTeam;
        }

        public void OnRespawningTeam(RespawningTeamEventArgs ev)
        {
            if (ev.Players.Count == 1)
            {
                AchievementController.Instance.GiveAchievement(this, ev.Players[0]);
            }
                
        }
    }
}
