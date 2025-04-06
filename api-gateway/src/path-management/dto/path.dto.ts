import { ApiProperty } from '@nestjs/swagger';

export class ActivitieDto{
    @ApiProperty({
        description: 'Identificador único de la actividad',
        example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6'
    })
    id: string;

    @ApiProperty({
        description: 'Nombre de la actividad',
        example: 'Curso de React.js'
    })
    name: string;

    @ApiProperty({
        description: 'Descripción detallada de la actividad',
        example: 'Desarrollar el curso de React.js desde cero, cubriendo todos los aspectos fundamentales y avanzados.'
    })
    description: string;

    @ApiProperty({
        description: 'Cantidad de horas estimadas para completar la actividad',
        example: 8,
        minimum: 0,
        maximum: 32
    })
    hours: number;

    @ApiProperty({
        description: 'Fecha de inicio de la actividad',
        example: '2025-04-15T09:00:00.000Z'
    })
    initialDate: Date;

    @ApiProperty({
        description: 'Fecha de finalización de la actividad',
        example: '2025-04-20T18:00:00.000Z'
    })
    finalDate: Date;

    @ApiProperty({
        description: 'Presupuesto asignado a la actividad en la moneda correspondiente (COP)',
        example: 500.00,
        minimum: 0
    })
    budget: number;

    @ApiProperty({
        description: 'Estado actual de la actividad: E (En curso), P (Pendiente) o C (Completado)',
        example: 'P',
        enum: ['E', 'P', 'C']
    })
    state: string;

    @ApiProperty({
        description: 'Identificador del path al que pertenece esta actividad',
        example: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7'
    })
    pathId: string;
}

export class PathDto {
    @ApiProperty({
        description: 'Identificador único del path',
        example: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
        required: false
    })
    id?: string;

    @ApiProperty({
        description: 'Nombre del path',
        example: 'Desarrollo Full Stack con React y Node.js',
        required: true
    })
    name: string;

    @ApiProperty({
        description: 'Descripción detallada del path de aprendizaje',
        example: 'Ruta de aprendizaje completa para aprender desarrollo web desde cero con React en el frontend y Node.js en el backend',
        required: true
    })
    description: string;

    @ApiProperty({
        description: 'Lista de actividades que conforman el path',
        type: [ActivitieDto],
        required: false
    })
    activities?: ActivitieDto[];

    @ApiProperty({
        description: 'Identificador del usuario propietario del path',
        example: '123456',
        required: true
    })
    userId: string;

    @ApiProperty({
        description: 'Identificador del coach/mentor asignado al path (opcional)',
        example: '789012',
        required: false
    })
    coachId?: string;
}