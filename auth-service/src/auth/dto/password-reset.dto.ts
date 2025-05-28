export class PasswordResetRequestDto {
  email: string;
}

export class PasswordResetVerifyDto {
  email: string;
  code: string;
  newPassword: string;
}
