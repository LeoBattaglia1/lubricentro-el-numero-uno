import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/usuario.entity';
import { PuntuacionController } from './puntuacion.controller';
import { Puntuacion } from './puntuacion.entity';
import { PuntuacionService } from './puntuacion.service';

@Module({
  imports : [ 
    TypeOrmModule.forFeature([ Puntuacion, Usuario ])
  ],
  controllers: [PuntuacionController],
  providers: [PuntuacionService]
})
export class PuntuacionModule {}