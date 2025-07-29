export interface PokemonListItem {
  id: number;
  name: string;
  sprite: string;
}

export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  name: string;
  url: string;
}

export interface PokemonMove {
  name: string;
  url: string;
}

export interface PokemonType {
  slot: number;
  name: string;
  url: string;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  name: string;
  url: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  order: number;
  weight: number;
  abilities: PokemonAbility[];
  forms: { name: string; url: string }[];
  game_indices: { game_index: number; version: { name: string; url: string } }[];
  held_items: { item: { name: string; url: string } }[];
  location_area_encounters: string;
  moves: { move: PokemonMove }[];
  species: { name: string; url: string };
  sprites: any;
  stats: PokemonStat[];
  types: { slot: number; type: PokemonType }[];
}