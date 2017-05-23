using PureMVC.Interfaces;
using PureMVC.Patterns;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GaugeBoard.Controller
{
    public class StartUpController : SimpleCommand
    {
        public override void Execute(INotification notification)
        {
            Utils.InitDatabase();
            SendNotification("MainWindow_Show");
        }
    }
}
