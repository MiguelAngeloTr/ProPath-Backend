import { ApiProperty } from '@nestjs/swagger';

export class GroupResponseDto {
  @ApiProperty({ example: 'GRP001' })
  id: string;

  @ApiProperty({ example: 'FrontEnd' })
  name: string;

  @ApiProperty({ example: 'jajajajaja no es BackEnd' })
  description: string;
}
