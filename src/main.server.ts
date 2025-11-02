// Angular 17+ application builder expects a default export that bootstraps the server app.
// Keep using the existing AppServerModule (NgModule-based SSR) and expose a default bootstrap function.
import { AppServerModule } from './app/app.server.module';
import { platformServer, INITIAL_CONFIG } from '@angular/platform-server';
import { ApplicationRef } from '@angular/core';
import { readFileSync } from 'fs';
import { join } from 'path';

// Ensure the server renderer receives a document containing the app root element
const indexHtml = readFileSync(join(process.cwd(), 'src/index.html'), 'utf-8');

export default async function bootstrap() {
    const platform = platformServer([
        { provide: INITIAL_CONFIG, useValue: { document: indexHtml } },
    ]);
    const moduleRef = await platform.bootstrapModule(AppServerModule);
    // Return the ApplicationRef so the SSR engine can properly await stability
    return moduleRef.injector.get(ApplicationRef);
}
