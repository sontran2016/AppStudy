using System;
using System.Data.Entity;
using PureMVC.Interfaces;

namespace GaugeBoard
{
    public class Setting
    {
        //[Key]
        //[DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }
        public string Email { get; set; }
        public double MaxTemperature { get; set; }
        public double MaxHumidity { get; set; }
        public double MaxDirty { get; set; }
        public bool IsWarning { get; set; }
        public DateTime? WarningTime { get; set; }
        public DateTime LastUpdate { get; set; }
    }

    public class Temperature
    {
        public int Id { get; set; }
        public DateTime DateTime { get; set; }
        public double Value { get; set; }
    }
    public class Type
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Unit { get; set; }
    }
    public class Overload
    {
        public int Id { get; set; }
        public double Value { get; set; }
        public DateTime DateTime { get; set; }
        public int TypeId { get; set; }
        public Type Type { get; set; }

    }
    public class GaugeContext : DbContext
    {
        public DbSet<Type> Types { get; set; }
        public DbSet<Setting> Settings { get; set; }
        public DbSet<Temperature> Temperatures { get; set; }
        public DbSet<Overload> Overloads { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //Database does not pluralize table names
            //modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}