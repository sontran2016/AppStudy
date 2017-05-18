using Spring.Context.Support;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ContextClient
{
    class Program
    {
        static void Main(string[] args)
        {
            var context = ContextRegistry.GetContext();
            var service = context.GetObject("greeterService") as IGreeter;
            int m = service.MySum(2, 3);
            Console.WriteLine("Result: {0}",m);
            Console.ReadKey();
        }
    }
    public interface IGreeter
    {
        int MySum(int a, int b);
    }
    //class Greeter : IGreeter
    //{
    //    private string message;

    //    public string Message
    //    {
    //        get { return message; }
    //        set { message = value; }
    //    }

    //    public void Execute() { Console.WriteLine("Message is: {0}", message); }

    //    public int MySum(int a, int b)
    //    {
    //        Console.WriteLine("a + b = {0}", a + b);
    //        return a + b;
    //    }
    //}
}

namespace ContextServer
{
    public interface IGreeter
    {
        int MySum(int a, int b);
    }
}
