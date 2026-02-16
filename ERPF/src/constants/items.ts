import { OnChangeI, SelectValueI } from "@components/ERPSelect";
import { ComboboxItem } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { isEqual } from "lodash-es";


export const INITIAL_ALL_TABLE_PINNING = {
  left: [],
  right: ["action"],
};


export const INITIAL_SEARCH_STATE = {
  itemGroup: "",
  make: "",
  itemUnitType: "",
  currencyType: "",
  exciseDuty: "",
  discountGroup: "",
  storeLocation: "",
};

export type SectionI = UseFormReturnType<any>;

export const gridBreakpoint = {
  xs: "480px",
  sm: "577px",
  md: "769px",
  lg: "993px",
  xl: "1200px",
};

export const gridSpan = { xs: 5, sm: 4, md: 3, lg: 2 };

export const getSelectValue = (
  array: ComboboxItem[] | undefined,
  value: OnChangeI
): SelectValueI => array?.find((option) => option.value === value);

type FormLike = {
  values: Record<string, any>;
  errors: Record<string, any>;
};

export const areFormEqual = <T extends { form: FormLike }>(
  relevantFormValues: string[],
  extraKeys?: (keyof T)[]
) => {
  return (prev: T, next: T) => {
    // 1. Compare Form Values (fastest check first)
    for (const key of relevantFormValues) {
      if (prev.form.values[key] !== next.form.values[key]) {
        return false;
      }
    }

    // 2. Compare Form Errors
    for (const key of relevantFormValues) {
      if (prev.form.errors[key] !== next.form.errors[key]) {
        return false;
      }
    }

    // 3. Compare Extra Keys (if any)
    if (extraKeys && extraKeys.length > 0) {
      for (const key of extraKeys) {
        if (!isEqual(prev[key], next[key])) {
          return false;
        }
      }
    }

    return true;
  };
};
