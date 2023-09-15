import { Usuario } from "src/usuario/usuario.entity";


export class ComentarioDTO {
    readonly id: number;
    readonly usuario : Usuario;
    readonly comentario : string;
    readonly id_pelicula : number;
}