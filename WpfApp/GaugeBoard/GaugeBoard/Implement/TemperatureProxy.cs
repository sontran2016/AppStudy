using GaugeBoard.Common;
using GaugeBoard.Interface;
using PureMVC.Patterns;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GaugeBoard.Implement
{
    public class TemperatureProxy : Proxy, ITemperatureProxy
    {
        private GaugeContext db;
        public TemperatureProxy() : base(ProxyNames.TemperatureProxy)
        {
            db = new GaugeContext();
        }

        public int Add(Temperature model, out string message)
        {
            try
            {
                message = "";
                db.Temperatures.Add(model);
                int m = db.SaveChanges();
                return m;
            }
            catch (Exception e)
            {
                message = e.Message;
                return 0;
            }
        }

        public List<Temperature> Get(int year, List<int> month, out string message)
        {
            try
            {
                message = "";
                var res = db.Temperatures.Where(x=>x.DateTime.Year==year && month.Any(y=>y.Equals(x.DateTime.Month))).ToList();
                return res;
            }
            catch (Exception e)
            {
                message = e.Message;
                return null;
            }
        }
    }
}
