using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PureMVC.Patterns;
using ServerService.Interface;

namespace ServerService.Implement
{
    public class UserService : IUser
    {
        public const string Name = "User";
        private List<string> users;

        public UserService()
        {
            users=new List<string>();
        }
        public bool Login(string user, string password)
        {
            bool f= user == password;
            if (f && (!users.Exists(x => x == user)))
            {
                users.Add(user);
                return true;
            }
            else
                return false;
        }

        public bool Logout(string user, string password)
        {
            if (users.Exists(x => x == user))
                return true;
            return false;
        }
    }
}
