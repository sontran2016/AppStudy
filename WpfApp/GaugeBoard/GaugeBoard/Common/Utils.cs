using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SQLite;
using System.Windows.Interop;
using GaugeBoard.Implement;

namespace GaugeBoard
{
    class Utils
    {
        public static void InitDatabase()
        {
            var path = System.AppDomain.CurrentDomain.BaseDirectory;
            if(File.Exists(path+ "db.sqlite"))
                return;
            var pathSql = path.Replace(@"\bin\Debug\", "");
            string sql;
            sql = File.ReadAllText(pathSql + @"\Data\gauge.sql");

            SQLiteConnection.CreateFile("db.sqlite");
            var dbConnection = new SQLiteConnection("Data Source=db.sqlite");
            dbConnection.Open();

            SQLiteCommand command = new SQLiteCommand(sql, dbConnection);
            command.ExecuteNonQuery();
            dbConnection.Close();

            //init data
            var model = new Setting()
            {
                MaxTemperature = 50,
                MaxHumidity = 50,
                MaxDirty = 0.3,
                LastUpdate = DateTime.Now
            };
            string msg;
            var cls=new SettingProxy();
            cls.Add(model, out msg);
            if(msg!="")
                throw new Exception(msg);
        }
    }
}
