using Exiled.API.Features;
using Exiled.Events.EventArgs.Player;
using ServerAchievementFramework.API.Feature;
using ServerAchievementFramework.API.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utils.NonAllocLINQ;

namespace SAF.Examples.Achievements
{
    public class LoveUpDown : Achievement, IEventAchievement
    {
        public override string Name => "I love when you go up and down baby";
        public override string Description => "As any class, activate all elevator from the inside at least once in the round";
        public override bool IsHidden => false;

        public Dictionary<Player, HashSet<Lift>> Counter = Player.List.ToDictionary(x => x, x => new HashSet<Lift>());

        public void SubscribeEvent()
        {
            Exiled.Events.Handlers.Player.InteractingElevator += OnInteractingElevator;
            Exiled.Events.Handlers.Player.Verified += OnVerified;
        }

        public void UnsubscribeEvent()
        {
            Exiled.Events.Handlers.Player.InteractingElevator -= OnInteractingElevator;
            Exiled.Events.Handlers.Player.Verified -= OnVerified;
        }

        public void OnInteractingElevator(InteractingElevatorEventArgs ev)
        {
            if (ev.IsCalledFromInside)
            {
                Counter[ev.Player].Add(ev.Lift);
            }

            if (Lift.List.All(v => Counter[ev.Player].Contains(v)))
                GiveAchievement(ev.Player);
        }
        public void OnVerified(VerifiedEventArgs ev) 
        {
            if (ev.Player.DoNotTrack)
                return;

            Counter.Add(ev.Player, new HashSet<Lift>());
        }
    }
}
