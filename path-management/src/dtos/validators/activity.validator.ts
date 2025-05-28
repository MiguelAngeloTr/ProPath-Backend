import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsDateAfter(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateAfter',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value instanceof Date && 
                 relatedValue instanceof Date && 
                 value >= relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${propertyName} debe ser posterior o igual a ${relatedPropertyName}`;
        },
      },
    });
  };
}