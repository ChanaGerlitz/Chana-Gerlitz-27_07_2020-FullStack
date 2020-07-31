using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WeatherAppServer.Models
{

    public class CitiesRequest
    {
        public string Search { get; set; }
    }

    public class CitiesResponse
    {
        public string Key { get; set; }
        public string LocalizedName { get; set; }
    }


    public class WeatherCityRequest
    {
        public string CityKey { get; set; }
    }
    public class WeatherCityResponse
    {
        public string WeatherText { get; set; }
        public Temperature Temperature { get; set; }

        public WeatherCityResponse(string weatherText, double temperatureValue)
        {
            this.WeatherText = weatherText;
            this.Temperature = new Temperature(temperatureValue);
        }
    }
    public class Temperature
    {
        public Metric Metric { get; set; }
        public Temperature(double value)
        {
            this.Metric = new Metric(value);
        }
    }
    public class Metric
    {
        public double Value { get; set; }
        public Metric(double value)
        {
            this.Value = value;
        }
    }
}