using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GaugeBoard.Interface;
using GaugeBoard.Common;
//using Nois.App.Framework.View;
using System.Windows.Input;
using GaugeBoard.Controller;

namespace GaugeBoard.Forms
{
    public class SettingMediator: ViewModelMediator
    {
        private ISettingProxy _settingProxy;

        public SettingMediator():base("SettingMediator")
        {
        }
        public override void OnRegister()
        {
            base.OnRegister();

            var dlgSetting = new SettingWindow();
            dlgSetting.DataContext = this;
            ViewComponent = dlgSetting;
            //App.Current.MainWindow = dlgSetting;
            _settingProxy = (ISettingProxy)Facade.RetrieveProxy(ProxyNames.SettingProxy);
        }

        private SettingWindow SettingWindow
        {
            get { return (SettingWindow)ViewComponent; }
        }

        public override IList<string> ListNotificationInterests()
        {
            return new List<string>{"ShowSetting", "SaveSetting", "CancelSetting", ProxyNames.SettingProxy };
        }

        public override void HandleNotification(PureMVC.Interfaces.INotification notification)
        {
            switch (notification.Name)
            {
                case "ShowSetting":
                    LoadDataInit();
                    SettingWindow.ShowDialog();
                    break;
                case "SaveSetting":
                    DoSave();                    
                    break;
                case "CancelSetting":
                    SendNotification(ProxyNames.SettingProxy,null,ProxyTypes.Cancel);
                    SettingWindow.Hide();
                    break;
                case ProxyNames.SettingProxy:
                    if (notification.Type == ProxyTypes.Ok)
                    {
                        //SendNotification(ProxyNames.SettingProxy, null, ProxyTypes.Ok);
                        SettingWindow.Hide();
                    }
                    else if (notification.Type == ProxyTypes.Error)
                    {
                        SettingWindow.lblError.Text = notification.Body as string;
                    }
                    break;
            }
        }

        private void DoSave()
        {
            try
            {
                DateTime d = new DateTime(DateTime.Today.Year, DateTime.Today.Month, DateTime.Today.Day, SettingWindow.time1.SelectedHour, SettingWindow.time1.SelectedMinute, 0);
                Setting model = new Setting()
                {
                    Email = SettingWindow.txtEmail.Text,
                    MaxTemperature = Convert.ToDouble(SettingWindow.txtTemperature.Text),
                    MaxHumidity = Convert.ToDouble(SettingWindow.txtHumidity.Text),
                    MaxDirty = Convert.ToDouble(SettingWindow.txtDirty.Text),
                    IsWarning = SettingWindow.chkWarning.IsChecked ?? false,
                    WarningTime = d,
                    LastUpdate = DateTime.Now
                };
                SendNotification(typeof(SettingController).Name, model);
            }
            catch (Exception e)
            {
                SettingWindow.lblError.Text = e.Message;
            }
        }

        private void LoadDataInit()
        {
            try
            {
                string msg;
                var data = _settingProxy.Get(out msg);
                if(msg!="")
                    throw new Exception(msg);
                SettingWindow.txtEmail.Text = data.Email;
                SettingWindow.txtTemperature.Text = ""+data.MaxTemperature;
                SettingWindow.txtHumidity.Text = ""+data.MaxHumidity;
                SettingWindow.txtDirty.Text = ""+data.MaxDirty;
                SettingWindow.chkWarning.IsChecked = data.IsWarning;
                if(data.WarningTime.HasValue)
                    SettingWindow.time1.SelectedTime=new TimeSpan(data.WarningTime.Value.Hour, data.WarningTime.Value.Minute,0);
                else
                    SettingWindow.time1.SelectedTime = new TimeSpan(DateTime.Now.Hour, DateTime.Now.Minute, 0);
            }
            catch (Exception e)
            {
                SettingWindow.lblError.Text = e.Message;
            }
        }

        public ICommand cmdSave
        {
            get
            {
                return new RelayCommand(obj =>
                {
                    SendNotification("SaveSetting");
                });
            }
        }
        public ICommand cmdCancel
        {
            get
            {
                return new RelayCommand(obj =>
                {
                    SendNotification("CancelSetting");
                });
            }
        }

        public override int Priority
        {
            get
            {
                return 2;
            }
        }
    }
}
