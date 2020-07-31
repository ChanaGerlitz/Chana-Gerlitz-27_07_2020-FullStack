using WeatherAppServer.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web;

namespace WeatherAppServer.Utils
{
    public class Shared
    {
        public static HttpResponseMessage JsonResponse(string json)
        {
            HttpRequestMessage request = new HttpRequestMessage();
            var response = request.CreateResponse(System.Net.HttpStatusCode.OK);
            response.Content = new StringContent(json, Encoding.UTF8, "application/json");
            return response;
        }
        public static HttpResponseMessage ExceptionResponse(Exception ex)
        {
            var metadata = new MetaData(((int)Enums.MessageCodeTypes.Failure).ToString(), ex.Message);
            var json = JsonConvert.SerializeObject(new { data = "", metaData = metadata }, Formatting.None);
            return JsonResponse(json);
        }
        public static string ConvertObject(object obj)
        {
            var json = JsonConvert.SerializeObject(new { data = obj, metaData = new MetaData("0", "ok") }, Formatting.None);
            return json;
        }
    }
}