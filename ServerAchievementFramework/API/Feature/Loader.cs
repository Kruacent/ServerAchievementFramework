using Exiled.API.Features;
using Exiled.API.Interfaces;
using ServerAchievementFramework.API.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServerAchievementFramework.API.Feature
{
    internal class Loader
    {
        internal List<IPlugin<IConfig>> ActivePlugins => new List<IPlugin<IConfig>>();
        internal static Loader Instance { get; private set; } = new Loader();

        private Loader() { }
        internal void Load()
        {
            foreach (IPlugin<IConfig> plugin in Exiled.Loader.Loader.Plugins.Where(pl => pl.Name != MainPlugin.Instance.Name))
            {
                foreach (Type type in plugin.Assembly.GetTypes())
                {
                    try
                    {
                        if (type.IsSubclassOf(typeof(IAchievement)))
                        {
                            ActivePlugins.Add(plugin);
                            IAchievement ac = Activator.CreateInstance(type) as IAchievement;
                            Achievement.Instance.Register(ac);
                        }
                    }
                    catch (System.Exception e)
                    {
                        Log.Error($"Error registering in plugin {plugin.Name} : {e.Message}");
                    }
                }
            }
        }
    }
}
