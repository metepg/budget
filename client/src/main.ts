import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { importProvidersFrom } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideAnimations(),
    importProvidersFrom(ConfirmDialogModule),
    MessageService,
    ConfirmationService
  ]
}).catch((err) => console.error(err));