import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comentario } from './comentario.entity';
import { Usuario } from 'src/usuario/usuario.entity';

@Injectable()
export class ComentarioService {
  constructor(
    @InjectRepository(Comentario)
    private readonly comentarioRepository: Repository<Comentario>,
  ) {}

  async getAllComentarios(): Promise<Comentario[]> {
    return this.comentarioRepository.find();
  }

  async getComentarioById(id: number): Promise<Comentario> {
    const comentario = await this.comentarioRepository.findOneBy[(id)];
    if (!comentario) {
      throw new NotFoundException(`Comentario con ID ${id} no encontrado`);
    }
    return comentario;
  }
  

  async crearComentario(usuario: Usuario, comentario: string, id_pelicula?: number): Promise<Comentario> {
    const nuevoComentario = new Comentario(usuario, comentario, id_pelicula);
    return this.comentarioRepository.save(nuevoComentario);
  }
  
  
  async actualizarComentario(id: number, usuario: Usuario, comentario: string, id_pelicula: number): Promise<Comentario> {
    const ComentarioEntity = await this.comentarioRepository.findOneBy[(id)];
  
    if (!ComentarioEntity) {
      throw new NotFoundException(`Comentario con ID ${id} no encontrada`);
    }
  
    ComentarioEntity.setUsuario(usuario);
    ComentarioEntity.setComentario(comentario);
    ComentarioEntity.setIdPelicula(id_pelicula);
  
    return this.comentarioRepository.save(ComentarioEntity);
  }



  async eliminarComentario(id: number): Promise<string> {
    const comentario = await this.comentarioRepository.findOneBy[(id)];

    if (!comentario) {
      throw new NotFoundException(`Comentario con ID ${id} no encontrado`);
    }

    await this.comentarioRepository.remove(comentario);
    return 'Comentario eliminado correctamente';
  }
}
