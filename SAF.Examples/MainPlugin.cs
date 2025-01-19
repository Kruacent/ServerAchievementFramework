using Exiled.API.Enums;
using Exiled.API.Features;
using System;

namespace SAF.Examples
{
    public class MainPlugin : Plugin<Config>
    {
        public override string Name => "SAF.Examples";
        public override string Author => "Patrique";
        public override Version RequiredExiledVersion => new Version(9, 4);
        
        public override PluginPriority Priority => PluginPriority.Lower;
        public override void OnEnabled()
        {
        }

        public override void OnDisabled()
        {
        }
    }
}
