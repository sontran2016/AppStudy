using System;
using System.Collections.Generic;
using System.Text;

namespace Server    //namespace must same as on server
{
    public abstract class RemoteCalculator : MarshalByRefObject
    {
         public abstract int Add(int a, int b);

        public abstract int Multiply(int a, int b);
    }
}
