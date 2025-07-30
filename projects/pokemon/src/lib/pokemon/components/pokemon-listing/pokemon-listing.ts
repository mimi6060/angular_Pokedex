import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon';


@Component({
  selector: 'lib-pokemon-list',
  standalone: true,
  templateUrl: './pokemon-listing.html',
  styleUrl: './pokemon-listing.css',
  imports: [CommonModule]
})
export class PokemonList {
  private readonly pokemonService = inject(PokemonService);
  private readonly router = inject(Router);
  private statEmojis = {
    hp: "❤️",
    attack: "⚔️",
    defense: "🛡️",
  };
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

  getPokemonSummary(name: string) {
    const pokemon = this.pokemonService.getPokemonFromCache(name);
    return {
      img: pokemon?.sprites.other['official-artwork'].front_default,
      types: pokemon?.types,
      stats: pokemon?.stats,
    };
  }

  getStatEmoji(statName: keyof typeof this.statEmojis | string) {
    if (statName in this.statEmojis) {
      return this.statEmojis[<keyof typeof this.statEmojis>statName];
    }
    return "❔";
  }
}
