import { CanDeactivateFn } from '@angular/router';
import { CanComponentDeactivate } from 'src/app/models/models';

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component
) => {
  return component.canDeactivate();
};