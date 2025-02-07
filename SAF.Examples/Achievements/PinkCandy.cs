using ServerAchievementFramework.API.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Exiled.Events.EventArgs.Player;
using ServerAchievementFramework.API.Feature;
using Exiled.API.Features;
using WarheadHandler = Exiled.Events.Handlers.Warhead;
using Exiled.Events.EventArgs.Warhead;

namespace SAF.Examples.Achievements
{
    public class PinkCandy : Achievement, IEventAchievement
    {
        public override string Name => "Kaboom? Kaboom";
        public override string Description => "Explose yourself now!";
        public override bool IsHidden => false;

        public void SubscribeEvent()
        {
            Exiled.Events.Handlers.Player.Dying += OnDying;
        }

        public void UnsubscribeEvent()
        {
            Exiled.Events.Handlers.Player.Dying -= OnDying;
        }

        public void OnDying(DyingEventArgs ev)
        {
            if (ev.DamageHandler.Type == Exiled.API.Enums.DamageType.Explosion && ev.DamageHandler.IsSuicide)
            {
                GiveAchievement(ev.Attacker);
            }

        }
    }
}
