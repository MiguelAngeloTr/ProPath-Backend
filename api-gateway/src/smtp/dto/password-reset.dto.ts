export class PasswordResetRequestDto {
  email: string;
}

export class PasswordResetVerifyDto {
  email: string;
  code: string;
  newPassword: string;
}

export class PasswordResetCodeDto {
  email: string;
  name: string;
  code: string;
  expiresIn: number; // Tiempo de expiración en minutos 
}
