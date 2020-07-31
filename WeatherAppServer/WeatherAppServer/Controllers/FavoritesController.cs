using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WeatherAppServer.Models;

namespace WeatherAppServer.Controllers
{
    public class FavoritesController : ApiController
    {
        WeatherAppEntities context = new WeatherAppEntities();
        [HttpGet]
        public HttpResponseMessage GetCitiesFavorites()
        {
            HttpResponseMessage response = new HttpResponseMessage();
            string msg = string.Empty;
            try
            {
                List<CitiesFavorites> citiesFavorites = context.CitiesFavorites.ToList<CitiesFavorites>();
                string json = Utils.Shared.ConvertObject(citiesFavorites);
                response = Utils.Shared.JsonResponse(json);

            }
            catch (Exception ex)
            {
                response = Utils.Shared.ExceptionResponse(ex);
            }
            return response;
        }
        [HttpPost]
        public HttpResponseMessage AddToFavorites([FromBody]CitiesFavorites cityFavorites)
        {
            HttpResponseMessage response = new HttpResponseMessage();
            string msg = string.Empty;
            try
            {
                CitiesFavorites cityFavoritesDB = context.CitiesFavorites.FirstOrDefault(c => c.Key == cityFavorites.Key);
                if (cityFavoritesDB == null)
                {
                    context.CitiesFavorites.Add(cityFavorites);
                    context.SaveChanges();
                    msg = "add item to Favorites";
                }
                else
                {
                    msg = "exsits in Favorites";
                }

                string json = Utils.Shared.ConvertObject(msg);
                response = Utils.Shared.JsonResponse(json);

            }
            catch (Exception ex)
            {
                response = Utils.Shared.ExceptionResponse(ex);
            }
            return response;
        }

       [HttpPost]
        public HttpResponseMessage RemoveFromFavorites([FromBody]WeatherCityRequest weatherCityRequest)
        {
            HttpResponseMessage response = new HttpResponseMessage();
            string msg = string.Empty;
            try
            {
                CitiesFavorites cityFavoritesDB = context.CitiesFavorites.FirstOrDefault(c => c.Key == weatherCityRequest.CityKey);

                if (cityFavoritesDB != null)
                {
                    context.CitiesFavorites.Remove(cityFavoritesDB);
                    context.SaveChanges();
                    msg = "remove success";
                }
                else
                {
                    msg = "not exsits in Favorites";
                }

                string json = Utils.Shared.ConvertObject(msg);
                response = Utils.Shared.JsonResponse(json);

            }
            catch (Exception ex)
            {
                response = Utils.Shared.ExceptionResponse(ex);
            }
            return response;
        }
    }
}