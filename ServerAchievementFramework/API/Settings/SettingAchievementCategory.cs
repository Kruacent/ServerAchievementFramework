using Exiled.API.Features;
using Exiled.API.Features.Core.UserSettings;
using InventorySystem.Items.Firearms.Modules.Scp127;
using KE.Utils.API.Settings.SettingsCategories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserSettings.ServerSpecific;

namespace ServerAchievementFramework.API.Settings
{
    public class SettingAchievementCategory : SettingsCategory
    {

        public List<SettingBase> AdditionalSettings { get; set; }
        public SettingAchievementCategory(HeaderSetting header, ushort priority, List<SettingBase> settings) : base(header, priority, settings)
        {

            AdditionalSettings = new();
        }

        protected override List<SettingBase> Conct()
        {

            var list = new List<SettingBase>()
            {
                Header,

            };

            list.AddRange(Settings);

            list.AddRange(AdditionalSettings);
            return list;
        }

        public void Send(Player player)
        {

            var setts = AllSettings.ToList();



            setts.AddRange(AdditionalSettings);





            ServerSpecificSettingsSync.SendToPlayer(player.ReferenceHub, setts.Select((SettingBase s) => s.Base).ToHashSet().ToArray());
            
        }


    }
}
