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
    internal static class Loader
    {
        internal static List<IPlugin<IConfig>> ActivePlugins => new List<IPlugin<IConfig>>();
        internal static void Load()
        {
            foreach (IPlugin<IConfig> plugin in Exiled.Loader.Loader.Plugins.Where(pl => pl.Name != MainPlugin.Instance.Name))
            {
                foreach (Type type in plugin.Assembly.GetTypes())
                {
                    try
                    {
                        if (type.IsSubclassOf(typeof(Achievement)))
                        {
                            Log.Debug("adding plugin " + type.Name);
                            ActivePlugins.Add(plugin);
                            Achievement ac = Activator.CreateInstance(type) as Achievement;
                            ac.PrefixPlugin = plugin.Prefix;
                            Achievement.Register(ac);
                        }
                    }
                    catch (System.Exception e)
                    {
                        Log.Error($"Error registering in plugin {plugin.Name},{type.Name}  : {e.Message}");
                    }
                }
            }
        }
    }
}
