//using GaugeBoard.Controller;
//using GaugeBoard.Model;
using PureMVC.Patterns;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GaugeBoard.Implement;
using GaugeBoard.Forms;
using GaugeBoard.Controller;

namespace GaugeBoard
{
    public class AppFacade : Facade
    {
        private static AppFacade instance;
        // we must specify the type of instance
        static AppFacade()
        {
            instance = new AppFacade();
        }
        public void Startup(string startUpCommand)
        {
            SendNotification(startUpCommand);
        }

        //// Override Singleton Factory method 
        public static AppFacade GetInstance()
        {
            return instance;
        }

        // optional initialization hook for Facade
        protected override void InitializeFacade()
        {
            base.InitializeFacade();
            // do any special subclass initialization here
        }

        // optional initialization hook for Controller
        protected override void InitializeController()
        {
            // call base to use the PureMVC Controller Singleton. 
            base.InitializeController();

            RegisterCommand(typeof(StartUpController).Name, typeof(StartUpController));
            RegisterCommand(typeof(SettingController).Name, typeof(SettingController));
        }

        // optional initialization hook for Model
        protected override void InitializeModel()
        {
            // call base to use the PureMVC Model Singleton. 
            base.InitializeModel();

            RegisterProxy(new SettingProxy());
            RegisterProxy(new TemperatureProxy());
        }

        // optional initialization hook for View
        protected override void InitializeView()
        {
            // call base to use the PureMVC View Singleton. 
            base.InitializeView();

            RegisterMediator(new MainMediator());
            RegisterMediator(new SettingMediator());
        }
    }
}
