import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ComentarioService } from './comentario.service';
import { ComentarioDTO } from './comentario.dto';

@Controller('comentarios')
export class ComentarioController {
  constructor(private readonly comentarioService: ComentarioService) {}

  @Post()
  async crearComentario(@Body() comentarioDTO: ComentarioDTO) {
    const { usuario, comentario, id_pelicula } = comentarioDTO; 
    const nuevoComentario = await this.comentarioService.crearComentario(usuario, comentario, id_pelicula);
    return nuevoComentario;
  }

  @Get()
  async getAllComentarios() {
    const comentarios = await this.comentarioService.getAllComentarios();
    return comentarios;
  }

  @Get(':id')
  async getComentarioById(@Param('id') id: number) {
    const comentario = await this.comentarioService.getComentarioById(id);
    return comentario;
  }

  @Put(':id')
  async actualizarComentario(@Param('id') id: number, @Body() comentarioDTO: ComentarioDTO) {
    const { usuario, comentario, id_pelicula } = comentarioDTO;
    const comentarioActualizado = await this.comentarioService.actualizarComentario(id, usuario, comentario, id_pelicula);
    return comentarioActualizado;
  }

  @Delete(':id')
  async eliminarComentario(@Param('id') id: number) {
    await this.comentarioService.eliminarComentario(id);
    return { mensaje: 'Comentario eliminado correctamente' };
  }
}
