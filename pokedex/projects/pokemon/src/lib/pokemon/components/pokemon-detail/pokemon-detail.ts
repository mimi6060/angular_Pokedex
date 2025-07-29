import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { PokemonService } from '../../services/pokemon';


@Component({
  selector: 'lib-pokemon-detail',
  standalone: true,
  templateUrl: './pokemon-detail.html',
  styleUrl: './pokemon-detail.css',
  imports: [CommonModule, TitleCasePipe, RouterModule]
})
export class PokemonDetail {
  private readonly pokemonService = inject(PokemonService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly pokemonDetail = this.pokemonService.pokemonDetailState;
  // pokemon = signal<any | null>(null);
  // loading = signal(true);
  // pokemonNames = signal<string[]>([]);
  // currentIndex = signal<number>(-1);
  // page = signal(0);
  // pageSize = 10;
  // spriteIndex = signal(0);
  // prevNextSprites: { [name: string]: string } = {};

  constructor() {
    this.route.params.subscribe(params => {
      this.pokemonService.getPokemonDetail(params['name']);
    });
  }

  getPokemonImg(name: string) {
    return this.pokemonService.getPokemonFromCache(name)?.sprites.front_default;
  }


  // loadPokemonNamesAndFetch(name: string) {
  //   this.pokemonService.getPokemonNames().subscribe({
  //     next: (names) => {
  //       this.pokemonNames.set(names);
  //       this.currentIndex.set(names.indexOf(name));
  //       this.fetchPokemon(name);
  //     },
  //     error: () => {
  //       this.pokemonNames.set([]);
  //       this.currentIndex.set(-1);
  //       this.pokemon.set(null);
  //     }
  //   });
  // }

  // fetchPokemon(name: string) {
  //   this.spriteIndex.set(0);
  //   this.page.set(0);
  //   this.loading.set(true);
  //   this.pokemonService.getPokemon(name).subscribe({
  //     next: (result) => {
  //       this.pokemon.set(result);
  //       this.loading.set(false);
  //     },
  //     error: () => {
  //       this.loading.set(false);
  //       this.pokemon.set(null);
  //     }
  //   });
  // }

  // goBack() {
  //   this.router.navigate(['/']);
  // }

  // goToPrevious() {
  //   const idx = this.currentIndex();
  //   if (idx > 0) {
  //     const prevName = this.pokemonNames()[idx - 1];
  //     this.router.navigate(['/pokemon', prevName]);
  //   }
  // }

  // goToNext() {
  //   const idx = this.currentIndex();
  //   if (idx < this.pokemonNames().length - 1) {
  //     const nextName = this.pokemonNames()[idx + 1];
  //     this.router.navigate(['/pokemon', nextName]);
  //   }
  // }

  // hasPrevious() {
  //   return this.currentIndex() > 0;
  // }

  // hasNext() {
  //   return this.currentIndex() < this.pokemonNames().length - 1;
  // }

  // get pagedMoves() {
  //   const moves = this.pokemon()?.moves || [];
  //   const start = this.page() * this.pageSize;
  //   return moves.slice(start, start + this.pageSize);
  // }

  // get totalPages() {
  //   const moves = this.pokemon()?.moves || [];
  //   return Math.ceil(moves.length / this.pageSize);
  // }

  // nextPage() {
  //   if (this.page() < this.totalPages - 1) this.page.set(this.page() + 1);
  // }

  // prevPage() {
  //   if (this.page() > 0) this.page.set(this.page() - 1);
  // }

  // get allSprites() {
  //   const p = this.pokemon();
  //   if (!p || !p.sprites) return [];
  //   const sprites = [];
  //   // Add main sprites
  //   if (p.sprites.front_default) sprites.push({label: 'Front', url: p.sprites.front_default});
  //   if (p.sprites.back_default) sprites.push({label: 'Back', url: p.sprites.back_default});
  //   if (p.sprites.front_shiny) sprites.push({label: 'Front Shiny', url: p.sprites.front_shiny});
  //   if (p.sprites.back_shiny) sprites.push({label: 'Back Shiny', url: p.sprites.back_shiny});
  //   // Add other available sprites (home, official artwork, etc)
  //   if (p.sprites.other) {
  //     for (const key of Object.keys(p.sprites.other)) {
  //       const obj = p.sprites.other[key];
  //       if (obj && obj.front_default) sprites.push({label: key.replace(/_/g, ' '), url: obj.front_default});
  //       if (obj && obj.front_shiny) sprites.push({label: key.replace(/_/g, ' ') + ' Shiny', url: obj.front_shiny});
  //     }
  //   }
  //   return sprites;
  // }

  // nextSprite() {
  //   if (this.spriteIndex() < this.allSprites.length - 1) this.spriteIndex.set(this.spriteIndex() + 1);
  // }

  // prevSprite() {
  //   if (this.spriteIndex() > 0) this.spriteIndex.set(this.spriteIndex() - 1);
  // }

  // // Helper to get the sprite for a given Pokémon name
  // getPokemonSpriteByName(name: string): string {
  //   // Try to find the Pokémon in the list if already loaded
  //   if (this.pokemon() && this.pokemon().name === name && this.pokemon().sprites?.front_default) {
  //     return this.pokemon().sprites.front_default;
  //   }
  //   // Try to get from localStorage cache if available (optional, fallback)
  //   const cached = localStorage.getItem('poke_' + name);
  //   if (cached) {
  //     try {
  //       const poke = JSON.parse(cached);
  //       return poke.sprites?.front_default || '';
  //     } catch {}
  //   }
  //   // Otherwise, return empty string (will show placeholder)
  //   return '';
  // }

  // // Async fetch for sprite (to be used in template with async pipe if needed)
  // fetchSpriteForName(name: string): Promise<string> {
  //   return new Promise((resolve) => {
  //     this.pokemonService.getPokemon(name).subscribe({
  //       next: (poke) => {
  //         // Optionally cache
  //         localStorage.setItem('poke_' + name, JSON.stringify(poke));
  //         resolve(poke.sprites?.front_default || '');
  //       },
  //       error: () => resolve('')
  //     });
  //   });
  // }

  // // Prefetch and store previous/next sprites in a local object
  // prefetchPrevNextSprites() {
  //   const idx = this.currentIndex();
  //   const names = this.pokemonNames();
  //   [idx - 1, idx + 1].forEach(i => {
  //     if (i >= 0 && i < names.length && !this.prevNextSprites[names[i]]) {
  //       this.pokemonService.getPokemon(names[i]).subscribe({
  //         next: (poke) => {
  //           this.prevNextSprites[names[i]] = poke.sprites?.front_default || '';
  //         }
  //       });
  //     }
  //   });
  // }

  // Call prefetchPrevNextSprites whenever the currentIndex changes
  // ngDoCheck() {
  //   // this.prefetchPrevNextSprites();
  // }

  // getPrevSprite() {
  //   const idx = this.currentIndex();
  //   const name = this.pokemonNames()[idx - 1];
  //   return this.prevNextSprites[name] || '';
  // }

  // getNextSprite() {
  //   const idx = this.currentIndex();
  //   const name = this.pokemonNames()[idx + 1];
  //   return this.prevNextSprites[name] || '';
  // }
}
