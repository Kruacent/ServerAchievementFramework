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
            Log.Debug("role : " +ev.NewRole);
            if (!_roles.TryGetValue(ev.Player,out HashSet<string> playerRole))
            {
                var a = new HashSet<string>();
                _roles.Add(ev.Player, a);
                playerRole = a;
            }


            if(ev.NewRole == RoleTypeId.None || ev.NewRole == RoleTypeId.Spectator)
            {
                _roles[ev.Player] = new HashSet<string>();
                return;
            }



            VerifyRole(playerRole, ev.NewRole);
            AttributeRole(ev.Player);
        }
        private void VerifyRole(HashSet<string> roleList,RoleTypeId role)
        {
            if (role.IsNtf())
            {
                if (!roleList.Contains(roles[3]))
                {
                    roleList.Add(roles[3]);
                }
            }


            if (role.IsChaos())
            {
                if (!roleList.Contains(roles[4]))
                {
                    roleList.Add(roles[4]);
                }
            }
            switch (role)
            {
                case RoleTypeId.FacilityGuard:
                    roleList.Add(roles[0]);
                    break;
                case RoleTypeId.Scientist:
                    roleList.Add(roles[1]);
                    break;
                case RoleTypeId.ClassD:
                    roleList.Add(roles[2]);
                    break;
            }
        }
        
    
        private void AttributeRole(Player p)
        {
            _roles.TryGetValue(p, out var value);
            Log.Debug($"did {value.Count} roles ");
            if(value.Count == 5)
            {
                GiveAchievement(p);
            }
        }
    }
}
