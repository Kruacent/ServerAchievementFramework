using Exiled.API.Features;
using Exiled.API.Interfaces;
using ServerAchievementFramework.API.Feature;
using System;

namespace ServerAchievementFramework
{
    public class MainPlugin : Plugin<Config>
    {
        public static MainPlugin Instance { get; private set; }
        public override string Name => "ServerAchievementFramework";
        public override string Author => "Patrique";
        public override string Prefix => "SAF";
        public override Version Version => new Version(1, 0, 0);
        public override void OnEnabled()
        {
            Instance = this;
            Loader.Instance.Load();
            base.OnEnabled();
        }
        public override void OnDisabled()
        {
            Instance = null;
            base.OnDisabled();
        }



    }
}
