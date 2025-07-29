import { Routes } from '@angular/router';
import { PokemonList } from 'pokemon';
import { PokemonDetail } from 'pokemon';

export const routes: Routes = [
    { path: '', redirectTo: 'pokemons', pathMatch: 'full' },
    { path: 'pokemons', component: PokemonList },
    { path: 'pokemons/:name', component: PokemonDetail },
    { path: '**', redirectTo: 'pokemons' }
];






