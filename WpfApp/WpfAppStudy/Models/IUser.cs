using System.Collections.Generic;
using System.ComponentModel;

namespace WpfApplication.Models
{
    public interface IUser
    {
        DataUserModel GetList(int pageIndex,int pageSize, SortDescription sort);
    }
}