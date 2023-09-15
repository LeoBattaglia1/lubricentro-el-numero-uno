import { Usuario } from "src/usuario/usuario.entity";


export class PuntuacionDTO {
    readonly id: number;
    readonly usuario : Usuario;
    readonly puntuacion : number;
    readonly id_pelicula : number;
}