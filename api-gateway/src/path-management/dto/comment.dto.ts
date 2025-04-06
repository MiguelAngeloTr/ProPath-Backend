import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
    @ApiProperty({
        description: 'Identificador único del comentario',
        example: 'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8'
    })
    id: string;

    @ApiProperty({
        description: 'Identificador del autor del comentario',
        example: '123456'
    })
    authorId: string;

    @ApiProperty({
        description: 'Nombre del autor del comentario',
        example: 'Juan Pérez'
    })
    authorName: string;

    @ApiProperty({
        description: 'Contenido del comentario',
        example: 'Este es un comentario sobre la actividad. Sugiero mejorar la definición de los objetivos.'
    })
    message: string;

    @ApiProperty({
        description: 'Fecha y hora en que se realizó el comentario',
        example: '2025-04-15T14:30:00.000Z'
    })
    date: Date;

    @ApiProperty({
        description: 'Identificador de la actividad a la que pertenece el comentario (opcional)',
        example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
        required: false
    })
    activityId?: string;

    @ApiProperty({
        description: 'Identificador del path al que pertenece el comentario (opcional)',
        example: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
        required: false
    })
    pathId?: string;
}