using Exiled.API.Features;
using Exiled.Events.EventArgs.Player;
using Exiled.Events.EventArgs.Server;
using ServerAchievementFramework.API.Feature;
using ServerAchievementFramework.API.Utils;
using System;


namespace ServerAchievementFramework.API.Handlers
{
    internal class ServerHandler
    {
        public void OnRoundEnding(RoundEndedEventArgs _)
        {
            AchievementController.Instance.DeactivateAll();
        }

        public void OnRestartingRound()
        {
            AchievementController.Instance.DeactivateAll();
        }

        internal void OnVerified(VerifiedEventArgs ev)
        {
            if (ev.Player == null)
                return;
            try
            {
                if (ev.Player.DoNotTrack)
                {
                    Database.Instance.RemoveIfExist(ev.Player);
                    return;
                }
                Database.Instance.AddIfNotExist(ev.Player);
                AchievementController.Instance.AddListOfAchievement(ev.Player, Database.Instance.GetAchievements(ev.Player));
            }
            catch (Exception)
            {
                Log.Warn("Error while adding the record to the db ; the database is probably off");
            }
            
            
            

        }
    }
}
