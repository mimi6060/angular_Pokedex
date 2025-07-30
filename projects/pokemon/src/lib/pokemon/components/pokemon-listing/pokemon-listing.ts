import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon';
import { StatEmojiPipe } from '../../pipes/stat-emoji.pipe';




@Component({
  selector: 'lib-pokemon-list',
  standalone: true,
  templateUrl: './pokemon-listing.html',
  styleUrl: './pokemon-listing.css',
  imports: [CommonModule, StatEmojiPipe]
})
export class PokemonList {
  private readonly pokemonService = inject(PokemonService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

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
    this.route.params.subscribe(params => {
      const offset = params['offset']; 
      if (offset) {
        this.offset = Number(offset);
      }
    });
   
  }

  ngOnInit() {
    this.pokemonService.getPokemonList(this.limit, this.offset);
  }

  prevPage(): void {
    this.offset = Math.max(0, this.offset - this.limit);
    this.pokemonService.getPokemonList(this.limit, this.offset);
    if (this.offset >= 0) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { offset: this.offset },
        queryParamsHandling: 'merge'
      });
    }
  }

  nextPage(): void {
    if (this.offset + this.limit < this.total) {
      this.offset += this.limit;
      this.pokemonService.getPokemonList(this.limit, this.offset);
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { offset: this.offset },
        queryParamsHandling: 'merge'
      });
    }
  }

  selectPokemon(name: string) {
    this.router.navigate(['/customer', name, this.offset]);
  }

  getPokemonSummary(name: string) {
    const pokemon = this.pokemonService.getPokemonFromCache(name);
    return {
      img: pokemon?.sprites.other['official-artwork'].front_default,
      types: pokemon?.types,
      stats: pokemon?.stats,
    };
  }
}
