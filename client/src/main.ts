import { provideHttpClient } from '@angular/common/http';
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Routes, provideRouter, withHashLocation } from '@angular/router';
import { ROUTES } from '@app/constants/routes.constants';
import { AppComponent } from '@app/pages/app/app.component';
import { CharacterCreationPageComponent } from '@app/pages/character-creation-page/character-creation-page.component';
import { GameEditorPageComponent } from '@app/pages/game-editor-page/game-editor-page.component';
import { GameManagementPageComponent } from '@app/pages/game-management-page/game-management-page.component';
import { GameSessionCreationPageComponent } from '@app/pages/game-session-creation-page/game-session-creation-page.component';
import { GameSessionViewPageComponent } from '@app/pages/game-session-view-page/game-session-view-page.component';
import { GameSizeSelectionComponent } from '@app/pages/game-size-selection/game-size-selection.component';
import { JoinGameSessionPageComponent } from '@app/pages/join-game-session-page/join-game-session-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { PlayersWaitingRoomPageComponent } from '@app/pages/players-waiting-room-page/players-waiting-room.component';
import { removeLeadingSlash } from './app/utils/route.utils';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

const routes: Routes = [
    { path: '', redirectTo: removeLeadingSlash(ROUTES.home), pathMatch: 'full' },

    {
        path: removeLeadingSlash(ROUTES.home),
        component: MainPageComponent,
    },
    {
        path: removeLeadingSlash(ROUTES.gameManagement),
        component: GameManagementPageComponent,
    },
    {
        path: removeLeadingSlash(ROUTES.gameSessionCreation),
        component: GameSessionCreationPageComponent,
    },
    {
        path: removeLeadingSlash(ROUTES.gameSizeSelection),
        component: GameSizeSelectionComponent,
    },
    {
        path: removeLeadingSlash(ROUTES.gameEditor),
        component: GameEditorPageComponent,
    },
    {
        path: removeLeadingSlash(ROUTES.joinSession),
        component: JoinGameSessionPageComponent,
    },
    {
        path: removeLeadingSlash(ROUTES.characterCreation),
        component: CharacterCreationPageComponent,
    },
    {
        path: removeLeadingSlash(ROUTES.playersWaitingRoom),
        component: PlayersWaitingRoomPageComponent,
    },
    {
        path: removeLeadingSlash(ROUTES.gameSession),
        component: GameSessionViewPageComponent,
    },

    { path: '**', redirectTo: removeLeadingSlash(ROUTES.home) },
];

bootstrapApplication(AppComponent, {
    providers: [provideHttpClient(), provideRouter(routes, withHashLocation()), provideAnimations()],
});
