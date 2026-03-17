import { Component, signal } from '@angular/core';
import { Footer } from './components/footer/footer';
import { Home } from './components/home/home';

@Component({
  selector: 'app-root',
  imports: [Home, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('crudUsers');
}
