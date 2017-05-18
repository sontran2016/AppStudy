using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PureMVC.Interfaces;
using PureMVC.Patterns;
using FacadeServer.Model;

namespace FacadeServer.Controller
{
    public class TaskCommand:SimpleCommand, ICommand
    {
        public const string Name = "TaskCommandName";

        void ICommand.Execute(INotification notify)
        {
            var proxy = Facade.RetrieveProxy(TaskProxy.Name) as TaskProxy;            
            if (proxy == null)
                Console.WriteLine("error");
            else
            {
                proxy.Data = notify.Body;
                var m = proxy.MySum();
                Console.WriteLine("MySum(): " + m);
            }
        }
    }
}
