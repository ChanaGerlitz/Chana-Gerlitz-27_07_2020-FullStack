using WeatherAppServer.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WeatherAppServer.Utils;

namespace WeatherAppServer.Controllers
{
    public class WeatherController : ApiController
    {
        WeatherAppEntities context = new WeatherAppEntities();

        [HttpPost]
        public HttpResponseMessage CitiesSearch([FromBody]CitiesRequest request)
        {
            HttpResponseMessage response = new HttpResponseMessage();
            try
            {
                using (var webClient = new WebClient())
                {
                    string urlRequest = ConfigurationManager.AppSettings["Locations"] + request.Search;
                    CitiesStub citiesStub = null;
                    string responseObject = null;
                    if (ConfigurationManager.AppSettings["Environment"] == Enums.Environment.Dev.ToString())
                    {
                        var today = DateTime.Today;
                        citiesStub = context.CitiesStub.Where(x => x.CreateDate == today).FirstOrDefault(c => c.Request == urlRequest);
                    }
                    if (citiesStub != null)
                    {
                        responseObject = citiesStub.Response;
                    }
                    else
                    {
                        webClient.Headers.Add("Content-Type", "application/json");
                        webClient.Headers.Add("user-agent", "MyRSSReader/1.0");
                        responseObject = webClient.DownloadString(urlRequest);
                        citiesStub = new CitiesStub(urlRequest, responseObject);
                        context.CitiesStub.Add(citiesStub);
                        context.SaveChanges();
                    }
                    var cities = JsonConvert.DeserializeObject<List<CitiesResponse>>(responseObject);
                    string json = Utils.Shared.ConvertObject(cities);
                    response = Utils.Shared.JsonResponse(json);
                }

            }
            catch (Exception ex)
            {
                response = Utils.Shared.ExceptionResponse(ex);
            }

            return response;
        }
        [HttpPost]
        public HttpResponseMessage WeatherSearchByCity([FromBody]WeatherCityRequest request)
        {
            HttpResponseMessage response = new HttpResponseMessage();
            try
            {
                using (var webClient = new WebClient())
                {
                    CitiesWeather citiesWeather = context.CitiesWeather.FirstOrDefault(c => c.CityKey == request.CityKey);
                    List<WeatherCityResponse> WeatherCity = new List<WeatherCityResponse>();
                    if (citiesWeather == null || citiesWeather.UpdateDate < DateTime.Today)
                    {
                        string url = ConfigurationManager.AppSettings["CurrentConditions"];
                        webClient.Headers.Add("Content-Type", "application/json");
                        webClient.Headers.Add("user-agent", "MyRSSReader/1.0");
                        var responseObject = webClient.DownloadString(string.Format(url, request.CityKey));
                        WeatherCity = JsonConvert.DeserializeObject<List<WeatherCityResponse>>(responseObject);
                        if (citiesWeather != null)
                        {
                            context.CitiesWeather.Remove(citiesWeather);
                            context.SaveChanges();
                        }
                        citiesWeather = new CitiesWeather(request.CityKey, WeatherCity.FirstOrDefault().Temperature.Metric.Value, WeatherCity.FirstOrDefault().WeatherText);

                        context.CitiesWeather.Add(citiesWeather);
                        context.CitiesWeather.Add(citiesWeather);

                        context.SaveChanges();
                    }
                    else
                    {
                        WeatherCityResponse r = new WeatherCityResponse(citiesWeather.WeatherText, citiesWeather.TemperatureValue);
                        WeatherCity.Add(r);
                    }
                    string json = Utils.Shared.ConvertObject(WeatherCity);
                    response = Utils.Shared.JsonResponse(json);
                }
            }
            catch (Exception ex)
            {
                response = Utils.Shared.ExceptionResponse(ex);
            }
            return response;
        }
    }
}
