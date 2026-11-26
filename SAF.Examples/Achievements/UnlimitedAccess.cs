using Exiled.API.Features;
using Exiled.API.Features.Items;
using Exiled.API.Features.Items.Keycards;
using Exiled.API.Interfaces.Keycards;
using Exiled.Events.EventArgs.Player;
using KE.Utils.API.Interfaces;
using ServerAchievementFramework.API.Feature;
using ServerAchievementFramework.API.Interface;

namespace SAF.Examples.Achievements
{
    public class UnlimitedAccess : AchievementItem, IUsingEvents
    {
        public override string Name => "Unlimited Access";

        public override string Description => "Get an Omni-Card";

        protected override bool CheckItem(Item item)
        {
            if (item is null) return false;

            Log.Info(item.Type);
            if (item is not CustomKeycardItem key) return false;
            Log.Info("keycard");

            if (key is not ILabelKeycard labelKeycard) return false;

            Log.Info("label ="+labelKeycard.Label);


            return labelKeycard.Label == "Omni-Card";

        }

    }
}
