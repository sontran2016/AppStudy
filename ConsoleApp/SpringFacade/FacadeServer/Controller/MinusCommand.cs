using FacadeServer.Model;
using PureMVC.Interfaces;
using PureMVC.Patterns;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace FacadeServer.Controller
{
    public class MinusCommand : SimpleCommand, ICommand
    {
        public const string Name = "MinusCommandName";

        void ICommand.Execute(INotification notify)
        {
            var proxy = Facade.RetrieveProxy(MinusProxy.Name) as MinusProxy;
            if (proxy == null)
                Console.WriteLine("error");
            else
            {
                proxy.Data = notify.Body;
                var m = proxy.MyMinus();
                Console.WriteLine("MyMinus(): " + m);
            }
        }
    }
}
