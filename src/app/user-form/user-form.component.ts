import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.userId = Number(idParam);
      this.loadUserData(this.userId);
    }
  }

  
  private initForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: [''],
      city: [''],
      mobile: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
// get  id value when we are updating 
  private loadUserData(id: number): void {
    const user = this.userService.getUserById(id);
    if (user) {
      this.userForm.patchValue(user);
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }
  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
  }
  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    if (this.isEditMode && this.userId) {
      this.userService.updateUser({ id: this.userId, ...this.userForm.value });
    } else {
      this.userService.addUser(this.userForm.value);
    }

    this.router.navigate(['/users']);
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}