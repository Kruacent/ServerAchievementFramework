using Exiled.API.Extensions;
using Exiled.API.Features;
using Exiled.API.Features.Roles;
using Exiled.Events.EventArgs.Player;
using PlayerRoles;
using PluginAPI.Roles;
using ServerAchievementFramework.API.Feature;
using ServerAchievementFramework.API.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAF.Examples.Achievements
{
    public class BetrayPharmacy : Achievement, IEventAchievement
    {
        public override string Name => "Betray pills? More like Betray pharmacy";
        public override string Description => "Be all of the role in game (Guard,Scientist,Class-D,NTF,Chaos) in one life";
        public override bool IsHidden => false;
        private string[] roles = { "Guard", "Scientist","ClassD","NTF","Chaos" };
        private Dictionary<Player,HashSet<string>> _roles = new Dictionary<Player, HashSet<string>>();
        public override uint Objective => (uint)roles.Length;

        public void SubscribeEvent()
        {
            Exiled.Events.Handlers.Player.ChangingRole += OnChangingRole;
        }

        public void UnsubscribeEvent()
        {
            Exiled.Events.Handlers.Player.ChangingRole -= OnChangingRole;
        }

        private void OnChangingRole(ChangingRoleEventArgs ev)
        {
            Player player = ev.Player;
            Log.Debug("role : " +ev.NewRole);
            if (!_roles.ContainsKey(player))
            {
                _roles.Add(player, new HashSet<string>());
            }


            if(ev.NewRole == RoleTypeId.None || ev.NewRole == RoleTypeId.Spectator)
            {
                _roles[player] = new HashSet<string>();
                return;
            }



            if (VerifyRole(_roles[player], ev.NewRole))
            {
                Log.Debug($"did {_roles[player].Count} roles ");
                AddProgress(player);
            }
        }
        private bool VerifyRole(HashSet<string> roleList,RoleTypeId role)
        {
            if (role.IsNtf())
            {
                return roleList.Add(roles[3]);
            }


            if (role.IsChaos())
            { 
                return roleList.Add(roles[4]);
            }
            switch (role)
            {
                case RoleTypeId.FacilityGuard:
                    return roleList.Add(roles[0]);
                case RoleTypeId.Scientist:
                    return roleList.Add(roles[1]);
                case RoleTypeId.ClassD:
                    return roleList.Add(roles[1]);
                default:
                    break;
            }
            return false;
        }
    }
}
