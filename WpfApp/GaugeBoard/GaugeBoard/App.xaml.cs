using GaugeBoard.Controller;
using PureMVC.Patterns;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using System.Windows;

namespace GaugeBoard
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        public void ApplicationStartUp(object sender, StartupEventArgs e)
        {
            var facade = AppFacade.GetInstance();
            facade.Startup(typeof(StartUpController).Name);

            //Facade.Instance.RegisterProxy(new AppTypeFinder());
            //var facade = (AppFacade)AppFacade.Instance;
            //facade.Startup(typeof(StartUpController).FullName);
        }
    }
}
