using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var nodes = new List<TreeModel>();
            nodes.Add(new TreeModel() { Id = 1, Name =  "a0", NodeType =  NodeType.Server});
            nodes.Add(new TreeModel() { Id = 2, Name = "b0", NodeType = NodeType.Server });
            nodes.Add(new TreeModel() { Id = 3, Name = "c0", NodeType = NodeType.Server });

            nodes.Add(new TreeModel() { Id = 4, Name = "a11", NodeType = NodeType.Computer, ParentId = 1});
            nodes.Add(new TreeModel() { Id = 5, Name = "a12", NodeType = NodeType.Computer, ParentId = 1 });

            nodes.Add(new TreeModel() { Id = 8, Name = "a111", NodeType = NodeType.Tag, ParentId = 4 });
            nodes.Add(new TreeModel() { Id = 9, Name = "a112", NodeType = NodeType.Tag, ParentId = 4 });
        
            nodes.Add(new TreeModel() { Id = 6, Name = "b11", NodeType = NodeType.Computer, ParentId = 2 });
            nodes.Add(new TreeModel() { Id = 7, Name = "b12", NodeType = NodeType.Computer, ParentId = 2 });

            nodes.Add(new TreeModel() { Id = 10, Name = "b121", NodeType = NodeType.Tag, ParentId = 7 });
            nodes.Add(new TreeModel() { Id = 11, Name = "b122", NodeType = NodeType.Tag, ParentId = 7 });


            nodes.Add(new TreeModel() { Id = 12, Name = "b1211", NodeType = NodeType.Document, ParentId = 10 });
            return View(nodes);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}