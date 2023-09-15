import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioDTO } from './usuario.dto';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  
  @Post()
  async crearUsuario(@Body() usuarioDto: UsuarioDTO) {
    const nuevoUsuario = await this.usuarioService.crearUsuario(
      usuarioDto.nombre,
      usuarioDto.correo,
      usuarioDto.contraseña
    );
    return nuevoUsuario;
  }
  

  @Get()
  async getAllUsuarios() {
    const usuarios = await this.usuarioService.getAllUsuarios();
    return usuarios;
  }

  @Get(':id')
  async getUsuarioById(@Param('id') id: number) {
    const usuario = await this.usuarioService.getUsuarioById(id);
    return usuario;
  }

  @Put(':id')
  async actualizarUsuario(@Param('id') id: number, @Body('nombre') nombre: string, @Body('correo') correo: string, @Body('contraseña') contraseña: string) {
      const usuarioActualizado = await this.usuarioService.actualizarUsuario(id, nombre, correo, contraseña);
      return usuarioActualizado;
  }
  

  @Delete(':id')
  async eliminarUsuario(@Param('id') id: number) {
    await this.usuarioService.eliminarUsuario(id);
    return { mensaje: 'Usuario eliminado correctamente' };
  }
}
