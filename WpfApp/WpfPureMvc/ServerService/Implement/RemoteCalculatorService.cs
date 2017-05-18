using ServerService.Interface;
using System;

namespace ServerService.Implement
{
    public class CalculatorService : ICalculator
    {
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
