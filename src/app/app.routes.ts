import { Routes } from '@angular/router';
import { PokemonList } from 'pokemon';
import { PokemonDetail } from 'pokemon';

export const routes: Routes = [
    { path: '', redirectTo: 'pokemons', pathMatch: 'full' },
    { path: 'pokemons', component: PokemonList },
    { path: 'pokemons/:offset', component: PokemonList },
    { path: 'pokemonsDetail/:name', component: PokemonDetail },
     { path: 'pokemonsDetail/:name/:offset', component: PokemonDetail },
    { path: '**', redirectTo: 'pokemons' }
];






