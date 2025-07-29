import { Component, inject } from '@angular/core';
import { Pokemon } from '../../services/pokemon';
import { RouterModule } from '@angular/router';
import { CommonModule, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'lib-pokemon-listing',
  imports: [ CommonModule, RouterModule , NgIf, NgForOf],
  templateUrl: './pokemon-listing.html',
  styleUrl: './pokemon-listing.css'
})
export class PokemonListing {
    service = inject(Pokemon);

  next() {
    const offset = this.service.offset() + this.service.limit;
    this.service.setOffset(offset);
  }

  prev() {
    const offset = this.service.offset() - this.service.limit;
    this.service.setOffset(Math.max(0, offset));
  }
}
