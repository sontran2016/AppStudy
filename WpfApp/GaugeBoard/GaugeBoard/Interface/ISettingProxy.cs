using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GaugeBoard.Interface
{
    public interface ISettingProxy
    {
        Setting Get(out string message);
        int Add(Setting model,out string message);
        int Update(Setting model, out string message);
    }
    public interface ITemperatureProxy
    {
        int Add(Temperature model, out string message);
        List<Temperature> Get(int year,List<int> month, out string message);
    }
}
