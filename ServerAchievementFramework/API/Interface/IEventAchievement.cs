using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServerAchievementFramework.API.Interface
{
    public interface IEventAchievements
    {
        void SubscribeEvent();
        void UnsubscribeEvent();

    }

}
