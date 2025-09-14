using Exiled.API.Enums;
using Exiled.API.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServerAchievementFramework
{
    public class Config : IConfig
    {
        public bool IsEnabled { get; set; } = true;
        public bool Debug { get; set; } = true;

        public string ServerHostName { get; set; } = "localhost";
        public ushort ServerPort { get; set; } = 3306;
        public string User { get; set; } = "SAFUser";
        public string DBName { get; set; } = "SAFSql";
        public string Password { get; set; } = "gexiled69";


        public List<AuthenticationType> AllowedAuthenticationTypes { get; set; } = new()
        {
            AuthenticationType.Steam,
            AuthenticationType.Discord,
            AuthenticationType.Northwood
        };

    }
}
