using Exiled.API.Features;
using Exiled.Events.EventArgs.Player;
using ServerAchievementFramework.API.Feature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MEC;
using PlayerRoles;
using ServerAchievementFramework.API.Interface;
using KE.Utils.API.Interfaces;

namespace SAF.Examples.Achievements
{
    public class ActualKGBAgent : Achievement, IUsingEvents
    {
        public override string Name => "Holy hell, Actual KGB Agent";
        public override string Description => "Stay around a SCP for 3 min in a row without dying";
        public override bool IsHidden => false;
        public float RefreshRate => 1f;

        public float RadiusToCheck = 5f;
        private Dictionary<Player, uint> time = new Dictionary<Player, uint>();

        public void SubscribeEvents()
        {
            Exiled.Events.Handlers.Server.RoundStarted += OnRoundStarted;
        }

        public void UnsubscribeEvents()
        {
            Exiled.Events.Handlers.Server.RoundStarted -= OnRoundStarted;
        }

        public void OnRoundStarted()
        {

            Timing.RunCoroutine(CheckAroundSCPs());
        }

        private IEnumerator<float> CheckAroundSCPs()
        {
            while (Round.InProgress)
            {
                yield return Timing.WaitForSeconds(RefreshRate);
                Player.List.Where(p => p.IsScp && p.Role != RoleTypeId.Scp0492).ToList().ForEach(p =>
                {
                    Player.List.Where(h => h.IsHuman && h.IsAlive).ToList().ForEach(h =>
                    {
                        if (Math.Pow(h.Position.x - p.Position.x, 2) + Math.Pow(h.Position.y - p.Position.y, 2) <= Math.Pow(RadiusToCheck, 2))
                        {
                            if (!time.ContainsKey(h))
                                time[h] = 1;
                            else
                            {
                                Log.Debug($"{h.Nickname} is in the scp radius  ({time[h]})");
                                time[h]++;
                            }
                        }
                        else
                            time[h] = 0;

                        if (time[h] >= 180)
                            GiveAchievement(h);
                    });
                });


            }
        }
    }
}
