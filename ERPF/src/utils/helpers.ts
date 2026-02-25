import {
  isEmpty,
  isObject,
  isPlainObject,
  map,
  mapValues,
  omitBy,
  pickBy,
} from "lodash-es";

type PlainObject = {
  [key: string]: string;
};

export const paramsToQueryString = (params: QueryParamsI): string => {
  if (!isPlainObject(params)) {
    return "";
  }

  const searchParams = new URLSearchParams();

  const processParams = (key: string, value: any) => {
    // Exclude null, undefined, and empty strings
    if (value === null || value === undefined || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        // Handle arrays of objects or nested arrays
        if (isPlainObject(item) || Array.isArray(item)) {
          Object.entries(item).forEach(([nestedKey, nestedValue]) => {
            processParams(`${key}[${index}][${nestedKey}]`, nestedValue);
          });
        } else {
          searchParams.append(`${key}[]`, String(item));
        }
      });
    } else if (isPlainObject(value)) {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        processParams(`${key}[${nestedKey}]`, nestedValue);
      });
    } else {
      searchParams.append(key, String(value));
    }
  };

  Object.entries(params).forEach(([key, value]) => {
    processParams(key, value);
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

/**
 * Concatenates key-value pairs from a given object into a string.
 * @param plainObject - The object containing key-value pairs to be concatenated.
 * @param startLimit - The starting index of the key-value pairs to be concatenated. Defaults to 0.
 * @param endLimit - The ending index of the key-value pairs to be concatenated. Defaults to -1.
 * @param seperator - The separator to be used to join the key-value pairs. Defaults to an empty string.
 * @returns The concatenated string of key-value pairs.
 */
export const concatKeyValue = (
  plainObject: PlainObject,
  startLimit: number = 0,
  endLimit: number = -1,
  seperator: string,
) => {
  const keyValues = Object.entries(plainObject)
    .slice(startLimit, endLimit)
    .map(([key, value]) => (value !== "" ? `[${key}: ${value}]` : ""));
  return keyValues.join(seperator);
};

/**
 * Converts a camel case string to a human-readable string.
 * @param string - The camel case string to be converted.
 * @returns The human-readable string.
 */
export const camelCaseToString = (string: string) => {
  if (!string) return null;
  return string
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

/**
 * Converts a snake case string to a human-readable string.
 * @param string - The snake case string to be converted.
 * @returns The human-readable string.
 */
export const snakeCaseToString = (string: string) => {
  if (!string) return null;
  return string.replace(/([A-Z])/g, "_$1").toLowerCase();
};

/**
 * Converts form values object into a string.
 * @param formValues - The form values object to be converted.
 * @param seperator - The separator to be used to join the key-value pairs. Defaults to a semicolon.
 * @returns The concatenated string of key-value pairs.
 */
export const formValuesToString = <T extends Record<string, any>>({
  formValues,
  separator = ";",
  excludeKeys = [],
}: {
  formValues: T;
  separator?: string;
  excludeKeys?: string[];
}): string => {
  if (isEmpty(formValues)) return "";
  const nonEmptyValues = pickBy(formValues, (value) => !isEmpty(value));
  const filteredValues = omitBy(nonEmptyValues, (_, key) =>
    excludeKeys.includes(key),
  );

  return map(filteredValues, (value, key) => {
    const formattedValue =
      isObject(value) && "value" in value ? value.value : value;
    return `${camelCaseToString(key)}: ${formattedValue}`;
  }).join(` ${separator} `);
};

export const formValuesToJson = ({
  formValues,
}: {
  formValues: Record<string, any>;
}) => {
  const data = pickBy(formValues, (value) => isEmpty(value) && value !== "");
  return JSON.stringify(data ?? "{}");
};

export const stringifyObjectValues = <T extends object>(
  obj: T,
): { [K in keyof T]: string } => {
  return mapValues(obj, (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "number") return String(value);
    return isObject(value) && "value" in (value as any)
      ? String((value as any).value)
      : String(value);
  }) as { [K in keyof T]: string };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
