import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';



@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async getAllUsuarios(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async getUsuarioById(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy[(id)];
  
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  
    return usuario;
  }
  

  async crearUsuario(nombre: string, correo: string, contraseña: string): Promise<Usuario> {
    const nuevoUsuario = new Usuario(nombre, correo, contraseña);
    return this.usuarioRepository.save(nuevoUsuario);
}

  async actualizarUsuario(id: number, nombre: string, correo: string, contraseña: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy[(id)];

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    usuario.setNombre(nombre);
    usuario.setCorreo(correo);
    usuario.setContraseña(contraseña);

    return this.usuarioRepository.save(usuario);
}


  async eliminarUsuario(id: number): Promise<string> {
    const usuario = await this.usuarioRepository.findOneBy[(id)];

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    await this.usuarioRepository.remove(usuario);
    return 'Usuario eliminado correctamente';
  }
}
