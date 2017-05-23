using PureMVC.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;

namespace GaugeBoard
{
    public interface ITypeFinder : IProxy
    {
        IList<Assembly> GetAssemblies();
    }
}
