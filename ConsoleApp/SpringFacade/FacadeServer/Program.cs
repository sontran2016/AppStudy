using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PureMVC.Interfaces;
using PureMVC.Patterns;
using System.Runtime.Remoting;
using System.Runtime.Remoting.Channels.Tcp;
using System.Configuration;
using System.Runtime.Remoting.Channels;
using ServerService.Implement;

namespace FacadeServer
{
    class Program
    {
        private static TcpChannel _serverChannel;
        static void Main(string[] args)
        {
            //Registering the tcp channel
            int port = Int32.Parse(ConfigurationManager.AppSettings["Port"]);
            _serverChannel = new TcpChannel(port);
            ChannelServices.RegisterChannel(_serverChannel, false);
            //Registering the server component as a server activated object (SOA)
            RemotingConfiguration.RegisterWellKnownServiceType(typeof(RemoteTaskService), "TaskService", WellKnownObjectMode.Singleton);
            MyFacade.GetInstance();

            //RemotingConfiguration.Configure("FacadeServer.exe.config",false);
            //IApplicationContext ctx = ContextRegistry.GetContext();
            //var p = (TaskService)ctx.GetObject("taskService");

            //MyFacade.GetInstance();
            //Notification notify = new Notification(TaskCommand.Name, new TaskData { a = 1, b = 2 });
            //p.HandleNotification(notify);

            //var p = MyFacade.GetInstance();
            //Facade.BroadcastNotification(TaskCommand.Name, new TaskData { a = 1, b = 2 });

            Console.WriteLine("Server listening...");
            Console.WriteLine("Press any key to exit...");
            Console.ReadLine();
            ChannelServices.UnregisterChannel(_serverChannel);
            _serverChannel = null;
        }
    }
}
