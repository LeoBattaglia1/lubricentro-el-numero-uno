import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';

@Entity('comentarios')
export class Comentario {
  @PrimaryGeneratedColumn()
  private id: number;

  @ManyToOne(() => Usuario, usuario => usuario.comentarios)
  public usuario: Usuario;

  @Column()
  private comentario: string;

  @Column({ nullable: true })
  private id_pelicula: number;

  constructor(usuario: Usuario, comentario: string, id_pelicula?: number) {
    this.usuario = usuario;
    this.comentario = comentario;
    this.id_pelicula = id_pelicula;
  }

  public getId(): number {
    return this.id;
  }

  public getUsuario(): Usuario {
    return this.usuario;
  }

  public getComentario(): string {
    return this.comentario;
  }

  public getIdPelicula(): number | undefined {
    return this.id_pelicula;
  }

  public setUsuario(usuario: Usuario): void {
    this.usuario = usuario;
  }

  public setComentario(comentario: string): void {
    this.comentario = comentario;
  }

  public setIdPelicula(id_pelicula: number): void {
    this.id_pelicula = id_pelicula;
  }
}
