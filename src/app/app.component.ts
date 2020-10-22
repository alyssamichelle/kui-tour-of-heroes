import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="header">
      <h1 class="main-title">
        <span class="salty" data-text="Tour of H">Tour of H</span>
        <span data-text="eroes">eroes</span>
      </h1>
      <img src="../assets/images/retro-mlp/my-littt-ponies-rainbow.png" alt="retro my little pony rainbow" />

      <nav>
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/heroes" routerLinkActive="active">Heroes</a>
      </nav>
    </div>

    <div class="content-wrapper">
      <router-outlet></router-outlet>
      <app-messages></app-messages>
    </div>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
