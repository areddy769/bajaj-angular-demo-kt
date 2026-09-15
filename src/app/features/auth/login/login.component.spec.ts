import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '../../../shared/shared.module';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [LoginComponent]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates an invalid form initially', () => {
    expect(component.form.valid).toBe(false);
  });

  it('rejects a bad email', () => {
    component.email?.setValue('not-an-email');
    expect(component.email?.valid).toBe(false);
  });

  it('rejects a short password', () => {
    component.password?.setValue('123');
    expect(component.password?.valid).toBe(false);
  });

  it('accepts valid credentials shape', () => {
    component.email?.setValue('admin@example.com');
    component.password?.setValue('Admin@123');
    expect(component.form.valid).toBe(true);
  });
});
