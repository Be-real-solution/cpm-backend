import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator'

@ValidatorConstraint({ async: false })
class IsTimeStringConstraint implements ValidatorConstraintInterface {
	validate(time: any, args: ValidationArguments) {
		console.log(args)
		const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
		return typeof time === 'string' && timeRegex.test(time)
	}

	defaultMessage(args: ValidationArguments) {
		console.log(args)
		return 'Time must be in the format HH:mm'
	}
}

export function IsTimeString(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsTimeStringConstraint,
		})
	}
}
