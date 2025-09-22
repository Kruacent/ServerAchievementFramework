
using CommandSystem;
using System;
namespace ServerAchievementFramework.API.Commands
{
    [CommandHandler(typeof(ClientCommandHandler))]
    public class AchievementCommand : ParentCommand
    {
        public AchievementCommand()
        {
            LoadGeneratedCommands();
        }
        public override string Command { get; } = "achievement";
        public override string[] Aliases { get; } = new string[] { "ach" };
        public override string Description { get; } = "List all of the achievement";

        public override void LoadGeneratedCommands()
        {
            RegisterCommand(new AList());
        }

        protected override bool ExecuteParent(ArraySegment<string> arguments, ICommandSender sender, out string response)
        {
            if (arguments.Count == 0)
            {
                response = "subcommand available : list, deleteall, privacy";
                return false;
            }
            response = "";
            return true;
        }

    }
}
