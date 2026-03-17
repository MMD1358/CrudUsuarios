import { JsonPipe } from '@angular/common';
import { Component, computed, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersCreate } from '../../services/models/users-create.model';
import { Users } from '../../services/models/users.model';
import { UserFormGroup } from './user-form.model';
@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm {
  isSubmitting = input<boolean>(false);
  selectedUser = input<Users | null>(null);

  submitUser = output<UsersCreate>();

  submitButtonText = computed(() => (this.selectedUser() ? 'Guardar cambios' : 'Crear usuario'));

  form = new FormGroup<UserFormGroup>({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  constructor() {
    effect(() => {
      const user = this.selectedUser();

      if (user) {
        this.form.patchValue({
          email: user.email,
          name: user.name,
        });
        return;
      }

      this.form.reset();
    });
  }

  get email() {
    return this.form.controls.email;
  }

  get name() {
    return this.form.controls.name;
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.isSubmitting()) {
      console.warn('Formulario inválido', this.form.errors, this.form.value);
      return;
    }

    const payload = this.form.getRawValue();

    this.submitUser.emit({
      email: payload.email ?? '',
      name: payload.name ?? '',
    });
  }

  onReset(): void {
    this.form.reset();
  }

  resetForm(): void {
    this.form.reset();
  }
}
