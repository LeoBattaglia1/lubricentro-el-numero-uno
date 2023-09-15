import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Comentario } from '../comentario/comentario.entity';
import { Genero } from '../genero/genero.entity';
import { Puntuacion } from '../puntuacion/puntuacion.entity'; 

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column()
  private nombre: string;

  @Column()
  private correo: string;

  @Column()
  private contraseña: string;

  @OneToMany(() => Comentario, comentario => comentario.usuario)
  comentarios: Comentario[];

  @OneToMany(() => Puntuacion, puntuacion => puntuacion.usuario) 
  puntuaciones: Puntuacion[]; 

  @ManyToMany(() => Genero)
  @JoinTable()
  generos: Genero[];

  constructor(nombre: string, correo: string, contraseña: string) {
    this.nombre = nombre;
    this.correo = correo;
    this.contraseña = contraseña;
  }

  
  public getNombre(): string {
    return this.nombre;
  }

  public getCorreo(): string {
    return this.correo;
  }

  public getContraseña(): string {
    return this.contraseña;
  }

  
  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  public setCorreo(correo: string): void {
    this.correo = correo;
  }

  public setContraseña(contraseña: string): void {
    this.contraseña = contraseña;
  }
}
