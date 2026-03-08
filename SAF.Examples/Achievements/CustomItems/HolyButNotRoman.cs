using Exiled.Events.EventArgs.Player;
using KE.Utils.API.Features.SCPs;
using KE.Utils.API.Interfaces;
using ServerAchievementFramework.API.Feature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAF.Examples.Achievements.CustomItems
{
    public class HolyButNotRoman : AchievementCustomItem
    {
        public override string Name => "Holy but not Roman ";
        public override string Description => "Obtain the Holy Grenade";
        public override bool IsHidden => true;

        public override string CustomItemName => "SainteGrenada";
    }
}
