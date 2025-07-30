import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon';
import { PokemonDetailResponse } from '../../models/pokemon';

@Component({
  selector: 'lib-pokemon-detail',
  standalone: true,
  templateUrl: './pokemon-detail.html',
  styleUrl: './pokemon-detail.css',
  imports: [CommonModule, RouterModule]
})
export class PokemonDetail {
  private readonly pokemonService = inject(PokemonService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly pokemonDetail = this.pokemonService.pokemonDetailState;

  constructor() {
    this.route.params.subscribe(params => {
      const name = params['name'];
      if (name) {
        this.pokemonService.getPokemonDetail(name);
      }
    });

    effect(() => {
      const detail = this.pokemonDetail();
      if (detail) {
        console.log('Pokémon reçu :', detail.data);
      }
    });
  }

  getStatEmoji(statName: string): string {
    switch (statName.toLowerCase()) {
      case 'hp': return '❤️';
      case 'attack': return '⚔️';
      case 'defense': return '🛡️';
      case 'speed': return '💨';
      case 'special-attack': return '🔮';
      case 'special-defense': return '🧱';
      default: return '📊';
    }
  }


  previousPokemon(){

  }

  nextPokemon(){
    
  }



}
