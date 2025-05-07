import { ApiProperty } from '@nestjs/swagger';

export class GroupUserResponseDto {
  @ApiProperty({ example: '31065dc6-1f8c-4f35-a188-ca65b54965c6' })
  id: string;

  @ApiProperty({
    example: {
      id: '680532aa-6a71-432e-a2ba-5a98c40a9dc8',
      documentId: '134122',
      idType: 'CC',
      name: 'simon',
      email: 'simon.colonia@uao.edu.co',
      role: 'A',
      country: 'Colombia',
      city: 'Cali',
      birthDate: '2025-04-04',
      profilePictureUrl: null
    }
  })
  user: {
    id: string;
    documentId: string | null;
    idType: string;
    name: string;
    email: string;
    role: string;
    country: string;
    city: string;
    birthDate: string;
    profilePictureUrl: string | null;
  };

  @ApiProperty({ example: 'P' })
  role: string;
}

export class GroupListResponseDto {
  @ApiProperty({ example: 'd8294b78-dbe0-413a-917e-760bcb410066' })
  id: string;

  @ApiProperty({ example: 'BackEnd' })
  name: string;

  @ApiProperty({ example: 'BackEnd' })
  description: string;

  @ApiProperty({
    type: [GroupUserResponseDto],
    required: true,
    example: [
      {
        id: '31065dc6-1f8c-4f35-a188-ca65b54965c6',
        user: {
          id: '680532aa-6a71-432e-a2ba-5a98c40a9dc8',
          documentId: '134122',
          idType: 'CC',
          name: 'simon',
          email: 'simon.colonia@uao.edu.co',
          role: 'A',
          country: 'Colombia',
          city: 'Cali',
          birthDate: '2025-04-04',
          profilePictureUrl: null
        },
        role: 'P'
      }
    ]
  })
  userGroups: GroupUserResponseDto[];
}
