import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { Users } from '../../services/models/users.model';

@Component({
  selector: 'app-table',
  imports: [CommonModule, DatePipe],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table {
  users = input<Users[]>([]);
  isLoading = input<boolean>(false);
  errorMessage = input<string>('');

  deleteUser = output<string>();
  editUser = output<Users>();

  totalsUsers = computed(() => this.users().length);
}
