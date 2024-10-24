import { Routes } from '@angular/router';
import { WaterComponent } from './water/water.component';

export const routes: Routes = [
    {path: '', redirectTo: 'water', pathMatch: 'full'},
    {path: 'water', component: WaterComponent}, 
];
