using Exiled.Events.EventArgs.Player;
using ServerAchievementFramework.API.Feature;
using ServerAchievementFramework.API.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAF.Examples.Achievements
{
    public class DarkPlace : IAchievement, IEventAchievement
    {
        public string Name => "Dark Place";
        public string Description => "As a human , be warped in the Pocket dimension while you & SCP-106 both are in a blackouted room";
        public bool IsHidden => false;

        public void SubscribeEvent()
        {
            Exiled.Events.Handlers.Player.EnteringPocketDimension += OnEnteringPocketDimension;
        }

        public void UnsubscribeEvent()
        {
            Exiled.Events.Handlers.Player.EnteringPocketDimension -= OnEnteringPocketDimension;
        }

        public void OnEnteringPocketDimension(EnteringPocketDimensionEventArgs ev)
        {
            if (ev.Scp106.CurrentRoom.AreLightsOff && ev.Player.CurrentRoom.AreLightsOff)
            {
                AchievementController.Instance.GiveAchievement(this, ev.Player);
            }

        }
    }
}
