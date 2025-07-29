import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private pokemonsCache: any[] | null = null;

  constructor(private http: HttpClient) {}

  getPokemons(): Observable<any> {
    if (this.pokemonsCache) {
      return new Observable(observer => {
        observer.next({ results: this.pokemonsCache });
        observer.complete();
      });
    }
    return new Observable(observer => {
      this.http.get<any>('https://pokeapi.co/api/v2/pokemon?limit=151').subscribe({
        next: (result) => {
          this.pokemonsCache = result.results;
          observer.next(result);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  getPokemonNames(): Observable<string[]> {
    return new Observable(observer => {
      this.getPokemons().subscribe({
        next: (result) => {
          observer.next(result.results.map((p: any) => p.name));
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  getPokemon(name: string) {
    return this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${name}`);
  }

  getMove(name: string) {
    return this.http.get<any>(`https://pokeapi.co/api/v2/move/${name}`);
  }
}
