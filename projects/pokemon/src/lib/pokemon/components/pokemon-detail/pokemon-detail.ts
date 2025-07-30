import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon';
import { PokemonDetailResponse, Sprites, SpriteUrl } from '../../models/pokemon';
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
  spritesArray: SpriteUrl[] = [];
  currentSpriteIndex: number = 0;

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
        this.loadSprites(detail?.data?.sprites);
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

}
