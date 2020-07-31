import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WeatherComponent } from './pages/weather/weather.component';

const routes: Routes = [
  { path: 'app-weather/:page', component: WeatherComponent },
  { path: '', component: WeatherComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }