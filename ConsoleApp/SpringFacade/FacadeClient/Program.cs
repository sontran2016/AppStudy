using PureMVC.Patterns;
using ServerService.Implement;
using ServerService.Model;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Runtime.Remoting.Channels;
using System.Runtime.Remoting.Channels.Tcp;
using System.Text;
using System.Threading.Tasks;

namespace FacadeClient
{
    class Program
    {
        static void Main(string[] args)
        {
            //Create the channel
            var clientChannel = new TcpChannel();
            //Register  the channel 
            ChannelServices.RegisterChannel(clientChannel, false);
            //Create a proxy object to access the remote calculator
            var server = ConfigurationManager.AppSettings["Server"];
            var port = ConfigurationManager.AppSettings["Port"];
            var remoteService = (RemoteTaskService)Activator.GetObject(typeof(RemoteTaskService), "tcp://" + server + ":" + port + "/TaskService");

            var data = new TaskDataModel {a = 1, b = 2};
            Notification notify = new Notification("TaskCommandName", data);
            remoteService.HandleService(notify);
            notify = new Notification("MinusCommandName", data);
            remoteService.HandleService(notify);
            Console.WriteLine("Notification has been sent");

            int m = remoteService.FuncSum(data);
            Console.WriteLine("FuncSum(): {0}", m);
            Console.ReadKey();
        }
    }
}
