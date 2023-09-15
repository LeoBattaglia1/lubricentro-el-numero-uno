import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PuntuacionService } from './puntuacion.service';
import { PuntuacionDTO } from './puntuacion.dto';

@Controller('puntuaciones')
export class PuntuacionController {
  constructor(private readonly puntuacionService: PuntuacionService) {}

  @Post()
  async crearPuntuacion(@Body() puntuacionDTO: PuntuacionDTO) {
    const nuevaPuntuacion = await this.puntuacionService.crearPuntuacion(puntuacionDTO);
    return nuevaPuntuacion;
  }

  @Get()
  async obtenerPuntuaciones() {
    const puntuaciones = await this.puntuacionService.obtenerPuntuaciones();
    return puntuaciones;
  }

  @Get(':id')
  async obtenerPuntuacionPorId(@Param('id') id: number) {
    const puntuacion = await this.puntuacionService.obtenerPuntuacionPorId(id);
    return puntuacion;
  }

  @Put(':id')
  async actualizarPuntuacion(@Param('id') id: number, @Body() puntuacionDTO: PuntuacionDTO) {
    const { usuario, puntuacion, id_pelicula } = puntuacionDTO;
    const puntuacionActualizada = await this.puntuacionService.actualizarPuntuacion(id, usuario, puntuacion, id_pelicula);
    return puntuacionActualizada;
  }
  



  @Delete(':id')
  async eliminarPuntuacion(@Param('id') id: number) {
    await this.puntuacionService.eliminarPuntuacion(id);
    return { mensaje: 'Puntuacion eliminada correctamente' };
  }
}
