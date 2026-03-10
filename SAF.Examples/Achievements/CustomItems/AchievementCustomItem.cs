using Exiled.API.Features;
using Exiled.API.Features.Items;
using Exiled.Events.EventArgs.Player;
using KE.Items.API.Features;
using KE.Utils.API.Interfaces;
using ServerAchievementFramework.API.Feature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAF.Examples.Achievements.CustomItems
{
    public abstract class AchievementCustomItem : AchievementItem, IUsingEvents
    {

        public abstract string CustomItemName { get; }


        protected override bool CheckItem(Item item)
        {
            if (KECustomItem.TryGet(CustomItemName, out KECustomItem ci))
            {
                return ci.Check(item);
            }
            else
            {
                Log.Warn(CustomItemName + " not found");
            }
            return false;
        }
    }
}
