using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WeatherAppServer.Models
{
    public class MetaData
    {
        public int msgCode { get; set; }
        public string msgDescription { get; set; }
        
        public MetaData(string _msgCode, string _msgDescription)
        {
            this.msgCode = int.Parse(_msgCode);
            this.msgDescription = _msgDescription;
        }
    }
}