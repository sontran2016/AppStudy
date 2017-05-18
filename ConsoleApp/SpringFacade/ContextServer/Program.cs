using Spring.Context;
using Spring.Context.Support;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ContextServer
{
    class Program
    {
        static void Main(string[] args)
        {
            IApplicationContext ctx = ContextRegistry.GetContext();
            Greeter g = (Greeter)ctx.GetObject("greeter");
            g.Message = "aa";
            g.Execute();
            Console.ReadKey();
        }
    }
    class Greeter: IGreeter
    {
        private string message;

        public string Message
        {
            get { return message; }
            set { message = value; }
        }

        public void Execute() { Console.WriteLine("Message is: {0}", message); }

        public int MySum(int a, int b)
        {
            Console.WriteLine("a + b = {0}",a+b);
            return a + b;
        }
    }

    public interface IGreeter
    {
        int MySum(int a, int b);
    }
}
