using Exiled.API.Features;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServerAchievementFramework.API.Interface
{
    public interface ICounterAchievement
    {
        Dictionary<Player,uint> Counter { get; set; }
        uint Objective { get; set; }
    }
}
