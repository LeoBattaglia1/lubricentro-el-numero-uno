import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { PuntuacionModule } from './puntuacion/puntuacion.module';
import { ComentarioModule } from './comentario/comentario.module';
import { GeneroModule } from './genero/genero.module';



@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'app') }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Criticrew10',
      database: 'criticrew',
      entities: [
        'dist/**/**.entity{.ts,.js}'
      ],
      synchronize: false,
    }),
    UsuarioModule,
    PuntuacionModule,
    ComentarioModule,
    GeneroModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
