using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
    public class TreeModel
    {
        public int Id { get; set; }
        public int? ParentId { get; set; }
        public string Name { get; set; }
        public NodeType NodeType { get; set; }
        public string IconPath { get; set; }
    }

    public enum NodeType
    {
        Folder=0,
        Document=1,
        Server=2,
        Computer=3,
        Tag=4
    }
}