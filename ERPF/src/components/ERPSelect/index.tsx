import { FC } from "react";
import Select, {
  StylesConfig,
  GroupBase,
  Options,
  MultiValue,
  SingleValue,
} from "react-select";
import { Text, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import clsx from "clsx";
import { isNil } from "lodash-es";

export interface OptionI {
  label: string;
  value: string | number | any;
}

export type OnChangeI =
  | string
  | number
  | Array<string | number>
  | null;
export type SelectValueI = OptionI | OptionI[] | null | undefined;

interface ERPSelectProps {
  name?: string;
  options: OptionI[] | undefined;
  value?: SelectValueI;
  onChange: (value: OnChangeI) => void;
  onInputChange?: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  isMulti?: boolean;
  label?: string;
  title?: string;
  required?: boolean;
  selectStyle?: React.CSSProperties;
  mainStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  labelClass?: string;
  className?: string;
  menuPortalTarget?: HTMLElement | null;
  menuPlacement?: "auto" | "top" | "bottom";
  formatOptionLabel?: (option: OptionI) => React.ReactNode;
  isLoading?: boolean;
  isOptionSelected?: (
    option: OptionI,
    selectValue: Options<OptionI>
  ) => boolean;
  searchable?: boolean;
  hideSelectedOptions?: boolean;
  withActualValue?: boolean;
  withAsterisk?: boolean;
  error?: string | null;
}

const ERPSelect: FC<ERPSelectProps> = ({
  name = "erp-select",
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  clearable = false,
  isMulti = false,
  label,
  title,
  required = false,
  mainStyle = { width: "100%" },
  labelStyle = {},
  labelClass = "",
  className = "",
  menuPortalTarget,
  menuPlacement = "auto",
  formatOptionLabel,
  isLoading,
  isOptionSelected = () => false,
  searchable = false,
  hideSelectedOptions,
  onInputChange,
  error = null,
  withAsterisk = false,
  withActualValue = false,
  ...props
}) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const customStyles: StylesConfig<OptionI, boolean, GroupBase<OptionI>> = {
    control: (provided) => ({
      ...provided,
      height: "36px",
      minHeight: "36px",
      borderRadius: "4px",
    }),
    input: (provided) => ({
      ...provided,
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 999,
      background: isDark ? theme.colors.dark[6] : theme.white,
      borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[4],
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "calc(7 * 36px)",
      padding: 0,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? theme.colors[theme.primaryColor][6]
        : state.isFocused
        ? isDark
          ? theme.colors.dark[7]
          : theme.colors.gray[0]
        : isDark
        ? theme.colors.dark[6]
        : theme.white,
      color: isDark ? theme.white : theme.black,
      "&:active": {
        backgroundColor: theme.colors[theme.primaryColor][6],
        color: "white",
      },
      fontSize: theme.fontSizes.sm,
      fontWeight: state.isSelected ? 400 : 300,
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "4px",
    }),
    clearIndicator: (provided) => ({
      ...provided,
      padding: "4px",
      "&:hover": {
        color: theme.colors.red[6],
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "14px",
      color: isDark ? theme.colors.dark[3] : theme.colors.gray[5],
      fontWeight: "400",
    }),
    multiValue: (provided) => ({
      ...provided,
    }),
    multiValueLabel: (provided) => ({
      ...provided,
    }),
    singleValue: (provided) => ({
      ...provided,
    }),
  };

  return (
    <div
      className={`erp-select-wrapper ${className} ${
        !isNil(error) ? "has-error" : ""
      } ${disabled ? "cursor-na" : ""}`}
      style={mainStyle}
      title={title}
    >
      {label && (
        <label
          htmlFor={name}
          className={clsx(
            "mantine-Select-label text-sm font-medium",
            labelClass
          )}
          style={labelStyle}
        >
          {label}
          {(required || withAsterisk) && (
            <Text
              span
              c="var(--mantine-color-error)"
              ml={4}
              title="Field is required"
              className="!text-sm"
            >
              *
            </Text>
          )}
        </label>
      )}
      <Select
        name={name}
        isMulti={isMulti}
        options={options}
        value={value}
        onChange={(selected) => {
          if (isMulti) {
            const values =
              (selected as MultiValue<OptionI>)?.map((opt) => opt.value) ?? [];
            onChange(values);
          } else {
            const singleValue =
              (selected as SingleValue<OptionI>)?.value ?? null;
            onChange(singleValue);
          }
        }}
        placeholder={placeholder}
        isDisabled={disabled}
        isClearable={clearable}
        styles={customStyles}
        classNamePrefix="erp-rs"
        menuPortalTarget={menuPortalTarget}
        required={required}
        menuPlacement={menuPlacement}
        formatOptionLabel={formatOptionLabel}
        isLoading={isLoading}
        isOptionSelected={isOptionSelected}
        hideSelectedOptions={hideSelectedOptions}
        isSearchable={searchable}
        onInputChange={onInputChange}
        {...props}
      />
      {!isNil(error) && (
        <Text
          className="erp-select-error-text"
          c="var(--mantine-color-error)"
          size="sm"
          mt={4}
        >
          {error}
        </Text>
      )}
    </div>
  );
};

export default ERPSelect;
