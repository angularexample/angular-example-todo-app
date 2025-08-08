# AngularExampleTodoApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Steps Taken To Create This App

### Use Angular Scaffolding to Create the App

```ng new angular-example-todo-app```

When prompted, select these options:

Zoneless: ```y```

Styles: ```SCSS```

### Remove Generated Home Page Content

In the app root component template,
```src/app/app.html```,
Remove all the code except the title.

```html
<h1>{{ title }}</h1>
```

### Remove routing

In the app component,
```src/app/app.ts```,
remove routing from the imports.

Remove this:

```
import { RouterOutlet } from '@angular/router';
```

BEFORE

```typescript
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
```

AFTER
```typescript
@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
```

In the app config,
```src/app/app.config.ts```,
remove the import and the providers for routing.

```typescript
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
```

BEFORE

```typescript
  providers: [
  provideBrowserGlobalErrorListeners(),
  provideZonelessChangeDetection(),
  provideRouter(routes)
]
```

AFTER

```typescript
  providers: [
  provideBrowserGlobalErrorListeners(),
  provideZonelessChangeDetection(),
]
```

Remove the routes file,
```src/app/app.routes.ts```.

### Add HttpClient to the app providers

In the app config,
```src/app/app.config.ts```,
add the import for HttpClient, and add HttpClient to the providers.

```typescript
import { provideHttpClient } from '@angular/common/http';
```

BEFORE

```typescript
  providers: [
  provideBrowserGlobalErrorListeners(),
  provideZonelessChangeDetection(),
]
```

AFTER

```typescript
  providers: [
  provideBrowserGlobalErrorListeners(),
  provideZonelessChangeDetection(),
  provideHttpClient()
]
```

### Add the HttpClient to the app component

Add the import for HttpClient.

```typescript
import { HttpClient } from '@angular/common/http';
```

Add the reference to the HttpClient service using the ```inject``` syntax.

```typescript
import {Component, inject} from '@angular/core';
```

```typescript
  httpClient: HttpClient = inject(HttpClient);
```

