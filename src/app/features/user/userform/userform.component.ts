import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  User,
  UserFormValue,
  UserRole,
  UserStatus
} from 'src/app/models/models';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './userform.component.html',
  styleUrls: ['./userform.component.css']
})
export class UserFormComponent implements OnInit {

  /* =========================================
     Form
  ========================================== */

  userForm!: FormGroup;


  /* =========================================
     Mode
  ========================================== */

  isEditMode = false;

  isEditing = false;

  userId!: number;


  /* =========================================
     State
  ========================================== */

  loading = false;

  submitted = false;

  serverError = '';


  /* =========================================
     Options
  ========================================== */

  roles: UserRole[] = [
    'ADMIN',
    'USER'
  ];

  statuses: UserStatus[] = [
    'ACTIVE',
    'INACTIVE'
  ];


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private load: LoadingService,
    private noi: NotificationService
  ) {}


  ngOnInit(): void {

    this.createForm();

    /*
     * Check whether this is:
     *
     * /users/new
     *
     * OR
     *
     * /users/:id
     */
    const id =
      this.route.snapshot.paramMap.get('id');


    if (id) {

      /*
       * Existing user
       */
      this.isEditMode = true;

      this.userId = Number(id);

      this.loadUser(this.userId);

    } else {

      /*
       * New user
       */
      this.isEditMode = false;

      this.isEditing = true;

    }

  }


  /* =========================================
     Create Form
  ========================================== */

  private createForm(): void {

    this.userForm = this.fb.group({

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(150)
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100)
        ]
      ],

      role: [
        'USER',
        [
          Validators.required
        ]
      ],

      status: [
        'ACTIVE',
        [
          Validators.required
        ]
      ]

    });

  }


  /* =========================================
     Form Controls
  ========================================== */

  get f() {
    return this.userForm.controls;
  }


  /* =========================================
     Load User
  ========================================== */

  private loadUser(id: number): void {

    this.loading = true;

    this.load.show();

    this.serverError = '';


    this.userService
      .getById(id)
      .subscribe({

        next: (response) => {

          const user: User =
            response.data;


          console.log(
            'User:',
            user
          );


          /*
           * Populate form.
           *
           * Notice:
           *
           * User does NOT contain password.
           *
           * Therefore we don't patch password.
           */
          this.userForm.patchValue({

            name: user.name,

            email: user.email,

            role: user.role,

            status: user.status

          });


          /*
           * Password isn't needed
           * when editing.
           */
          this.userForm
            .get('password')
            ?.clearValidators();

          this.userForm
            .get('password')
            ?.updateValueAndValidity();


          /*
           * Existing user starts
           * in VIEW mode.
           */
          this.isEditing = false;

          this.userForm.disable();


          this.loading = false;

          this.load.hide();

        },


        error: (error) => {

          console.error(
            'Failed to load user:',
            error
          );


          this.loading = false;

          this.load.hide();


          this.serverError =
            error?.error?.message ||
            'Unable to load user.';


          this.noi.error(
            this.serverError
          );

        }

      });

  }


  /* =========================================
     Has Error
  ========================================== */

  hasError(
    field: string
  ): boolean {

    const control =
      this.userForm.get(field);


    return !!(
      control &&
      control.invalid &&
      (
        control.touched ||
        this.submitted
      )
    );

  }


  /* =========================================
     Error Message
  ========================================== */

  getErrorMessage(
    field: string
  ): string {

    const control =
      this.userForm.get(field);


    if (
      !control ||
      !control.errors
    ) {
      return '';
    }


    if (
      control.errors['required']
    ) {

      switch (field) {

        case 'name':
          return 'Name is required';

        case 'email':
          return 'Email is required';

        case 'password':
          return 'Password is required';

        case 'role':
          return 'Role is required';

        case 'status':
          return 'Status is required';

      }

    }


    if (
      control.errors['email']
    ) {

      return 'Please enter a valid email address';

    }


    if (
      control.errors['minlength']
    ) {

      return `Minimum length is ${
        control.errors['minlength'].requiredLength
      } characters`;

    }


    if (
      control.errors['maxlength']
    ) {

      return `Maximum length is ${
        control.errors['maxlength'].requiredLength
      } characters`;

    }


    return 'Invalid value';

  }


  /* =========================================
     Enable Edit
  ========================================== */

  enableEdit(): void {

    if (!this.isEditMode) {
      return;
    }


    this.isEditing = true;

    this.userForm.enable();


    /*
     * Password should remain optional
     * during update.
     */
    const password =
      this.userForm.get('password');


    password?.clearValidators();

    password?.updateValueAndValidity();

  }


  /* =========================================
     Cancel Edit
  ========================================== */

  cancelEdit(): void {

    if (!this.isEditMode) {
      this.cancel();
      return;
    }


    /*
     * Reload original user data.
     *
     * This is safer than trying to
     * manually restore every field.
     */
    this.loadUser(this.userId);

  }


  /* =========================================
     Submit
  ========================================== */

  submit(): void {

    this.submitted = true;

    this.serverError = '';


    /*
     * Show validation messages.
     */
    this.userForm.markAllAsTouched();


    if (
      this.userForm.invalid
    ) {
      return;
    }


    this.loading = true;

    this.load.show();


    /*
     * IMPORTANT:
     *
     * getRawValue() is used because
     * the form can be disabled in VIEW mode.
     *
     * At this point during submit,
     * it will normally be enabled.
     */
    const formValue =
      this.userForm.getRawValue();


    if (this.isEditMode) {

      this.updateUser(formValue);

    } else {

      this.createUser(formValue);

    }

  }


  /* =========================================
     Create User
  ========================================== */

  private createUser(
    formValue: UserFormValue
  ): void {

    this.userService
      .create(formValue)
      .subscribe({

        next: (response) => {

          console.log(
            'User created:',
            response
          );


          this.loading = false;

          this.load.hide();


          this.noi.success(
            'User created successfully'
          );


          /*
           * Go back to users list.
           */
          this.router.navigate([
            '/users'
          ]);

        },


        error: (error) => {

          this.handleError(
            error
          );

        }

      });

  }


  /* =========================================
     Update User
  ========================================== */

  private updateUser(
    formValue: UserFormValue
  ): void {

    /*
     * Don't send password when
     * it wasn't entered.
     */
    const payload: Partial<UserFormValue> = {

      name: formValue.name,

      email: formValue.email,

      role: formValue.role,

      status: formValue.status

    };


    /*
     * If password has been entered,
     * include it.
     */
    if (
      formValue.password &&
      formValue.password.trim()
    ) {

      payload.password =
        formValue.password;

    }


    this.userService
      .update(
        this.userId,
        payload
      )
      .subscribe({

        next: (response) => {

          console.log(
            'User updated:',
            response
          );


          this.loading = false;

          this.load.hide();


          this.noi.success(
            'User updated successfully'
          );


          /*
           * After update,
           * return to VIEW mode.
           */
          this.isEditing = false;

          this.userForm.disable();


          /*
           * Clear password.
           */
          this.userForm
            .get('password')
            ?.reset('');

        },


        error: (error) => {

          this.handleError(
            error
          );

        }

      });

  }


  /* =========================================
     Error Handler
  ========================================== */

  private handleError(
    error: any
  ): void {

    console.error(
      'User operation failed:',
      error
    );


    this.loading = false;

    this.load.hide();


    /*
     * Backend validation errors.
     *
     * Example:
     *
     * {
     *   success: false,
     *   message: "Validation failed",
     *   errors: [
     *     {
     *       field: "email",
     *       message: "Email already exists"
     *     }
     *   ]
     * }
     */
    const errors =
      error?.error?.errors;


    if (
      Array.isArray(errors)
    ) {

      errors.forEach(
        (item: {
          field: string;
          message: string;
        }) => {

          const control =
            this.userForm.get(
              item.field
            );


          if (control) {

            control.setErrors({
              server: item.message
            });

          }

        }
      );

    }


    this.serverError =
      error?.error?.message ||
      'Something went wrong.';


    this.noi.error(
      this.serverError
    );

  }


  /* =========================================
     Cancel
  ========================================== */

  cancel(): void {

    this.router.navigate([
      '/users'
    ]);

  }


  /* =========================================
     Reset
  ========================================== */

  resetForm(): void {

    if (this.isEditMode) {

      /*
       * In edit mode, reset means:
       * reload original server data.
       */
      this.loadUser(
        this.userId
      );

      return;
    }


    /*
     * New user.
     */
    this.submitted = false;

    this.serverError = '';


    this.userForm.reset({

      name: '',

      email: '',

      password: '',

      role: 'USER',

      status: 'ACTIVE'

    });

  }

}