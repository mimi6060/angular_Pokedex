import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon';


@Component({
  selector: 'lib-pokemon-list',
  standalone: true,
  templateUrl: './pokemon-listing.html',
  styleUrl: './pokemon-listing.css',
  imports: [CommonModule, TitleCasePipe]
})
export class PokemonList {
  private readonly pokemonService = inject(PokemonService);
  private readonly router = inject(Router);
  readonly pokemonList = this.pokemonService.pokemonListState;
  offset = 0;
  limit = 20;
  total = 0;

  constructor() {
    // Met à jour les valeurs quand la liste change
    effect(() => {
      const listData = this.pokemonService.pokemonList();
      if (listData) {
        this.total = listData.count;
        this.pokemonService.fetchAllListDetails();
      }
    });
  }

  ngOnInit() {
    this.pokemonService.getPokemonList(this.limit, this.offset);
  }

  prevPage(): void {
    this.offset = Math.max(0, this.offset - this.limit);
    this.pokemonService.getPokemonList(this.limit, this.offset);
  }

  nextPage(): void {
    if (this.offset + this.limit < this.total) {
      this.offset += this.limit;
      this.pokemonService.getPokemonList(this.limit, this.offset);
    }
  }

  selectPokemon(name: string) {
    this.router.navigate(['/pokemons', name]);
  }

  getPokemonImg(name: string) {
    return this.pokemonService.getPokemonFromCache(name)?.sprites.front_default;
  }
}
