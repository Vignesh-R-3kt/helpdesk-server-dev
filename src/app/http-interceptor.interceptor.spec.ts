import { TestBed } from '@angular/core/testing';

import { HTTPInterceptorInterceptor } from './http-interceptor.interceptor';

describe('HTTPInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HTTPInterceptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HTTPInterceptorInterceptor = TestBed.inject(HTTPInterceptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
