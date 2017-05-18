using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PureMVC.Interfaces;
using PureMVC.Patterns;
using ServerService.Interface;
using ServerService.Model;

namespace ServerService.Implement
{
    public class ServerService : MarshalByRefObject, IServerService
    {
        private readonly IUser _user;
        public ServerService(IUser user)
        {
            _user = user;
        }

        public INotification HandleService(INotification notify)
        {
            INotification res=new Notification(notify.Name);
            var data = new ResponseModel();
            switch (notify.Name)
            {
                case UserService.Name:
                    bool status=false;
                    var user = notify.Body as UserModel;                    
                    if (notify.Type == NotifyType.Login)
                        status = _user.Login(user.User, user.Password);
                    else if (notify.Type == NotifyType.Logout)
                        status = _user.Logout(user.User, user.Password);
                    data.Status = true;
                    data.Data = status;
                    break;
                default:

                    break;
            }
            res.Type = NotifyType.Reply;
            return res;
        }

    }
    //
}
