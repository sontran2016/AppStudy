using GaugeBoard.Common;
using GaugeBoard.Interface;
using PureMVC.Interfaces;
using PureMVC.Patterns;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GaugeBoard.Controller
{
    public class SettingController : SimpleCommand
    {
        private ISettingProxy _settingProxy;
        public override void Execute(INotification notification)
        {
            try
            {
                _settingProxy = (ISettingProxy)Facade.RetrieveProxy(ProxyNames.SettingProxy);
                string msg;
                var model = notification.Body as Setting;
                model.LastUpdate = DateTime.Now;

                _settingProxy.Update(model, out msg);
                if (msg == "")
                    SendNotification(ProxyNames.SettingProxy, model, ProxyTypes.Ok);
                else
                    throw new Exception(msg);
            }
            catch (Exception e)
            {
                SendNotification(ProxyNames.SettingProxy, e.Message, ProxyTypes.Error);
            }
        }
    }
}
