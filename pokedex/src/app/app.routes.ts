import { Routes } from '@angular/router';
import { PokemonListing } from 'pokemon';
import { PokemonDetail } from 'pokemon';

export const routes: Routes = [
    { path: '', redirectTo: 'pokemons', pathMatch: 'full' },
    { path: 'pokemons', component: PokemonListing },
    { path: 'pokemons/:id', component: PokemonDetail },
    { path: '**', redirectTo: 'pokemons' }
];






