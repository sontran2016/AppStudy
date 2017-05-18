using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

namespace Server
{
    public class RemoteCalculator : MarshalByRefObject, IRemoteCalculator
    {
        public RemoteCalculator()
        {
            //Check whether a source exists with the name given
            //if (!EventLog.SourceExists("RemoteObject"))
            //{
            //    //If not create a source
            //    EventLog.CreateEventSource("RemoteObject", "Application");
            //}
        }
        public int Add(int a, int b)
        {
            //Log the information to keep track of the calls made from the client
            //EventLog.WriteEntry("RemoteObject", String.Format("Addition of {0} and {1} ", a, b));
            return a + b;
        }


        public int Multiply(int a, int b)
        {
            //Log the information to keep track of the calls made from the client
            //EventLog.WriteEntry("RemoteObject", String.Format("Addition of {0} and {1} ", a, b));
            return a * b;
        }
    }
    public interface IRemoteCalculator
    {
        int Add(int a, int b);
        int Multiply(int a, int b);
    }
}
