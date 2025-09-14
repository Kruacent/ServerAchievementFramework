using Exiled.Events.EventArgs.Player;
using ServerAchievementFramework.API.Feature;
using ServerAchievementFramework.API.Interface;

namespace SAF.Examples.Achievements
{
    public class PinkCandy2 : CounterAchievement, IEventAchievement
    {
        public override string Name => "(Kaboom? Kaboom)²";
        public override string Description => "(Explose yourself now!)²";
        public override bool IsHidden => false;
        public override uint Objective => 10;

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
                AddProgress(ev.Player);
            }

        }
    }
}
