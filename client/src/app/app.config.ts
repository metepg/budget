import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
// import Aura from '@primeng/themes/aura';
// import Material from '@primeng/themes/material';
// import Nora from '@primeng/themes/nora';
import Lara from '@primeng/themes/lara';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
      withHashLocation()
    ),providePrimeNG({
      theme: {
        // preset: Aura
        // preset: Material
        // preset: Nora
        preset: Lara
      }
    })
  ]
};