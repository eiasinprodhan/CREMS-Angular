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
import { Signout } from './components/others/signout/signout';
import { Listtransactions } from './components/transactions/listtransactions/listtransactions';
import { Bookunits } from './components/units/bookunits/bookunits';
import { Addcustomers } from './components/customers/addcustomers/addcustomers';
import { Listcustomers } from './components/customers/listcustomers/listcustomers';
import { Viewcustomers } from './components/customers/viewcustomers/viewcustomers';
import { Editcustomers } from './components/customers/editcustomers/editcustomers';
import { Addtransactions } from './components/transactions/addtransactions/addtransactions';
import { Edittransactions } from './components/transactions/edittransactions/edittransactions';
import { Listbooking } from './components/units/listbooking/listbooking';
import { Viewbooking } from './components/units/viewbooking/viewbooking';
import { AdminGuard } from './guards/admin.guard';
import { AllGuard } from './guards/all.guard';
import { NotAuthenticatedGuard } from './guards/na.guard';



const routes: Routes = [
  // Others
  { path: 'dashboard', component: Dashboard },

  // Pages
  { path: '', component: Home , canActivate: [NotAuthenticatedGuard]},
  { path: 'products', component: Products , canActivate: [NotAuthenticatedGuard]},
  { path: 'productdetails/:id', component: Productdetails , canActivate: [NotAuthenticatedGuard]},
  { path: 'signin', component: Signin , canActivate: [NotAuthenticatedGuard]},
  { path: 'signup', component: Signup , canActivate: [NotAuthenticatedGuard]},
  { path: 'signout', component: Signout , canActivate: [AllGuard]},

  // Projects
  { path: 'addprojects', component: Addprojects, canActivate: [AllGuard]},
  { path: 'listprojects', component: Listprojects},
  { path: 'viewprojects/:id', component: Viewprojects , canActivate: [AllGuard]},
  { path: 'editprojects/:id', component: Editprojects , canActivate: [AllGuard]},

  // Buildings
  { path: 'addbuildings', component: Addbuildings , canActivate: [AllGuard]},
  { path: 'listbuildings', component: Listbuildings},
  { path: 'viewbuildings/:id', component: Viewbuildings , canActivate: [AllGuard]},
  { path: 'editbuildings/:id', component: Editbuildings , canActivate: [AllGuard]},

  // Floors
  { path: 'addfloors', component: Addfloors , canActivate: [AllGuard]},
  { path: 'listfloors', component: Listfloors , canActivate: [AllGuard]},
  { path: 'editfloors/:id', component: Editfloors , canActivate: [AllGuard]},

  // Staged
  { path: 'addstages/:id', component: Addstages , canActivate: [AllGuard]},
  { path: 'liststages/:id', component: Liststages , canActivate: [AllGuard]},
  { path: 'viewstages/:id', component: Viewstages , canActivate: [AllGuard]},
  { path: 'editstages/:id', component: Editstages , canActivate: [AllGuard]},

  // Attendance
  { path: 'addattendances/:id', component: Addattendances , canActivate: [AllGuard]},
  { path: 'listattendances/:id', component: Listattendances , canActivate: [AllGuard]},
  { path: 'viewattendances/:id', component: Viewattendances , canActivate: [AllGuard]},
  { path: 'editattendances/:id', component: Editattendances , canActivate: [AllGuard]},

  // Units
  { path: 'addunits/:id', component: Addunits , canActivate: [AllGuard]},
  { path: 'listunits', component: Listunits , canActivate: [AllGuard]},
  { path: 'viewunits/:id', component: Viewunits , canActivate: [AllGuard]},
  { path: 'editunits/:id', component: Editunits , canActivate: [AllGuard]},
  { path: 'bookunit/:id', component: Bookunits , canActivate: [AllGuard]},
  { path: 'listbooking', component: Listbooking , canActivate: [AllGuard]},
  { path: 'viewbooking/:id', component: Viewbooking , canActivate: [AllGuard]},

  // Raw Materials
  { path: 'stockin', component: Addrawmaterials , canActivate: [AllGuard]},
  { path: 'listrawmaterials', component: Listrawmaterials , canActivate: [AllGuard]},
  { path: 'rawmaterilas/:id', component: Viewrawmaterials , canActivate: [AllGuard]},
  { path: 'addrawmaterials', component: Editrawmaterials , canActivate: [AdminGuard]},

  // Employees
  { path: 'addemployees', component: Addemployees , canActivate: [AdminGuard]},
  { path: 'listemployees', component: Listemployees , canActivate: [AdminGuard]},
  { path: 'viewemployees/:id', component: Viewemployees , canActivate: [AdminGuard]},
  { path: 'editemployees/:id', component: Editemployees , canActivate: [AdminGuard]},

  // Customers
  { path: 'addcustomers', component: Addcustomers , canActivate: [AdminGuard]},
  { path: 'listcustomers', component: Listcustomers , canActivate: [AdminGuard]},
  { path: 'viewcustomers/:id', component: Viewcustomers , canActivate: [AdminGuard]},
  { path: 'editcustomers/:id', component: Editcustomers , canActivate: [AdminGuard]},



  // Transaction
  { path: 'listtransactions', component: Listtransactions , canActivate: [AdminGuard]},
  { path: 'addtransactions', component: Addtransactions , canActivate: [AdminGuard]},
  { path: 'edittransactions/:id', component: Edittransactions , canActivate: [AdminGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
