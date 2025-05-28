import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function EitherActivityIdOrPathId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'eitherActivityIdOrPathId',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;
          if (obj.activityId && obj.pathId) {
            return false; // Ambos están presentes, no es válido
          }
          if (!obj.activityId && !obj.pathId) {
            return false; // Ninguno está presente, no es válido
          }
          return true; // Solo uno está presente, válido
        },
        defaultMessage(args: ValidationArguments) {
          return 'Un comentario debe tener exactamente una referencia: o activityId o pathId, pero no ambos ni ninguno';
        },
      },
    });
  };
}