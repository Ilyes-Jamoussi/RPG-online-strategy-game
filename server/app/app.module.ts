import { SessionModule } from '@app/modules/session/session.module';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GameSessionModule } from './modules/game-session/game-session.module';
import { GameModule } from './modules/game/game.module';

/**
 * Main application module
 * Configures global settings and imports feature modules
 */
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        EventEmitterModule.forRoot({
            global: true,
            wildcard: true,
            maxListeners: 30,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'assets'),
            serveRoot: '/assets',
            serveStaticOptions: {
                index: false,
                fallthrough: true,
                immutable: true,
            },
        }),
        MongooseModule.forRoot(process.env.DATABASE_CONNECTION_STRING),
        SessionModule,
        GameModule,
        GameSessionModule,
    ],
    providers: [Logger],
})
export class AppModule {}
