using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServerService.Model
{
    public class ProductModel
    {
        public string Code;
        public string Name;
    }

    public class UserModel
    {
        public string User;
        public string Password;
    }

    public class ResponseModel
    {
        public bool Status;
        public object Data;
        public List<string> Errors;
    }
}
