using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace WpfApplication.Models
{
    public class UserModel
    {
        public string Name { get; set; }
        public int Age { get; set; }
        public string Sex { get; set; }
        public int No { get; set; }
    }

    public class DataUserModel
    {
        public List<UserModel> Users { get; set; }
        public int RowCount;
    }

    public class User : IUser
    {
        private List<UserModel> users;

        public User()
        {
            users = new List<UserModel>();
            var r = new Random();
            int age;
            for (int i = 1; i <= 3015; i++)
            {
                age = r.Next(100);
                users.Add(new UserModel()
                {
                    Name = string.Format("{0}. {1}",i, "Tran Tien"),
                    Age = age,
                    Sex = string.Format("{0}", age % 3 == 0 ? "Male" : "Female"),
                    No = i
                });
            }
        }

        public DataUserModel GetList(int pageIndex, int pageSize, SortDescription sort)
        {
            DataUserModel res;
            if (sort.PropertyName == null)
            {
                res = new DataUserModel()
                {
                    Users = users.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList(),
                    RowCount = users.Count
                };
            }
            else if (sort.Direction == ListSortDirection.Ascending)
            {
                var list = users.OrderBy(x => x.GetType().GetProperty(sort.PropertyName).GetValue(x, null)).ToList();
                list = list.Select(x => new UserModel() {Name = x.Name, Age = x.Age, Sex = x.Sex, No = 1+list.IndexOf(x)}).ToList();
                res = new DataUserModel()
                {
                    Users = list.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList(),
                    RowCount = users.Count
                };
            }
            else
            {
                var list = users.OrderByDescending(x => x.GetType().GetProperty(sort.PropertyName).GetValue(x, null)).ToList();
                list = list.Select(x => new UserModel() { Name = x.Name, Age = x.Age, Sex = x.Sex, No = 1+list.IndexOf(x) }).ToList();
                res = new DataUserModel()
                {
                    Users = list.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList(),
                    RowCount = users.Count
                };
            }
            return res;
        }
    }

}
