using System;
using System.Data.Entity;
using PureMVC.Interfaces;

namespace FacadeServer
{
    public class Setting
    {
        //[Key]
        //[DatabaseGenerated(DatabaseGeneratedOption.None)]
        //[SQLite.PrimaryKey, SQLite.AutoIncrement]
        public int Id { get; set; }
        public string Email { get; set; }
        public double MaxTemperature { get; set; }
        public double MaxHumidity { get; set; }
        public double MaxDirty { get; set; }
        public bool IsWarning { get; set; }
        public DateTime? WarningTime { get; set; }
        public DateTime LastUpdate { get; set; }
    }

    public class GaugeContext : DbContext
    {        
        public DbSet<Setting> Settings { get; set; }
        
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //Database does not pluralize table names
            //modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}
