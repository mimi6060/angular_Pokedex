import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { signal } from '@angular/core';
import { PokemonDetails, PokemonListItem } from '../../models/pokemon';
import { PokemonService } from '../../services/pokemon';


@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  templateUrl: './pokemon-listing.html',
  styleUrl: './pokemon-listing.css',
  imports: [CommonModule, TitleCasePipe]
})
export class PokemonList {
  pokemons = signal<PokemonListItem[]>([]);
  loading = signal(true);
  page = signal(0);
  pageSize = 20;

  constructor(private pokemonService: PokemonService, private router: Router) {
    this.fetchPokemons();
  }

  fetchPokemons() {
    this.loading.set(true);
    this.pokemonService.getPokemons().subscribe({
      next: (result) => {
        const requests = result.results.map((item: any) =>
          this.pokemonService.getPokemon(item.name)
        );
        Promise.all(requests.map((req: any) => req.toPromise())).then((details: PokemonDetails[]) => {
          const pokemons: PokemonListItem[] = details.map((d) => ({
            id: d.id,
            name: d.name,
            sprite: d.sprites.front_default || '',
          }));
          this.pokemons.set(pokemons);
          this.loading.set(false);
        }).catch(err => {
          this.loading.set(false);
          this.pokemons.set([]);
          console.error('PokemonList: API error', err);
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.pokemons.set([]);
        console.error('PokemonList: API error', err);
      }
    });
  }

  goToDetail(name: string) {
    this.router.navigate(['/pokemon', name]);
  }

  getPokemonImageUrl(num: number) {
    // Now use the sprite from the model
    const p = this.pokemons().find(p => p.id === num);
    return p?.sprite || '';
  }

  get pagedPokemons() {
    const all = this.pokemons();
    const start = this.page() * this.pageSize;
    return all.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.pokemons().length / this.pageSize);
  }

  nextPage() {
    if (this.page() < this.totalPages - 1) this.page.set(this.page() + 1);
  }

  prevPage() {
    if (this.page() > 0) this.page.set(this.page() - 1);
  }
}
