using FacadeServer.Controller;
using FacadeServer.Model;
using PureMVC.Patterns;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FacadeServer
{
    class MyFacade : Facade
    {
        private static MyFacade instance;
        // we must specify the type of instance
        static MyFacade()
        {
            instance = new MyFacade();
        }

        //// Override Singleton Factory method 
        public new static MyFacade GetInstance()
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

            RegisterCommand(TaskCommand.Name, typeof(TaskCommand));
            RegisterCommand(MinusCommand.Name, typeof(MinusCommand));
        }

        // optional initialization hook for Model
        protected override void InitializeModel()
        {
            // call base to use the PureMVC Model Singleton. 
            base.InitializeModel();

            RegisterProxy(new TaskProxy());
            RegisterProxy(new MinusProxy());
        }

        // optional initialization hook for View
        protected override void InitializeView()
        {
            // call base to use the PureMVC View Singleton. 
            base.InitializeView();

            //RegisterMediator(new LoginMediator());
        }
    }
}
