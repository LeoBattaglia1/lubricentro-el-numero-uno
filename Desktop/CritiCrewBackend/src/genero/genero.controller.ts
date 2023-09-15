import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { GeneroService } from './genero.service';
import { GeneroDTO } from './genero.dto'; 

@Controller('generos')
export class GeneroController {
  constructor(private readonly generoService: GeneroService) {}

  @Post()
  async crearGenero(@Body() generoDTO: GeneroDTO) {
    const { genero, idGenero } = generoDTO; 
    const nuevaGenero = await this.generoService.crearGenero(genero, idGenero);
    return nuevaGenero;
  }

  @Get()
  async obtenerGeneros() {
    const generos = await this.generoService.obtenerGeneros();
    return generos;
  }

  @Get(':id')
  async obtenerGeneroPorId(@Param('id') id: number) {
    const genero = await this.generoService.obtenerGeneroPorId(id);
    return genero;
  }

  @Put(':id')
  async actualizarGenero(@Param('id') id: number, @Body() body: { genero: string }) {
    const { genero } = body;
    const generoActualizado = await this.generoService.actualizarGenero(id, genero);
    return generoActualizado;
  }

  @Delete(':id')
  async eliminarGenero(@Param('id') id: number) {
    const mensaje = await this.generoService.eliminarGenero(id);
    return { mensaje };
  }
}

