using System;
using System.Collections.Generic;

namespace ServerService.Interface
{
    public interface IRemoteCalculator
    {
        int Add(int a, int b);
        int Multiply(int a, int b);
    }
}
