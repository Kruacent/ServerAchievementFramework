using Exiled.API.Enums;
using Exiled.API.Features;
using Exiled.API.Interfaces;
using ServerAchievementFramework.API.Feature;
using ServerAchievementFramework.API.Handlers;
using ServerAchievementFramework.API.Utils;
using System;

namespace ServerAchievementFramework
{
    public class MainPlugin : Plugin<Config>
    {
        public static MainPlugin Instance { get; private set; }
        public override string Name => "SAFramework";
        public override string Author => "Patrique";
        public override string Prefix => "SAF";
        public override Version Version => new Version(1, 0, 0);
        public override Version RequiredExiledVersion => new Version(9,4);
        public override PluginPriority Priority => PluginPriority.Highest;

        internal ServerHandler ServerHandler { get; private set; }
        public override void OnEnabled()
        {
            Instance = this;
            Loader.Load();

            ServerHandler = new ServerHandler();

            Exiled.Events.Handlers.Player.Verified += ServerHandler.OnVerified;
            Exiled.Events.Handlers.Server.RoundEnded += ServerHandler.OnRoundEnding;
            Exiled.Events.Handlers.Server.RestartingRound += ServerHandler.OnRestartingRound;

            base.OnEnabled();
        }
        public override void OnDisabled()
        {
            

            Exiled.Events.Handlers.Server.RoundEnded -= ServerHandler.OnRoundEnding;
            Exiled.Events.Handlers.Server.RestartingRound -= ServerHandler.OnRestartingRound;
            Exiled.Events.Handlers.Player.Verified -= ServerHandler.OnVerified;

            ServerHandler = null;
            Instance = null;
            base.OnDisabled();
        }


    }
}
