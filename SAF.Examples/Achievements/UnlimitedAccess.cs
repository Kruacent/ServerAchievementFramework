using Exiled.API.Features.Items;
using Exiled.API.Features.Items.Keycards;
using Exiled.API.Interfaces.Keycards;
using Exiled.Events.EventArgs.Player;
using KE.Utils.API.Interfaces;
using ServerAchievementFramework.API.Feature;
using ServerAchievementFramework.API.Interface;

namespace SAF.Examples.Achievements
{
    public class UnlimitedAccess : Achievement, IUsingEvents
    {
        public override string Name => "Unlimited Access";

        public override string Description => "Get an Omni-Card";

        public void SubscribeEvents()
        {
            Exiled.Events.Handlers.Player.ChangedItem += ChangedItem;
        }



        public void UnsubscribeEvents()
        {
            Exiled.Events.Handlers.Player.ChangedItem -= ChangedItem;
        }


        private void ChangedItem(ChangedItemEventArgs ev)
        {



            Item item = ev.Item;

            if (item is null) return;

            if (item is not CustomKeycardItem key) return;

            if (key is not ILabelKeycard labelKeycard) return;

            if (labelKeycard.Label == "Omni-Card")
            {
                GiveAchievement(ev.Player);
            }
            
        }
    }
}
