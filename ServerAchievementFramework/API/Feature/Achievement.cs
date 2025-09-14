using Achievements;
using Exiled.API.Features;
using Org.BouncyCastle.Security.Certificates;
using ServerAchievementFramework.API.Interface;
using ServerAchievementFramework.API.Utils;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utils.NonAllocLINQ;

namespace ServerAchievementFramework.API.Feature
{
    public abstract class Achievement 
    {

        internal string PrefixPlugin { get; set; }
        /// <summary>
        /// The identification of the Achievement ; usually its name <br>
        /// By default it uses the class name
        /// </summary>
        public virtual string Id => GetType().Name;
        /// <summary>
        /// The Name that's showed to the Players
        /// </summary>
        public abstract string Name { get; }
        public abstract string Description { get; }
        public virtual bool IsHidden { get; } = false;

        private Dictionary<Player, uint> _counter { get; } = new();

        public virtual uint Objective { get; } = 1;

        public static IReadOnlyCollection<Achievement> Registered => list;
        private static HashSet<Achievement> list = new();
        public const uint StartingValue = 0;
        protected void GiveAchievement(Player player)
        {
            Log.Debug($"trying giving achievement {Name} to the player {player.Nickname} ({player.UserId})");

            if (HasUnlockedIt(player))
            {
                Log.Warn($"player {player.Nickname} ({player.UserId}) already has the achievement {Name}");
                return;
            }
            

            try
            {
                Database.Instance.AddAchievement(player, this);
            }
            catch (Exception e)
            {
                Log.Warn(e);
                Log.Warn("Error while adding the record to the database ; the database is probably off");
            }
            _counter.Add(player, Objective);
            Show(player);

        }

        #region getters
        public static bool TryGet(string id, string prefix, out Achievement achievement)
        {
            achievement = Get(id, prefix);
            return achievement != null;
        }

        public static Achievement Get(string id,string prefix)
        {
            foreach (Achievement a in Registered)
            {
                if (a.Id == id && a.PrefixPlugin == prefix)
                    return a;
            }
            return null;
        }

        #endregion

        public static void Register(Achievement achievement)
        {
            Log.Send($"REGISTERING {achievement.Name}", Discord.LogLevel.Info, ConsoleColor.DarkBlue);
            if (achievement == null)
            {
                Log.Error("achievement null");
                return;
            }
                
            if (Registered.Contains(achievement))
            {
                Log.Warn($"achievement {achievement.Name} already exists");
            }
            else
            {
                if (achievement is IEventAchievement eventAchievement)
                {
                    eventAchievement.SubscribeEvent();
                }
                list.Add(achievement);
                Database.Instance.AddAchievementToDB(achievement);
            }

        }
        private void Show(Player player)
        {
            Hint hint = new Hint()
            {
                Content = $"Achievement Unlocked!\n{Name}!",
                Duration = 10,
            };
            player.ShowHint(hint);

        }


        internal static void DeactivateAll()
        {
            foreach(Achievement achievement in Registered)
            {
                if (achievement is IEventAchievement @event)
                {
                    @event.UnsubscribeEvent();
                }
            }

        }



        internal static void AddListOfAchievement(Player player, IEnumerable<Achievement> achievements)
        {
            foreach (Achievement achievement in achievements)
            {
                achievement.SetAchievement(player);
            }
        }


        private void SetAchievement(Player player)
        {
            if (!_counter.ContainsKey(player))
            {
                _counter.Add(player, Objective);
            }
            else
            {
                _counter[player] = Objective;
            }


        }

        internal void SetProgress(Player player, uint progress)
        {
            if (!_counter.ContainsKey(player))
            {
                _counter.Add(player, progress);
            }else
            {
                _counter[player] = progress;
            }
            
        }

        protected virtual void AddProgress(Player player, uint progressToAdd = 1)
        {
            Log.Debug($"adding {progressToAdd} to {player.UserId}");
            if (!_counter.ContainsKey(player))
            {
                _counter.Add(player, StartingValue);
            }

            _counter[player] += progressToAdd;


            if (_counter[player] >= Objective)
            {
                GiveAchievement(player);
            }
        }


        public bool HasUnlockedIt(Player player)
        {
            if(_counter.TryGetValue(player,out uint counter))
            {
                return counter >= Objective;
            }

            return false;
        }

        public uint GetProgress(Player player)
        {
            return _counter[player];
        }

        public bool TryGetProgress(Player player, out uint counter)
        {
            
            return _counter.TryGetValue(player,out counter);
        }

        public override string ToString()
        {
            return $"{PrefixPlugin}.{Id}"; 
        }
    }
}
