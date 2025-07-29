import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Pokemon {
  private http = inject(HttpClient);
  private api = 'https://pokeapi.co/api/v2/pokemon';

  // Signals
  offset = signal(0);
  limit = 20;

  response = signal<any | null>(null);
  loading = signal(false);

  // Derived signal (computed)
  pokemons = computed(() => this.response()?.results ?? []);
  next = computed(() => this.response()?.next ?? null);
  previous = computed(() => this.response()?.previous ?? null);

  constructor() {
    effect(() => {
      this.fetchList();
    });
  }
    setOffset(newOffset: number) {
    this.offset.set(newOffset);
  }

  fetchList() {
    this.loading.set(true);
    this.http
      .get(`${this.api}?limit=${this.limit}&offset=${this.offset()}`)
      .subscribe((res) => {
        this.response.set(res);
        this.loading.set(false);
      });
  }

  getPokemon(name: string) {
    return this.http.get(`${this.api}/${name}`);
  }
}
