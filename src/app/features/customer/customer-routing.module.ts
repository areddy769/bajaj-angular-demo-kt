import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './customer.component';
import { NewComponent } from './new/new.component';
import { CustomerDetailsComponent} from './edit/edit.component';


const routes: Routes = [
  { path: '', component: CustomersComponent, 
    


  },
  
    {
        path: 'new',
        component:NewComponent
      },
      {
        path: 'edit/:id',
        component:CustomerDetailsComponent
      }
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
