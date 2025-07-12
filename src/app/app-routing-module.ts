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
  { path: 'viewfloors/:id', component: Viewfloors },
  { path: 'editfloors/:id', component: Editfloors },

  // Raw Materials
  { path: 'addrawmaterials', component: Addrawmaterials },
  { path: 'listrawmaterials', component: Listrawmaterials },
  { path: 'viewrawmaterials/:id', component: Viewrawmaterials },
  { path: 'editrawmaterials/:id', component: Editrawmaterials },

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
