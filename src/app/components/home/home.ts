import { Component } from '@angular/core';
import { Table } from '../table/table';
import { Title } from '../title/title';
import { UserForm } from '../user-form/user-form';

@Component({
  selector: 'app-home',
  imports: [Title, Table, UserForm],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
