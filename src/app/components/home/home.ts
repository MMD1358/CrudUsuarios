import { Component } from '@angular/core';
import { Footer } from '../footer/footer';
import { Table } from '../table/table';
import { Title } from '../title/title';
import { UserForm } from '../user-form/user-form';

@Component({
  selector: 'app-home',
  imports: [Title, Table, UserForm, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
