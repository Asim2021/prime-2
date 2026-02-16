type ActionButtonT = "button" | "icon" | "text"

interface AddModalActionButtonI {
  type?: ActionButtonT;
  title: string;
  onClick?: () => void;
  children: React.ReactNode;
  withShadow?: boolean;
  buttonStyle? : React.CSSProperties;
  buttonClassName? : string;
  itemName?: string;
}

interface QueryParamsI {
  id?: string | undefined;
  search?: string;
  limit?: number | string;
  page?: number | string;
  sortBy?: string;
  order?: "ASC" | "DESC";
  filter?: Record<string, any>;
};
