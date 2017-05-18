using ServerService.Interface;
using System;

namespace ServerService.Implement
{
    public class RemoteCalculatorService : MarshalByRefObject, IRemoteCalculator
    {
        public RemoteCalculatorService()
        {
        }
        public int Add(int a, int b)
        {
            return a + b;
        }
        public int Multiply(int a, int b)
        {
            return a * b;
        }
    }
}
