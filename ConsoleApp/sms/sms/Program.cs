using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace sms
{
    class Program
    {
        static void Main(string[] args)
        {
            // Your Account SID from twilio.com/console
            var accountSid = "ACc8df21cb8fb551174d64dad215220efe";
            // Your Auth Token from twilio.com/console
            var authToken = "34c1c2f64e5dddb84d2bfee338f91e4b";

            TwilioClient.Init(accountSid, authToken);

            var message = MessageResource.Create(
                to: new PhoneNumber("+84909620443"),
                from: new PhoneNumber("+12035522144"),
                body: "Hello from C#");

            Console.WriteLine(message.Sid);
            Console.Write("Press any key to continue.");
            Console.ReadKey();
        }
    }
}
