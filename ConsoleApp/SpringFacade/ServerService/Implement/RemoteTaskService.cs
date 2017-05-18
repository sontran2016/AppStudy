using PureMVC.Interfaces;
using PureMVC.Patterns;
using ServerService.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ServerService.Model;

namespace ServerService.Implement
{
    public class RemoteTaskService : MarshalByRefObject, ITask
    {
        public RemoteTaskService()
        {            
        }
        public void HandleService(INotification notify)
        {
            Facade.BroadcastNotification(notify);
        }
        public int FuncSum(TaskDataModel data)
        {
            return data.a + data.b;
        }
    }
}
