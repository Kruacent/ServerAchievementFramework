using Exiled.API.Features;
using Exiled.Events.EventArgs.Player;
using Exiled.Events.EventArgs.Server;
using KE.Utils.API.Features.SCPs;
using KE.Utils.API.Interfaces;
using PlayerRoles;
using ServerAchievementFramework.API.Feature;
using ServerAchievementFramework.API.Interface;
using System.Linq;

namespace SAF.Examples.Achievements
{
    public class Speedrun : Achievement, IUsingEvents
    {
        public override string Name => "Speedrun";
        public override string Description => "As any SCP, win before any respawn wave";
        public override bool IsHidden => false;

        public void SubscribeEvents()
        {
            Exiled.Events.Handlers.Server.RoundEnded += OnRoundEnded;
        }

        public void UnsubscribeEvents()
        {
            Exiled.Events.Handlers.Server.RoundEnded -= OnRoundEnded;
        }

        public void OnRoundEnded(RoundEndedEventArgs ev)
        {
            if(SCPTeam.SCPs.Count > 0)
            {

                foreach(ReferenceHub hub in SCPTeam.SCPs)
                {
                    Player player = Player.Get(hub);

                    if(player != null)
                    {
                        GiveAchievement(player);
                    }
                }
            }

        }
    }
}
