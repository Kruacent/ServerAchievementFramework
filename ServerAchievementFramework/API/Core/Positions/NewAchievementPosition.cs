using HintServiceMeow.Core.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServerAchievementFramework.API.Core.Positions
{
    internal class NewAchievementPosition : KE.Utils.API.Displays.DisplayMeow.Placements.HintPosition
    {
        public override float Xposition => 0;

        public override float Yposition => 200;

        public override HintAlignment HintAlignment => HintAlignment.Center;
        public override string Name => "NewAchievement";
    }
}
