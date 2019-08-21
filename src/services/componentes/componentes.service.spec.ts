import { TestBed } from '@angular/core/testing';

import { ComponentesService } from './componentes.service';

describe('ComponentesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComponentesService = TestBed.get(ComponentesService);
    expect(service).toBeTruthy();
  });
});
