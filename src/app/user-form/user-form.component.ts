import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit, OnDestroy {

  userForm!: FormGroup;

  loading = false;
  errorMessage = '';

  isEditMode = false;
  userId!: number;

  private destroy$ = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {

    this.userForm = this.fb.group({
      firstName: ['', Validators.required],

      lastName: ['', Validators.required],

      email: ['', [
        Validators.required,
        Validators.email
      ]],

      mobile: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]],

      city: ['', Validators.required],

      password: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {

      this.isEditMode = true;
      this.userId = Number(id);

      this.loadUser(this.userId);

    } else {

      this.userForm.get('password')?.setValidators([
        Validators.required,
        Validators.minLength(6)
      ]);

      this.userForm.get('password')?.updateValueAndValidity();
    }
  
  }

  loadUser(id: number): void {

    this.loading = true;
    this.errorMessage = '';

    this.userService.getUser(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {

        this.userForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobile: user.mobile,
          city: user.city
        });

        this.loading = false;
      },

      error: (error) => {

        console.error(error);

        this.errorMessage = 'Failed to load user.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    if (this.isEditMode) {

      this.userService
        .updateUser(this.userId, this.userForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {

            console.log('User updated:', response);

            this.loading = false;

            this.router.navigate(['/users']);
          },

          error: (error) => {

            console.error(error);

            this.loading = false;
            this.errorMessage = 'Failed to update user.';
          }
        });

    } else {

      this.userService
        .addUser(this.userForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {

            console.log('User added:', response);

            this.loading = false;

            this.router.navigate(['/users']);
          },

          error: (error) => {

            console.error(error);

            this.loading = false;
            this.errorMessage = 'Failed to add user.';
          }
        });
    }
  }
}