import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Addprojects } from './components/projects/addprojects/addprojects';
import { Editprojects } from './components/projects/editprojects/editprojects';
import { Listprojects } from './components/projects/listprojects/listprojects';
import { Viewprojects } from './components/projects/viewprojects/viewprojects';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Dashboard } from './components/others/dashboard/dashboard';
import { Header } from './components/others/header/header';
import { Footer } from './components/others/footer/footer';
import { Addbuildings } from './components/buildings/addbuildings/addbuildings';
import { Editbuildings } from './components/buildings/editbuildings/editbuildings';
import { Viewbuildings } from './components/buildings/viewbuildings/viewbuildings';
import { Listbuildings } from './components/buildings/listbuildings/listbuildings';
import { Listfloors } from './components/floors/listfloors/listfloors';
import { Addfloors } from './components/floors/addfloors/addfloors';
import { Viewfloors } from './components/floors/viewfloors/viewfloors';
import { Editfloors } from './components/floors/editfloors/editfloors';
import { Addemployees } from './components/employees/addemployees/addemployees';
import { Listemployees } from './components/employees/listemployees/listemployees';
import { Viewemployees } from './components/employees/viewemployees/viewemployees';
import { Editemployees } from './components/employees/editemployees/editemployees';
import { Home } from './components/pages/home/home';
import { Signup } from './components/pages/signup/signup';
import { Signin } from './components/pages/signin/signin';
import { Products } from './components/pages/products/products';
import { Productdetails } from './components/pages/productdetails/productdetails';
import { Addrawmaterials } from './components/rawmaterials/addrawmaterials/addrawmaterials';
import { Listrawmaterials } from './components/rawmaterials/listrawmaterials/listrawmaterials';
import { Viewrawmaterials } from './components/rawmaterials/viewrawmaterials/viewrawmaterials';
import { Editrawmaterials } from './components/rawmaterials/editrawmaterials/editrawmaterials';
import { Addstages } from './components/stages/addstages/addstages';
import { Editstages } from './components/stages/editstages/editstages';
import { Viewstages } from './components/stages/viewstages/viewstages';
import { Liststages } from './components/stages/liststages/liststages';
import { Listattendances } from './components/attendances/listattendances/listattendances';
import { Viewattendances } from './components/attendances/viewattendances/viewattendances';
import { Editattendances } from './components/attendances/editattendances/editattendances';
import { Addattendances } from './components/attendances/addattendances/addattendances';
import { Addunits } from './components/units/addunits/addunits';
import { Viewunits } from './components/units/viewunits/viewunits';
import { Listunits } from './components/units/listunits/listunits';
import { Editunits } from './components/units/editunits/editunits';
import { Signout } from './components/others/signout/signout';

@NgModule({
  declarations: [
    App,
    Addprojects,
    Editprojects,
    Listprojects,
    Viewprojects,
    Dashboard,
    Header,
    Footer,
    Addbuildings,
    Editbuildings,
    Viewbuildings,
    Listbuildings,
    Listfloors,
    Addfloors,
    Viewfloors,
    Editfloors,
    Addemployees,
    Listemployees,
    Viewemployees,
    Editemployees,
    Home,
    Signup,
    Signin,
    Products,
    Productdetails,
    Addrawmaterials,
    Listrawmaterials,
    Viewrawmaterials,
    Editrawmaterials,
    Addstages,
    Editstages,
    Viewstages,
    Liststages,
    Listattendances,
    Viewattendances,
    Editattendances,
    Addattendances,
    Addunits,
    Viewunits,
    Listunits,
    Editunits,
    Signout
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch())
  ],
  bootstrap: [App]
})
export class AppModule { }
