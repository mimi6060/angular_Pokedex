import { Component, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { PokemonService } from '../../services/pokemon';
import { MoveDetailResponse } from '../../models/pokemon';

@Component({
  selector: 'lib-move-detail',
  standalone: true,
  templateUrl: './move-detail.html',
  styleUrl: './move-detail.css',
  imports: [CommonModule, RouterModule]
})
export class MoveDetail {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly pokemonService = inject(PokemonService);
  
  readonly moveDetail = this.pokemonService.moveDetail;
  readonly loading = this.pokemonService.moveDetailLoading;
  readonly error = this.pokemonService.moveDetailError;

  constructor() {
    this.route.params.subscribe(params => {
      const moveName = params['moveName'];
      if (moveName) {
         this.pokemonService.getMoveDetail(moveName);
      }
    });
    
  }

  getEnglishEffect(): string {
    const move = this.moveDetail();
    if (!move?.effect_entries) return '';
    
    const englishEntry = move.effect_entries.find(
      entry => entry.language.name === 'en'
    );
    return englishEntry?.effect || '';
  }

  getEnglishFlavorText(): string {
    const move = this.moveDetail();
    if (!move?.flavor_text_entries) return '';
    
    const englishEntry = move.flavor_text_entries.find(
      entry => entry.language.name === 'en'
    );
    return englishEntry?.flavor_text || '';
  }

  goBack() {
    this.location.back();
  }

  formatMoveName(name: string): string {
    return name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  getTypeColor(type: string): string {
    const typeColors: { [key: string]: string } = {
      normal: '#A8A878',
      fighting: '#C03028',
      flying: '#A890F0',
      poison: '#A040A0',
      ground: '#E0C068',
      rock: '#B8A038',
      bug: '#A8B820',
      ghost: '#705898',
      steel: '#B8B8D0',
      fire: '#F08030',
      water: '#6890F0',
      grass: '#78C850',
      electric: '#F8D030',
      psychic: '#F85888',
      ice: '#98D8D8',
      dragon: '#7038F8',
      dark: '#705848',
      fairy: '#EE99AC'
    };
    return typeColors[type] || '#68A090';
  }

  getDamageClassIcon(damageClass: string): string {
    switch (damageClass) {
      case 'physical': return '⚔️';
      case 'special': return '✨';
      case 'status': return '🔄';
      default: return '❓';
    }
  }
}
