export class CreateLogDto {
  accion: string;
  modulo?: string;
  tablaAfectada?: string | null;
  registroId?: number | null;
  descripcion?: string | null;
  usuarioId?: number | null;
  usuarioEmail?: string | null;
  ip?: string | null;
  userAgent?: string | null;
}
