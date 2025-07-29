import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonListing } from './pokemon-listing';

describe('PokemonListing', () => {
  let component: PokemonListing;
  let fixture: ComponentFixture<PokemonListing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonListing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonListing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
