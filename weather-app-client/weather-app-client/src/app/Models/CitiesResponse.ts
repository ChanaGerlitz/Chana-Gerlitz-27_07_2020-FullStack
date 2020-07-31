export class City {
    Key: string;
    LocalizedName: string;
    constructor() {
    }
}
export class CitiesResponse {
    CitiesList: City[] = [];
    constructor() {
        this.CitiesList = new Array<City>();
    }
}