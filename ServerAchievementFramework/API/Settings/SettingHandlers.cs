using Exiled.API.Features;
using Exiled.API.Features.Core.UserSettings;
using Exiled.API.Features.Pools;
using KE.Utils.API.Interfaces;
using KE.Utils.API.Settings.SettingsCategories;
using ServerAchievementFramework.API.Feature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserSettings.ServerSpecific;
using YamlDotNet.Core;

namespace ServerAchievementFramework.API.Settings
{
    internal class SettingHandler : IUsingEvents
    {
        private int headerid = 60000;
        private int syncid = 60001;


        private const int lowerBound = 100000;
        private int curr = lowerBound;

        private SettingAchievementCategory category;
        public SettingHandler()
        {

            HeaderSetting header = new HeaderSetting(headerid, "Achievements");
            List<SettingBase> setting =
                [
                    new ButtonSetting(syncid,"","Show/Resync Achievements"),
                ];




            category = new SettingAchievementCategory(header,1, setting);

        }

        public void SubscribeEvents()
        {
            ServerSpecificSettingsSync.ServerOnSettingValueReceived += SafeOnSettingValueReceived;
            Resync += OnResync;
        }

        public void UnsubscribeEvents()
        {
            ServerSpecificSettingsSync.ServerOnSettingValueReceived -= SafeOnSettingValueReceived;
            Resync -= OnResync;
        }

        private void OnResync(Player player)
        {
            category.AdditionalSettings = new();

            List<SettingBase> temp = ListPool<SettingBase>.Pool.Get();


            int counter = 0;


            foreach (var achievement in Achievement.Registered)
            {

                temp.Add(CreateAchievementText(achievement, player));
                
                if (achievement.HasUnlockedIt(player))
                {
                    counter++;
                }

            }
            float percent = (float) Math.Round(((float)counter / Achievement.Registered.Count)*100);
            

            category.AdditionalSettings.Add(new TextInputSetting(curr++, $"Completion : " + percent + '%', alignment: TMPro.TextAlignmentOptions.Left, header: category.Header));
            category.AdditionalSettings.AddRange(temp);

            ListPool<SettingBase>.Pool.Return(temp);

            SettingsCategory.Register(true);
        }
  
        private SettingBase CreateAchievementText(Achievement achievement,Player player)
        {
            return CreateAchievementText(achievement.GetText(player));
        }

        private SettingBase CreateAchievementText(string text)
        {
            return new TextInputSetting(curr++, text, alignment: TMPro.TextAlignmentOptions.Left, foldoutMode: SSTextArea.FoldoutMode.CollapsedByDefault, header: category.Header);
        }

        private void SafeOnSettingValueReceived(ReferenceHub hub,ServerSpecificSettingBase setting)
        {
            try
            {
                OnSettingValueReceived(hub, setting);
            }
            catch(Exception e)
            {
                Log.Error(e);
            }
        }


        private void OnSettingValueReceived(ReferenceHub hub, ServerSpecificSettingBase setting)
        {
            Player player = Player.Get(hub);
            if (setting is SSButton sSButton && setting.SettingId == syncid)
            {
                Resync?.Invoke(player);
            }
        }


        public static event Action<Player> Resync = delegate { };


        
    
    }
}
