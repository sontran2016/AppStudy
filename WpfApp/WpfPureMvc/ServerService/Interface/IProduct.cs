using ServerService.Model;
using System.Collections.Generic;

namespace ServerService.Interface
{
    public interface IProduct
    {
        List<ProductModel> GetList();
    }
}