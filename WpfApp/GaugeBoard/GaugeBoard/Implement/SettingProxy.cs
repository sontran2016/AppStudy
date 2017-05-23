using GaugeBoard.Common;
using GaugeBoard.Interface;
using PureMVC.Patterns;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GaugeBoard.Implement
{
    public class SettingProxy :Proxy, ISettingProxy
    {
        private GaugeContext db;
        public SettingProxy() : base(ProxyNames.SettingProxy)
        {
            db = new GaugeContext();
        }

        public override void OnRegister()
        {
            base.OnRegister();            
        }

        public int Add(Setting model, out string message)
        {
            try
            {
                message = "";
                db.Settings.Add(model);
                int m = db.SaveChanges();
                return m;
            }
            catch (Exception e)
            {
                message = e.Message;
                return 0;
            }
        }

        public int Update(Setting model, out string message)
        {
            try
            {
                message = "";
                var m = db.Settings.Count();
                if (m == 0)
                {
                    message = "No data found";
                    return 0;
                }
                var data = db.Settings.First();
                data.Email = model.Email;
                data.MaxTemperature = model.MaxTemperature;
                data.MaxHumidity = model.MaxHumidity;
                data.MaxDirty = model.MaxDirty;
                data.IsWarning = model.IsWarning;
                data.WarningTime = model.WarningTime;

                db.Entry(data).State = EntityState.Modified;
                m = db.SaveChanges();
                return m;
            }
            catch (Exception e)
            {
                message = e.Message;
                return 0;
            }
        }

        public Setting Get(out string message)
        {
            try
            {
                message = "";
                var model = db.Settings.FirstOrDefault();
                return model;
            }
            catch (Exception e)
            {
                message = e.Message;
                return null;
            }
        }
    }
}
