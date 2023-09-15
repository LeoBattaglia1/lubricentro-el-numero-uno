import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';

@Entity('generos')
export class Genero {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column()
  private genero: string;

  @Column()
  private idGenero: number;

  @ManyToMany(() => Usuario)
  @JoinTable()
  private usuarios: Usuario[];

  constructor(genero: string, idGenero: number) {
    this.genero = genero;
    this.idGenero = idGenero;
  }

  public getId(): number {
    return this.id;
  }

  public getGenero(): string {
    return this.genero;
  }

  public getIdGenero(): number {
    return this.idGenero;
  }

  public getUsuarios(): Usuario[] {
    return this.usuarios;
  }

  public setUsuarios(usuarios: Usuario[]): void {
    this.usuarios = usuarios;
  }

  public setGenero(genero: string): void {
    this.genero = genero;
  }

  public setIdGenero(idGenero: number): void {
    this.idGenero = idGenero;
  }
}