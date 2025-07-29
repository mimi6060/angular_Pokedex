import { Routes } from '@angular/router';
import { PokemonList } from 'pokemon';
import { PokemonDetail } from 'pokemon';

export const routes: Routes = [
    { path: '', redirectTo: 'pokemons', pathMatch: 'full' },
    { path: 'pokemons', component: PokemonList },
    { path: 'pokemons/:id', component: PokemonDetail },
    { path: '**', redirectTo: 'pokemons' }
];






