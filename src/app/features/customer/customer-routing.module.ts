import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './customer.component';
import { NewComponent } from './new/new.component';
import { CustomerDetailsComponent} from './edit/edit.component';
import { unsavedChangesGuard } from 'src/app/core/guards/unsaved.guard';


const routes: Routes = [
  { path: '', component: CustomersComponent, 
    


  },
  
    {
        path: 'new',
        component:NewComponent,
        canDeactivate:[unsavedChangesGuard]
      },
      {
        path: 'edit/:id',
        component:CustomerDetailsComponent,
        canDeactivate:[unsavedChangesGuard]
      }
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
