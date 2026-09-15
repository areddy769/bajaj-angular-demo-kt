import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Mirrors the backend's Indian-mobile rule: optional +91/0 prefix, then 6-9 + 9 digits.
export function indianMobileValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '').toString().trim();
    if (!value) return null;
    return /^(?:\+91|0)?[6-9]\d{9}$/.test(value) ? null : { indianMobile: true };
  };
}

// Mirrors the backend's 6-digit pincode rule.
export function pincodeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '').toString().trim();
    if (!value) return null;
    return /^[1-9][0-9]{5}$/.test(value) ? null : { pincode: true };
  };
}
