using Exiled.API.Features.Items;
using Exiled.Events.EventArgs.Player;
using KE.Utils.API.Interfaces;
using ServerAchievementFramework.API.Feature;

namespace SAF.Examples.Achievements.CustomItems
{
    public abstract class AchievementItem : Achievement, IUsingEvents
    {
        public virtual void SubscribeEvents()
        {
            Exiled.Events.Handlers.Player.ChangedItem += OnChangedItem;
            Exiled.Events.Handlers.Player.ItemAdded += OnItemAdded;
        }

        public virtual void UnsubscribeEvents()
        {
            Exiled.Events.Handlers.Player.ChangedItem -= OnChangedItem;
            Exiled.Events.Handlers.Player.ItemAdded -= OnItemAdded;
        }

        private void OnChangedItem(ChangedItemEventArgs ev)
        {
            if (CheckItem(ev.Item))
            {
                GiveAchievement(ev.Player);
            }
        }

        private void OnItemAdded(ItemAddedEventArgs ev)
        {
            if (CheckItem(ev.Item))
            {
                GiveAchievement(ev.Player);
            }
        }


        protected virtual bool CheckItem(Item item)
        {
            return false;
        }
    }
}
