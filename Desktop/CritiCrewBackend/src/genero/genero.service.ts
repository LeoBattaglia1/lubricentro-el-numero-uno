import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository, Entity } from 'typeorm';
import { Genero } from './genero.entity';

@Injectable()
export class GeneroService {
  constructor(
    @InjectRepository(Genero)
    private readonly generoRepository: Repository<Genero>,
  ) {}

  async crearGenero(genero: string, idGenero: number): Promise<Genero> {
    const nuevoGenero = new Genero(genero, idGenero);
    return await this.generoRepository.save(nuevoGenero);
  }


  async obtenerGeneros(): Promise<Genero[]> {
    return await this.generoRepository.find();
  }

  async obtenerGeneroPorId(id: number): Promise<Genero> {
    const genero = await this.generoRepository.findOneBy[(id)];
    if (!genero) {
      throw new NotFoundException(`Genero con ID ${id} no encontrado`);
    }
    return genero;
  }

  async actualizarGenero(id: number, genero: string): Promise<Genero> {
    const generoEntity = await this.generoRepository.findOneBy[(id)];
    if (!generoEntity) {
      throw new NotFoundException(`Genero con ID ${id} no encontrado`);
    }
    generoEntity.genero = genero;
    return await this.generoRepository.save(generoEntity);
  }

  async eliminarGenero(id: number): Promise<string> {
    const genero = await this.generoRepository.findOneBy[(id)];
    if (!genero) {
      throw new NotFoundException(`Genero con ID ${id} no encontrado`);
    }
    await this.generoRepository.remove(genero);
    return 'Genero eliminado correctamente';
  }


  async getGenerosById (ids: Array<Number>){
    return await this.generoRepository.findBy({ id: In(ids) });;
  }


}

