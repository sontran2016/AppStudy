//using GaugeBoard.View;
//using Nois.Core.Infrastructure;
//using Nois.Data;
//using Nois.Proxies.LineSettings;
//using Nois.Proxies.Printing;
//using Nois.Proxies.Products;
//using Nois.Proxies.Security;
//using Nois.Proxies.Users;
//using Nois.Proxies.WorkOrders;
using PureMVC.Interfaces;
using PureMVC.Patterns;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GaugeBoard.Implement;

namespace GaugeBoard
{
    public class AppFacade : Facade
    {
        #region Notification name constants

        public const string STARTUP_C = "startup_command";

        #endregion

        #region Fields
        private ITypeFinder _typeFinder;
        #endregion

        #region Accessors

        /// <summary>
        /// Facade Singleton Factory method.  This method is thread safe.
        /// </summary>
        public new static IFacade Instance
        {
            get
            {
                if (m_instance == null || m_instance.GetType() != typeof(AppFacade))
                {
                    lock (m_staticSyncRoot)
                    {
                        if (m_instance == null || m_instance.GetType() != typeof(AppFacade)) m_instance = new AppFacade();
                    }
                }
                return m_instance;
            }
        }

        #endregion

        #region Public methods

        /// <summary>
        /// Start the application
        /// </summary>
        /// <param name="startUpCommand"></param>
        /// <param name="app"></param>
        public void Startup(string startUpCommand)
        {
            SendNotification(startUpCommand);
        }

        #endregion

        #region Protected & Internal Methods

        protected AppFacade()
        {
            // Protected constructor.
        }

        /// <summary>
        /// Explicit static constructor to tell C# compiler 
        /// not to mark type as before field init
        ///</summary>
        static AppFacade()
        {
        }
        
        /// <summary>
        /// Register Commands with the Controller
        /// </summary>
        protected override void InitializeController()
        {
            base.InitializeController();

            _typeFinder = (ITypeFinder)RetrieveProxy(AppTypeFinder.Name);

            var assemblies = _typeFinder.GetAssemblies();

            foreach(var assembly in assemblies)
            {
                foreach(var commandType in assembly.GetExportedTypes())
                {
                    if(commandType.BaseType == typeof(SimpleCommand))
                        RegisterCommand(commandType.FullName, commandType);
                }
            }
        }
        /// <summary>
        /// Register Mediators with the View
        /// </summary>
        protected override void InitializeView()
        {
            base.InitializeView();
            _typeFinder = (ITypeFinder)RetrieveProxy(AppTypeFinder.Name);

            var assemblies = _typeFinder.GetAssemblies();
            var mediators = new List<ViewModelMediator>();
            foreach (var assembly in assemblies)
            {
                mediators.AddRange(assembly.GetExportedTypes()
                    .Where(ct => ct.BaseType == typeof(ViewModelMediator))
                    .Select(ct => Activator.CreateInstance(ct) as ViewModelMediator));
            }
            foreach( var mediator in mediators.OrderByDescending(m=>m.Priority))
                RegisterMediator(mediator);
        }
        /// <summary>
        /// Register Proxies with the Model
        /// </summary>
        protected override void InitializeModel()
        {
            base.InitializeModel();
            //RegisterProxy(new GaugeContext());
            RegisterProxy(new SettingProxy());
            //RegisterProxy(new UserRoleProxy());
            //RegisterProxy(new EncryptionProxy());
            //RegisterProxy(new ProductProxy());
            //RegisterProxy(new WorkOrderProxy());
            //RegisterProxy(new PrintingProxy());
            //RegisterProxy(new PackageProxy());
            //RegisterProxy(new ShiftProxy());
            //RegisterProxy(new ScannerProxy());
            //RegisterProxy(new TimeSpanRemarkProxy());
            //RegisterProxy(new SessionProxy());
            //RegisterProxy(new RepackingLogProxy());
            //RegisterProxy(new LineSettingProxy());
            //RegisterProxy(new ScanningProxy());
            //RegisterProxy(new ShiftDetailProxy());
        }
        #endregion
    }
}
