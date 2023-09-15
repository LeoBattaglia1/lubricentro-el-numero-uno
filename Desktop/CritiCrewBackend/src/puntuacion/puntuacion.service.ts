import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Puntuacion } from './puntuacion.entity';
import { PuntuacionDTO } from './puntuacion.dto';
import { Usuario } from 'src/usuario/usuario.entity';

@Injectable()
export class PuntuacionService {
  constructor(
    @InjectRepository(Puntuacion)
    private readonly puntuacionRepository: Repository<Puntuacion>,
  ) {}

  async crearPuntuacion(puntuacionDTO: PuntuacionDTO): Promise<Puntuacion> {
    const nuevaPuntuacion = this.puntuacionRepository.create(puntuacionDTO);
    return await this.puntuacionRepository.save(nuevaPuntuacion);
  }

  async obtenerPuntuaciones(): Promise<Puntuacion[]> {
    return await this.puntuacionRepository.find();
  }

  async obtenerPuntuacionPorId(id: number): Promise<Puntuacion> {
    const puntuacion = await this.puntuacionRepository.findOneBy[(id)];
    if (!puntuacion) {
      throw new NotFoundException('Puntuacion no encontrada');
    }
    return puntuacion;
  }


  async actualizarPuntuacion(id: number, usuario: Usuario, puntuacion: number, id_pelicula: number): Promise<Puntuacion> {
    const puntuacionEntity = await this.puntuacionRepository.findOneBy[(id)];
  
    if (!puntuacionEntity) {
      throw new NotFoundException(`Puntuación con ID ${id} no encontrada`);
    }
  
    puntuacionEntity.setUsuario(usuario);
    puntuacionEntity.setPuntuacion(puntuacion);
    puntuacionEntity.setIdPelicula(id_pelicula);
  
    return this.puntuacionRepository.save(puntuacionEntity);
  }
  

  async eliminarPuntuacion(id: number): Promise<void> {
    const puntuacion = await this.obtenerPuntuacionPorId(id);
    await this.puntuacionRepository.remove(puntuacion);
  }
}
           
