using PureMVC.Patterns;
using ServerService.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FacadeServer.Model
{
    public class MinusProxy : Proxy
    {
        public const string Name = "MinusProxyName";
        public MinusProxy() : base(Name)
        {
        }
        public int MyMinus()
        {
            var p = Data as TaskDataModel;
            if (p == null)
                return 0;
            else
                return p.a - p.b;
        }
    }
}
