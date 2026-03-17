import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UsersCreate } from './models/users-create.model';
import { UsersUpdate } from './models/users-update.model';
import { Users } from './models/users.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  readonly #http = inject(HttpClient);
  readonly #api = 'http://localhost:3000/v1/users';

  private usersSubject = new BehaviorSubject<Users[]>([]);
  users$ = this.usersSubject.asObservable();

  getUsers(): Observable<Users[]> {
    return this.#http.get<Users[]>(this.#api).pipe(tap((users) => this.usersSubject.next(users)));
  }

  getUserById(id: string): Observable<Users> {
    return this.#http.get<Users>(`${this.#api}/${id}`);
  }

  createUser(payload: UsersCreate): Observable<Users> {
    return this.#http.post<Users>(this.#api, payload).pipe(
      tap((newUser) => {
        const currentUsers = this.usersSubject.value;
        this.usersSubject.next([...currentUsers, newUser]);
      }),
    );
  }

  updateUser(id: string, payload: UsersUpdate): Observable<Users> {
    return this.#http.patch<Users>(`${this.#api}/${id}`, payload).pipe(
      tap((updatedUser) => {
        const updatedUsers = this.usersSubject.value.map((user) =>
          user.id === id ? updatedUser : user,
        );
        this.usersSubject.next(updatedUsers);
      }),
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.#http.delete<void>(`${this.#api}/${id}`).pipe(
      tap(() => {
        const filteredUsers = this.usersSubject.value.filter((user) => user.id !== id);
        this.usersSubject.next(filteredUsers);
      }),
    );
  }
}
