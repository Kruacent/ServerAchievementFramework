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
        public string Description => "As SCP-106 or the human targeted, warp someone to your dimension while you're both in a blackouted room";
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
            if( ev.Scp106.CurrentRoom.AreLightsOff && ev.Player.CurrentRoom.AreLightsOff)
            {
                Achievement.Instance.GiveAchievement(this, ev.Scp106);
                Achievement.Instance.GiveAchievement(this, ev.Player);
            }

        }
    }
}
