import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, BehaviorSubject, switchMap, of, catchError, tap, forkJoin } from 'rxjs';
import { LoadingState, PokemonDetailResponse, PokemonListResponse } from '../models/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'https://pokeapi.co/api/v2';

  // Cache pour les détails des Pokémon
  private readonly _pokemonCache = signal<Map<string, PokemonDetailResponse>>(new Map());

  // Signal pour tous les détails des Pokémon de la liste courante
  private readonly _listPokemonDetails = signal<PokemonDetailResponse[]>([]);

  // Loading state pour le fetch en masse
  readonly batchLoading = signal(false);

  // Signals pour l'état
  private readonly _currentPokemonId = signal<string | number | null>(null);
  private readonly _listParams = signal<{ limit?: number; offset?: number }>({});

  // Subjects pour déclencher les requêtes
  private readonly _pokemonDetailTrigger$ = new BehaviorSubject<string | null>(null);
  private readonly _pokemonListTrigger$ = new BehaviorSubject<{ limit?: number; offset?: number }>({});

  // Observable pokemonDetail$ avec cache
  private readonly pokemonDetail$ = this._pokemonDetailTrigger$.pipe(
    switchMap(name => {
      if (!name) return of(null);

      // Vérifie le cache d'abord
      const cached = this._pokemonCache().get(name);
      if (cached) {
        this.pokemonDetailLoading.set(false);
        return of(cached);
      }

      // Sinon fetch depuis l'API
      return this.fetchPokemonDetail(name);
    })
  );

  private readonly pokemonList$ = this._pokemonListTrigger$.pipe(
    switchMap(params => this.fetchPokemonList(params.limit, params.offset))
  );

  // Conversion en signals
  readonly pokemonDetail = toSignal(this.pokemonDetail$, { initialValue: null });
  readonly pokemonList = toSignal(this.pokemonList$, { initialValue: null });

  // Expose les détails de la liste
  readonly listPokemonDetails = computed(() => this._listPokemonDetails());

  // Expose le cache pour debug/info
  readonly cacheSize = computed(() => this._pokemonCache().size);

  // États de chargement
  readonly pokemonDetailLoading = signal(false);
  readonly pokemonListLoading = signal(false);

  // États d'erreur
  readonly pokemonDetailError = signal<string | null>(null);
  readonly pokemonListError = signal<string | null>(null);

  // Computed states
  readonly pokemonDetailState = computed<LoadingState<PokemonDetailResponse>>(() => ({
    data: this.pokemonDetail(),
    loading: this.pokemonDetailLoading(),
    error: this.pokemonDetailError()
  }));

  readonly pokemonListState = computed<LoadingState<PokemonListResponse>>(() => ({
    data: this.pokemonList(),
    loading: this.pokemonListLoading(),
    error: this.pokemonListError()
  }));

  // Méthodes publiques
  getPokemonList(limit?: number, offset?: number): void {
    const params = { limit, offset };
    this._listParams.set(params);
    this.pokemonListLoading.set(true);
    this.pokemonListError.set(null);
    this._pokemonListTrigger$.next(params);
  }

  getPokemonDetail(name: string): void {
    this._currentPokemonId.set(name);

    // Vérifie le cache d'abord
    const cached = this._pokemonCache().get(name);
    if (cached) {
      // Émet directement depuis le cache sans loader
      this._pokemonDetailTrigger$.next(name);
      return;
    }

    this.pokemonDetailLoading.set(true);
    this.pokemonDetailError.set(null);
    this._pokemonDetailTrigger$.next(name);
  }

  // Nouvelle méthode pour fetcher tous les détails de la liste
  fetchAllListDetails(): void {
    const list = this.pokemonList();
    if (!list || !list.results.length) return;

    this.batchLoading.set(true);

    // Prépare les observables pour chaque Pokémon
    const detailRequests$ = list.results.map(pokemon => {
      const { name } = pokemon;

      // Vérifie le cache
      const cached = this._pokemonCache().get(name);
      if (cached) {
        return of(cached);
      }

      // Sinon fetch
      return this.fetchPokemonDetailForCache(name);
    });

    // Execute toutes les requêtes en parallèle
    forkJoin(detailRequests$).subscribe({
      next: (details) => {
        this._listPokemonDetails.set(details.filter(d => d !== null) as PokemonDetailResponse[]);
        this.batchLoading.set(false);
      },
      error: (error) => {
        console.error('Erreur lors du fetch en masse:', error);
        this.batchLoading.set(false);
      }
    });
  }

  private fetchPokemonDetail(name: string): Observable<PokemonDetailResponse | null> {
    return this.http.get<PokemonDetailResponse>(`${this.apiBaseUrl}/pokemon/${name}`).pipe(
      tap((response) => {
        if (response) {
          // Ajoute au cache
          const cache = new Map(this._pokemonCache());
          cache.set(name, response);
          this._pokemonCache.set(cache);
        }
        this.pokemonDetailLoading.set(false);
      }),
      catchError(error => {
        this.pokemonDetailError.set(error.message || 'Erreur lors du chargement du Pokémon');
        this.pokemonDetailLoading.set(false);
        return of(null);
      })
    );
  }

  // Version spéciale pour le cache (sans modifier les états loading/error principaux)
  private fetchPokemonDetailForCache(name: string): Observable<PokemonDetailResponse | null> {
    return this.http.get<PokemonDetailResponse>(`${this.apiBaseUrl}/pokemon/${name}`).pipe(
      tap((response) => {
        if (response) {
          // Ajoute au cache
          const cache = new Map(this._pokemonCache());
          cache.set(name, response);
          this._pokemonCache.set(cache);
        }
      }),
      catchError(error => {
        console.error(`Erreur lors du chargement de ${name}:`, error);
        return of(null);
      })
    );
  }

  private fetchPokemonList(limit?: number, offset?: number): Observable<PokemonListResponse | null> {
    let params = new HttpParams();
    if (limit !== undefined) params = params.set('limit', limit.toString());
    if (offset !== undefined) params = params.set('offset', offset.toString());

    return this.http.get<PokemonListResponse>(`${this.apiBaseUrl}/pokemon`, { params }).pipe(
      tap(() => {
        this.pokemonListLoading.set(false);
        // Reset les détails de la liste précédente
        this._listPokemonDetails.set([]);
      }),
      catchError(error => {
        this.pokemonListError.set(error.message || 'Erreur lors du chargement de la liste');
        this.pokemonListLoading.set(false);
        return of(null);
      })
    );
  }

  // Méthode pour vider le cache
  clearCache(): void {
    this._pokemonCache.set(new Map());
    this._listPokemonDetails.set([]);
  }

  // Méthode pour obtenir un Pokémon du cache
  getPokemonFromCache(name: string): PokemonDetailResponse | undefined {
    return this._pokemonCache().get(name);
  }

  // Méthode utilitaire pour réinitialiser les états
  resetStates(): void {
    this._currentPokemonId.set(null);
    this._listParams.set({});
    this.pokemonDetailError.set(null);
    this.pokemonListError.set(null);
    this._listPokemonDetails.set([]);
  }
}
