//###############################################//
//---------------------------------------------//
//---------- VALIDATORS FOR FORMS -----------//
//-----------------------------------------//
//#######################################//

import { isNotEmpty, isEmail, matches } from "@mantine/form"; // Import required validators

type Value = string | number | null;

type Validator = (value: Value) => string | null ;

export const composeValidators =
  (validators: Validator[]) => (value: Value) => {
    for (const validator of validators) {
      const result = validator(value);
      if (result) {
        return result; // Return the first error found
      }
    }
    return null; // Return null if no errors
  };


export const isRequired = (
  value: Value,
  fieldName: string = "This field"
): string | null => (value ? null : `${fieldName} is required`);

export const isNumber = (value: Value) =>
  value && Number.isNaN(Number(value)) ? "Must be a number!" : null;

export const maxLength = (max: number) => (value: string) =>
  value && value.length > max ? `Must be ${max} characters or fewer!` : null;

export const minLength = (min: number) => (value: Value) =>
  String(value).trim().split("").length < min
    ? `Must be at least ${min} characters!`
    : null;

export const minValue = (min: number) => (value: number) =>
  value && value < min ? `Must be at least ${min}!` : null;

export const maxValue = (max: number) => (value: number) =>
  value && value > max ? `Must be at most ${max}!` : null;

export const maxDecimals = (max: number) => (value: string) => {
  const float = Number.parseFloat(value);
  if (Number.isNaN(float) || Math.floor(float.valueOf()) === float.valueOf())
    return undefined;
  return float.toString().split(".")[1].length <= max
    ? undefined
    : `Must be upto ${max} or fewer decimal places!`;
};

export const validateEmail = composeValidators([
  isNotEmpty("Field is required") as Validator,
  isEmail("Email is not valid") as Validator,
]);

export const validatePassword = composeValidators([
  isNotEmpty("Field is required") as Validator,
  matches(/(?=.*?[A-Z])/, "At least one upper case") as Validator,
  matches(/(?=.*?[a-z])/, "At least one lower case")as Validator,
  matches(/(?=.*?[#?!@$%^&*-])/, "At least one special character")as Validator,
  matches(/(?=.*?[0-9])/, "At least one digit")as Validator,
  matches(/(.{8,})/, "Min 8 in length")as Validator,
]);

export const validateConfirmPassword = (
  value: string | undefined,
  values: UserI
) => (value !== values.password ? "Passwords did not match" : "");
