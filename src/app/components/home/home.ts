import { Component, DestroyRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { UsersCreate } from '../../services/models/users-create.model';
import { UsersUpdate } from '../../services/models/users-update.model';
import { Users } from '../../services/models/users.model';
import { UsersService } from '../../services/users-service';
import { Table } from '../table/table';
import { Title } from '../title/title';
import { UserForm } from '../user-form/user-form';

@Component({
  selector: 'app-home',
  imports: [Title, Table, UserForm],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private destroy = inject(DestroyRef);
  private usersService = inject(UsersService);

  userFormRef = viewChild(UserForm);

  selectedUser = signal<Users | null>(null);
  usersSignal = signal<Users[]>([]);
  isLoadingSignal = signal(false);
  errorMessageSignal = signal('');
  isSubmittingSignal = signal(false);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoadingSignal.set(true);
    this.errorMessageSignal.set('');

    this.usersService
      .getUsers()
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (users) => {
          this.usersSignal.set(users);
          this.isLoadingSignal.set(false);
        },
        error: (err) => {
          console.error(err);
          this.errorMessageSignal.set('Error cargando usuarios');
          this.isLoadingSignal.set(false);
        },
      });
  }

  onDeleteUser(id: string): void {
    const accepted = confirm('¿Confirmar borrado?');

    if (!accepted) return;

    this.usersService
      .deleteUser(id)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: () => {
          if (this.selectedUser()?.id === id) {
            this.selectedUser.set(null);
            this.userFormRef()?.resetForm();
          }

          this.loadUsers();
        },
        error: (err) => {
          console.error(err);
          this.errorMessageSignal.set('Error eliminando usuario');
        },
      });
  }

  onSubmitUser(payload: UsersCreate): void {
    if (this.isSubmittingSignal()) return;

    const selectedUser = this.selectedUser();

    this.isSubmittingSignal.set(true);
    this.errorMessageSignal.set('');

    const request$ = selectedUser
      ? this.usersService.updateUser(selectedUser.id, payload as UsersUpdate)
      : this.usersService.createUser(payload);

    request$
      .pipe(
        takeUntilDestroyed(this.destroy),
        finalize(() => this.isSubmittingSignal.set(false)),
      )
      .subscribe({
        next: () => {
          this.userFormRef()?.resetForm();
          this.selectedUser.set(null);
          this.loadUsers();
        },
        error: (err) => {
          console.error(err);
          this.errorMessageSignal.set(
            selectedUser ? 'Error editando usuario' : 'Error creando usuario',
          );
        },
      });
  }

  onEditUser(user: Users): void {
    this.selectedUser.set(user);
  }
}
