using Exiled.API.Features;
using ServerAchievementFramework.API.Interface;
using ServerAchievementFramework.API.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServerAchievementFramework.API.Feature
{
    /// <summary>
    /// used for cross-round counting
    /// </summary>
    public abstract class CounterAchievement : Achievement
    {
        protected override void AddProgress(Player player, uint progressToAdd = 1)
        {
            base.AddProgress(player, progressToAdd);


            try
            {
                Database.Instance.AddProgress(player, this);
            }
            catch (Exception)
            {
                Log.Warn("Error while adding the record to the database ; the database is probably off");
            }

        }

    }
}
