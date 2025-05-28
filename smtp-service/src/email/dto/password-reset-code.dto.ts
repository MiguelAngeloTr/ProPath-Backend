export class PasswordResetCodeDto {
  email: string;
  name: string;
  code: string;
  expiresIn: number; // Tiempo de expiración en minutos
}
