import { Component, OnInit } from '@angular/core';
import { CitiesResponse, City } from '../../Models/CitiesResponse';
import { WeatherCityResponse } from '../../Models/WeatherCityResponse.model';
import { ActivatedRoute } from '@angular/router';
import { Result } from '../../Models/Result.model';
import { DalService } from '../../Services/dal.service';
import { WeatherCityRequest } from '../../Models/WeatherCityRequest.model';
import { CitiesRequest } from '../../Models/CitiesRequest.model';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  public citiesRequest: CitiesRequest;
  public citiesResponse: CitiesResponse;
  public weatherCityRequest: WeatherCityRequest;
  public weatherCityResponse: WeatherCityResponse;
  public page: string;
  public isLoading: boolean = false;
  public isError: boolean = false;
  public serverError: string = "ארעה שגיאה בהתחברות לשרת";
  public favorites: string = "favorites";

  constructor(public route: ActivatedRoute, public dalService: DalService, public dialog: MatDialog) {
    this.citiesRequest = new CitiesRequest();
    this.citiesResponse = new CitiesResponse();
    this.weatherCityRequest = new WeatherCityRequest();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.page = params.page;
      if (this.page == "favorites") {
        this.getCitiesFavorites();
      }
      else {
        this.citiesResponse = null;
        this.weatherCityResponse = null;
      }
    });
  }
  async citiesSearch() {

    if (this.citiesRequest.Search == null || this.citiesRequest.Search == "")
      return;
    this.citiesResponse = new CitiesResponse();
    this.weatherCityResponse = null;
    this.isLoading = true;
    try {
      let res: Result = await this.dalService.citiesSearch(this.citiesRequest);
      if (res == undefined) {
        this.isError = true;
        this.openDialog(this.serverError);
        return;
      }
      if (res.metaData.msgCode == "0") {
        this.isError = false;
        Object.assign(this.citiesResponse.CitiesList, res.data);
        if (this.citiesResponse.CitiesList.length == 1)
          this.weatherSearchByCity(this.citiesResponse.CitiesList[0]);
      }
      else {
        this.isError = true;
        this.openDialog(res.metaData.msgDescription);
      }
    }
    catch (ex) {
      this.isError = true;
      this.openDialog(ex);

    }
    finally {
      this.isLoading = false;
    }
  }
  async weatherSearchByCity(city: City) {
    this.weatherCityRequest.CityKey = city.Key;
    this.weatherCityResponse = null;
    this.isLoading = true;
    try {
      let res: Result = await this.dalService.weatherSearchByCity(this.weatherCityRequest);
      if (res == undefined) {
        this.isError = true;
        this.openDialog(this.serverError);
        return;
      }
      if (res.metaData.msgCode == "0") {
        this.isError = false;
        this.weatherCityResponse = new WeatherCityResponse(this.weatherCityRequest.CityKey, city.LocalizedName, res.data[0]["WeatherText"], res.data[0]["Temperature"]["Metric"]["Value"])
      }
      else {
        this.isError = true;
        this.openDialog(res.metaData.msgDescription);
      }
    }
    catch (ex) {
      this.isError = true;
      this.openDialog(ex);
    }
    finally {
      this.isLoading = false;
    }
  }
  async getCitiesFavorites() {
    try {
      this.weatherCityResponse = null;
      this.citiesResponse = new CitiesResponse();
      let res: Result = await this.dalService.getCitiesFavorites();
      if (res == undefined) {
        this.isError = true;
        this.openDialog(this.serverError);
        return;
      }
      if (res.metaData.msgCode == "0") {
        this.isError = false;
        Object.assign(this.citiesResponse.CitiesList, res.data);
      }
      else {
        this.isError = true;
        this.openDialog(res.metaData.msgDescription);
      }
    }
    catch (ex) {
      this.isError = true;
      this.openDialog(ex);
    }
    finally {
      this.isLoading = false;
    }
  }
  async addOrRemoveFavorites() {
    try {
      let res: Result
      if (this.page != this.favorites)
        res = await this.dalService.addToFavorites(this.weatherCityResponse);
      else
        res = await this.dalService.removeFromFavorites(this.weatherCityResponse);
      if (res == undefined) {
        this.isError = true;
        this.openDialog(this.serverError);
        return;
      }
      if (res.metaData.msgCode == "0") {
        this.isError = false;
        this.openDialog(res.data);
        if (this.page == this.favorites) {
          let itemm = this.citiesResponse.CitiesList.filter(function (i) {
            return i.Key === this.weatherCityResponse.CityKey;
          }, this)[0];
          let index = this.citiesResponse.CitiesList.indexOf(itemm);
          this.citiesResponse.CitiesList.splice(index, 1);
          this.weatherCityResponse = null;
        }
        return;
      }
      else {
        this.isError = true;
        this.openDialog(res.metaData.msgDescription);
      }
    }
    catch (ex) {
      this.isError = true;
      this.openDialog(ex);
    }
    finally {
      this.isLoading = false;
    }
  }
  openDialog(msg) {
    let dialogRef = this.dialog.open(DialogComponent, {
      data: msg,
      height: '200px',
      width: '250px',
    });
  }
}
