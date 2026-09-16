import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  editMode = false;
  userId?: number;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Read user ID passed secretly through navigation state
    const state = history.state;
    this.userId = state?.id;
    this.editMode = !!this.userId;

    this.userForm = this.fb.group({
      id: [null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: [''],
      city: [''],
      mobile: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.editMode ? [] : [Validators.required]]
    });

    if (this.editMode && this.userId) {
      const user = this.userService.getUserById(this.userId);
      if (user) {
        this.userForm.patchValue(user);
      }
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.userService.saveUser(this.userForm.value);
      this.router.navigate(['/users']);
    }
  }
}