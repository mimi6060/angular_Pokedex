import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon';
import { PokemonSpeciesResponse, Sprites, SpriteUrl } from '../../models/pokemon';
import { StatEmojiPipe } from '../../pipes/stat-emoji.pipe';
import { extractSprites } from '../../tools/extract-sprites';

@Component({
  selector: 'lib-pokemon-detail',
  standalone: true,
  templateUrl: './pokemon-detail.html',
  styleUrl: './pokemon-detail.css',
  imports: [CommonModule, RouterModule,StatEmojiPipe]
})
export class PokemonDetail {
  private readonly pokemonService = inject(PokemonService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  currentMovePageIndex: number = 0;
  movesPerPage: number = 4; 
  spritesArray: SpriteUrl[] = [];
  currentSpriteIndex: number = 0;
  offset = 0;

  currentDescriptionIndex: number = 0;
  readonly englishDescriptions = signal<Array<{text: string, version: string}>>([]);
  readonly pokemonSpecies = this.pokemonService.pokemonSpecies;
  readonly pokemonDetail = this.pokemonService.pokemonDetailState;

  constructor() {
    this.route.params.subscribe(params => {
      const name = params['name'];
      if (name) {
        this.pokemonService.getPokemonDetail(name);
        this.loadPokemonSpecies(name);
      }
      const offset = params['offset']; 
      if (offset) {
        this.offset = offset;
      }
    });

    effect(() => {
      const detail = this.pokemonDetail();
      if (detail) {
        this.loadSprites(detail?.data?.sprites);
      }
      const species = this.pokemonSpecies();
      if (species) {
        this.extractEnglishDescriptions(species);
      }
    });
  }

  loadSprites(sprites: Sprites | undefined) {
    this.spritesArray = extractSprites(sprites);
  }

  previousPokemon(){
    if( this.currentSpriteIndex >= 1){
      this.currentSpriteIndex -= 1;
    }
  }

  nextPokemon(){
    if( this.currentSpriteIndex  < this.spritesArray.length-1){
      this.currentSpriteIndex += 1;
    }
  }


  // move 
 // Get all moves combined and sorted
  getAllMoves() {
    const pokemon = this.pokemonDetail().data;
    if (!pokemon?.moves) return [];

    const allMoves = pokemon.moves.map(moveEntry => {
      // Check if it's a level-up move
      const levelUpDetail = moveEntry.version_group_details
        .find(detail => detail.move_learn_method.name === 'level-up');
      
      if (levelUpDetail) {
        return {
          move: moveEntry.move,
          type: 'level-up' as const,
          level: levelUpDetail.level_learned_at,
          method: 'Level ' + levelUpDetail.level_learned_at
        };
      } else {
        // Other method
        const firstDetail = moveEntry.version_group_details[0];
        return {
          move: moveEntry.move,
          type: 'other' as const,
          level: 999, // High number for sorting
          method: firstDetail?.move_learn_method.name || 'unknown'
        };
      }
    });

    // Sort by level first, then by name
    return allMoves.sort((a, b) => {
      if (a.level !== b.level) {
        return a.level - b.level;
      }
      return a.move.name.localeCompare(b.move.name);
    });
  }

  // Get moves for current page
  getCurrentPageMoves() {
    const allMoves = this.getAllMoves();
    const startIndex = this.currentMovePageIndex * this.movesPerPage;
    const endIndex = startIndex + this.movesPerPage;
    return allMoves.slice(startIndex, endIndex);
  }

  // Get total number of pages
  getTotalMovePages() {
    const allMoves = this.getAllMoves();
    return Math.ceil(allMoves.length / this.movesPerPage);
  }

  // Navigate to previous page of moves
  previousMovePage() {
    if (this.currentMovePageIndex > 0) {
      this.currentMovePageIndex -= 1;
    }
  }

  // Navigate to next page of moves
  nextMovePage() {
    const totalPages = this.getTotalMovePages();
    if (this.currentMovePageIndex < totalPages - 1) {
      this.currentMovePageIndex += 1;
    }
  }

  // Navigate to move detail page
  navigateToMove(moveName: string) {
    this.router.navigate(['/move', moveName]);
  }
    // Load Pokemon Species data for descriptions
  private loadPokemonSpecies(pokemonName: string) {
      this.pokemonService.getPokemonSpecies(pokemonName);
  }

    // Extract English descriptions from species data
  private extractEnglishDescriptions(species: PokemonSpeciesResponse) {
    const englishEntries = species.flavor_text_entries
      .filter(entry => entry.language.name === 'en')
      .map(entry => ({
        text: entry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ').trim(),
        version: this.formatVersionName(entry.version.name)
      }))
      .filter((entry, index, self) => 
        // Remove duplicates based on text content
        index === self.findIndex(e => e.text === entry.text)
      );
    
    this.englishDescriptions.set(englishEntries);
    this.currentDescriptionIndex = 0;
  }
  // Format version names for display
  private formatVersionName(versionName: string): string {
    const versionMap: { [key: string]: string } = {
      'red': 'Pokémon Red',
      'blue': 'Pokémon Blue',
      'yellow': 'Pokémon Yellow',
      'gold': 'Pokémon Gold',
      'silver': 'Pokémon Silver',
      'crystal': 'Pokémon Crystal',
      'ruby': 'Pokémon Ruby',
      'sapphire': 'Pokémon Sapphire',
      'emerald': 'Pokémon Emerald',
      'firered': 'Pokémon FireRed',
      'leafgreen': 'Pokémon LeafGreen',
      'diamond': 'Pokémon Diamond',
      'pearl': 'Pokémon Pearl',
      'platinum': 'Pokémon Platinum',
      'heartgold': 'Pokémon HeartGold',
      'soulsilver': 'Pokémon SoulSilver',
      'black': 'Pokémon Black',
      'white': 'Pokémon White',
      'black-2': 'Pokémon Black 2',
      'white-2': 'Pokémon White 2',
      'x': 'Pokémon X',
      'y': 'Pokémon Y',
      'omega-ruby': 'Pokémon Omega Ruby',
      'alpha-sapphire': 'Pokémon Alpha Sapphire',
      'sun': 'Pokémon Sun',
      'moon': 'Pokémon Moon',
      'ultra-sun': 'Pokémon Ultra Sun',
      'ultra-moon': 'Pokémon Ultra Moon',
      'lets-go-pikachu': 'Pokémon Let\'s Go Pikachu',
      'lets-go-eevee': 'Pokémon Let\'s Go Eevee',
      'sword': 'Pokémon Sword',
      'shield': 'Pokémon Shield',
      'legends-arceus': 'Pokémon Legends: Arceus',
      'scarlet': 'Pokémon Scarlet',
      'violet': 'Pokémon Violet'
    };

    return versionMap[versionName] || versionName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Get current description
  getCurrentDescription() {
    const descriptions = this.englishDescriptions();
    if (descriptions.length === 0) return null;
    return descriptions[this.currentDescriptionIndex];
  }

  // Get total number of descriptions
  getTotalDescriptions() {
    return this.englishDescriptions().length;
  }

  // Navigate to previous description
  previousDescription() {
    const total = this.getTotalDescriptions();
    if (total > 0) {
      this.currentDescriptionIndex = this.currentDescriptionIndex > 0 
        ? this.currentDescriptionIndex - 1 
        : total - 1;
    }
  }

  // Navigate to next description
  nextDescription() {
    const total = this.getTotalDescriptions();
    if (total > 0) {
      this.currentDescriptionIndex = this.currentDescriptionIndex < total - 1 
        ? this.currentDescriptionIndex + 1 
        : 0;
    }
  }
}
