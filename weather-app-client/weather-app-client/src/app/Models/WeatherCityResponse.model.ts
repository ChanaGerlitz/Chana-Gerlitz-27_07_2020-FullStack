import { StringLiteral } from "typescript";

export class WeatherCityResponse {

  public CityKey: string;
  public CityName: string;
  public TemperatureValue: number;
  public WeatherText: String;

  constructor(cityKey: string, cityName: string, temperatureValue: number, weatherText: string) {
    this.CityKey = cityKey;
    this.CityName = cityName;
    this.TemperatureValue = temperatureValue;
    this.WeatherText = weatherText;
  }
}