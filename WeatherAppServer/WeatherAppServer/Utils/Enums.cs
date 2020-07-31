using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WeatherAppServer.Utils
{
    public class Enums
    {
        public enum MessageCodeTypes
        {
            Success = 0,
            Failure = 1
        }
        public enum Environment
        {
            Dev = 0,
            Production = 1
        }
    }
}