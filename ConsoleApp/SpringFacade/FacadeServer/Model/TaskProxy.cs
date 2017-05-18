using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PureMVC.Patterns;
using ServerService.Model;

namespace FacadeServer.Model
{
    public class TaskProxy:Proxy
    {
        public const string Name = "TaskProxyName";
        private GaugeContext db;
        public TaskProxy(): base(Name)
        {            
            db=new GaugeContext();
        }
        public int MySum()
        {
            var p = Data as TaskDataModel;
            if (p==null)
                return 0;
            else
                return p.a + p.b;
        }
    }
}
