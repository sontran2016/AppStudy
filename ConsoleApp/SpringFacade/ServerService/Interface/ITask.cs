using PureMVC.Interfaces;
using ServerService.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServerService.Interface
{
    public interface ITask
    {
        void HandleService(INotification notify);
        int FuncSum(TaskDataModel data);
    }
}
