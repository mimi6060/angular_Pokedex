
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export interface Sprites {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  back_shiny: string | null;
  front_female: string | null;
  back_female: string | null;
  front_shiny_female: string | null;
  back_shiny_female: string | null;
  other: {
    ['official-artwork']: {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
}
export interface PokemonDetailResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: Sprites;
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
}

// État de chargement
export interface LoadingState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface SpriteUrl {
  label: string;
  url: string;
}

// Interfaces
// export interface PokedexResponse {
//   id: number;
//   name: string;
//   is_main_series: boolean;
//   descriptions: Array<{
//     description: string;
//     language: { name: string; url: string };
//   }>;
//   names: Array<{
//     name: string;
//     language: { name: string; url: string };
//   }>;
//   pokemon_entries: Array<{
//     entry_number: number;
//     pokemon_species: {
//       name: string;
//       url: string;
//     };
//   }>;
//   region: {
//     name: string;
//     url: string;
//   } | null;
//   version_groups: Array<{
//     name: string;
//     url: string;
//   }>;
// }
