
import { Injectable } from '@angular/core';
import { Result } from '../Models/Result.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MetaData } from '../Models/MetaData.model';
import { CitiesRequest } from '../Models/CitiesRequest.model';
import { WeatherCityRequest } from '../Models/WeatherCityRequest.model';
import { WeatherCityResponse } from '../Models/WeatherCityResponse.model';
@Injectable({ providedIn: 'root' })

export class DalService {

    localUrl: string = "http://localhost:56411/api/";

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        }), withCredentilas: true
    };
    constructor(private httpService: HttpClient) { }

    async callWebApi(action, data) {
        let result: Result;
        try {
            let ref = await this.httpService.post(this.localUrl + action, data).toPromise();
    
            if (ref)
                result = this.getResult(ref);
        }
        catch (ex) {
            console.log(ex);
        }
        return result;
    }
    async callWebApiGet(action) {
        let result: Result;
        try {
            let ref = await this.httpService.get(this.localUrl + action).toPromise();
    
            if (ref)
                result = this.getResult(ref);
        }
        catch (ex) {
            console.log(ex);
        }
        return result;
    }
 
    getResult(res): Result {
        let mataData: MetaData = this.getMetaData(res['metaData']);
        let result: Result = new Result(res['data'], mataData);
        return result;
    }
    getMetaData(jsonObject): MetaData {
        let metaData: MetaData = new MetaData(1, "לא התקבלו נתונים");
        if (jsonObject != null) {
            metaData.msgCode = jsonObject['msgCode'];
            metaData.msgDescription = jsonObject['msgDescription'];

        }
        return metaData;
    }
    getData(data) {
        if (data = "")
            return "";
        return JSON.stringify(data)
    }
    async citiesSearch(citiesRequest: CitiesRequest) {
        let actionName = "Weather/CitiesSearch";
        let requstParameters = { "Search": citiesRequest.Search }
        return await this.callWebApi(actionName, requstParameters);
    }
    async weatherSearchByCity(weatherCityRequest: WeatherCityRequest) {
        let actionName = "Weather/WeatherSearchByCity";
        let requstParameters = { "CityKey": weatherCityRequest.CityKey }
        return await this.callWebApi(actionName, requstParameters);
    }
    async getCitiesFavorites() {
        let actionName = "Favorites/GetCitiesFavorites";
        return await this.callWebApiGet(actionName);
    }
    async addToFavorites(weatherCityRequest: WeatherCityResponse) {
        let actionName = "Favorites/AddToFavorites";
        let requstParameters = { "Key": weatherCityRequest.CityKey,"LocalizedName":weatherCityRequest.CityName }
        return await this.callWebApi(actionName, requstParameters);
    }
    async removeFromFavorites(weatherCityRequest: WeatherCityResponse) {
        let actionName = "Favorites/RemoveFromFavorites";
        let requstParameters = { "CityKey": weatherCityRequest.CityKey }
        return await this.callWebApi(actionName, requstParameters);
    }
}