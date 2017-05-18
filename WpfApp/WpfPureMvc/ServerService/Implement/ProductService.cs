using ServerService.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PureMVC.Patterns;
using ServerService.Model;

namespace ServerService.Implement
{
    public class ProductService : IProduct
    {
        public const string Name = "Product";
        public ProductService()
        {
        }
        public List<ProductModel> GetList()
        {
            var data = new List<ProductModel>();
            data.Add(new ProductModel() { Code = "ABC",Name = "Product xx"});
            data.Add(new ProductModel() { Code = "BAC", Name = "Product xy" });
            data.Add(new ProductModel() { Code = "CBA", Name = "Product xz" });
            return data;
        }
    }
}
