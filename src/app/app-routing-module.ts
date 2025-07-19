import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Addprojects } from './components/projects/addprojects/addprojects';
import { Listprojects } from './components/projects/listprojects/listprojects';
import { Viewprojects } from './components/projects/viewprojects/viewprojects';
import { Editprojects } from './components/projects/editprojects/editprojects';
import { Dashboard } from './components/others/dashboard/dashboard';
import { Addbuildings } from './components/buildings/addbuildings/addbuildings';
import { Listbuildings } from './components/buildings/listbuildings/listbuildings';
import { Viewbuildings } from './components/buildings/viewbuildings/viewbuildings';
import { Editbuildings } from './components/buildings/editbuildings/editbuildings';
import { Editfloors } from './components/floors/editfloors/editfloors';
import { Viewfloors } from './components/floors/viewfloors/viewfloors';
import { Listfloors } from './components/floors/listfloors/listfloors';
import { Addfloors } from './components/floors/addfloors/addfloors';
import { Home } from './components/pages/home/home';
import { Products } from './components/pages/products/products';
import { Productdetails } from './components/pages/productdetails/productdetails';
import { Signin } from './components/pages/signin/signin';
import { Signup } from './components/pages/signup/signup';
import { Editemployees } from './components/employees/editemployees/editemployees';
import { Viewemployees } from './components/employees/viewemployees/viewemployees';
import { Listemployees } from './components/employees/listemployees/listemployees';
import { Addemployees } from './components/employees/addemployees/addemployees';
import { Addrawmaterials } from './components/rawmaterials/addrawmaterials/addrawmaterials';
import { Listrawmaterials } from './components/rawmaterials/listrawmaterials/listrawmaterials';
import { Viewrawmaterials } from './components/rawmaterials/viewrawmaterials/viewrawmaterials';
import { Editrawmaterials } from './components/rawmaterials/editrawmaterials/editrawmaterials';
import { Addstages } from './components/stages/addstages/addstages';
import { Liststages } from './components/stages/liststages/liststages';
import { Viewstages } from './components/stages/viewstages/viewstages';
import { Editstages } from './components/stages/editstages/editstages';
import { Addattendances } from './components/attendances/addattendances/addattendances';
import { Listattendances } from './components/attendances/listattendances/listattendances';
import { Viewattendances } from './components/attendances/viewattendances/viewattendances';
import { Editattendances } from './components/attendances/editattendances/editattendances';
import { Addunits } from './components/units/addunits/addunits';
import { Listunits } from './components/units/listunits/listunits';
import { Editunits } from './components/units/editunits/editunits';
import { Viewunits } from './components/units/viewunits/viewunits';



const routes: Routes = [
  // Others
  { path: 'dashboard', component: Dashboard },

  // Pages
  { path: '', component: Home },
  { path: 'products', component: Products },
  { path: 'productdetails', component: Productdetails },
  { path: 'signin', component: Signin },
  { path: 'signup', component: Signup },

  // Projects
  { path: 'addprojects', component: Addprojects },
  { path: 'listprojects', component: Listprojects },
  { path: 'viewprojects/:id', component: Viewprojects },
  { path: 'editprojects/:id', component: Editprojects },

  // Buildings
  { path: 'addbuildings', component: Addbuildings },
  { path: 'listbuildings', component: Listbuildings },
  { path: 'viewbuildings/:id', component: Viewbuildings },
  { path: 'editbuildings/:id', component: Editbuildings },

  // Floors
  { path: 'addfloors', component: Addfloors },
  { path: 'listfloors', component: Listfloors },
  { path: 'editfloors/:id', component: Editfloors },

  // Staged
  { path: 'addstages/:id', component: Addstages },
  { path: 'liststages/:id', component: Liststages },
  { path: 'viewstages/:id', component: Viewstages },
  { path: 'editstages/:id', component: Editstages },

  // Attendance
  { path: 'addattendances/:id', component: Addattendances },
  { path: 'listattendances/:id', component: Listattendances },
  { path: 'viewattendances/:id', component: Viewattendances },
  { path: 'editattendances/:id', component: Editattendances },

  // Ubits
  { path: 'addunits/:id', component: Addunits },
  { path: 'listunits', component: Listunits },
  { path: 'viewunits/:id', component: Viewunits },
  { path: 'editunits/:id', component: Editunits },

  // Raw Materials
  { path: 'stockin', component: Addrawmaterials },
  { path: 'listrawmaterials', component: Listrawmaterials },
  { path: 'rawmaterilas/:id', component: Viewrawmaterials },

  // Employees
  { path: 'addemployees', component: Addemployees },
  { path: 'listemployees', component: Listemployees },
  { path: 'viewemployees/:id', component: Viewemployees },
  { path: 'editemployees/:id', component: Editemployees }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
