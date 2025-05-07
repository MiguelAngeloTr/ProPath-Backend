import { ApiProperty } from '@nestjs/swagger';
import { GroupResponseDto } from './group-response.dto';

export class UserGroupResponseDto {
  @ApiProperty({ example: '92438071-2850-4685-9d60-9b422f73a727' })
  id: string;

  @ApiProperty({ type: GroupResponseDto, example: {
    id: 'GRP001',
    name: 'FrontEnd',
    description: 'jajajajaja no es BackEnd',
  } })
  group: GroupResponseDto;

  @ApiProperty({ example: 'P' })
  role: string;
}

export class UserResponseDto {
  @ApiProperty({ example: '680532aa-6a71-432e-a2ba-5a98c40a9dc8' })
  id: string;

  @ApiProperty({ example: '134122', nullable: true })
  documentId: string | null;

  @ApiProperty({ example: 'CC' })
  idType: string;

  @ApiProperty({ example: 'simon' })
  name: string;

  @ApiProperty({ example: 'simon.colonia@uao.edu.co' })
  email: string;

  @ApiProperty({ example: 'A', description: 'P = Profesional, A = Administrador' })
  role: string;

  @ApiProperty({ example: 'Colombia' })
  country: string;

  @ApiProperty({ example: 'Cali' })
  city: string;

  @ApiProperty({ example: '2025-04-04' })
  birthDate: string;

  @ApiProperty({ example: null, required: false, nullable: true })
  profilePictureUrl?: string | null;

  @ApiProperty({
    type: [UserGroupResponseDto],
    required: true,
    example: [
      {
        id: '92438071-2850-4685-9d60-9b422f73a727',
        group: {
          id: 'GRP001',
          name: 'FrontEnd',
          description: 'jajajajaja no es BackEnd',
        },
        role: 'P',
      }
    ],
  })
  userGroups: UserGroupResponseDto[];
}
