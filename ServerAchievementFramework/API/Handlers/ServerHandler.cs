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
            Achievement.DeactivateAll();
        }

        public void OnRestartingRound()
        {
            
            Achievement.DeactivateAll();
        }


        internal void OnVerified(VerifiedEventArgs ev)
        {
            
            Player player = ev.Player;
            if (player == null)
                return;
            try
            {
                if (player.DoNotTrack)
                {
                    Log.Debug("dnt player aborting");
                    Database.Instance.RemoveIfExist(player);
                    return;
                }
                Database.Instance.AddIfNotExist(player);
                Achievement.AddListOfAchievement(player, Database.Instance.GetAchievements(player));
            }
            catch (Exception e)
            {
                Log.Warn(e);
                Log.Warn("Error while updating the record to the database ; the database is probably off");
            }
            
            
            

        }
    }
}
