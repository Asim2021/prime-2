import { QueryKey, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

type UseGenericQueryProps<Args, Data> = QueryParamsI & {
  queryKey: QueryKey;
  queryFn: (
    args: Args,
  ) => Promise<PaginationResponseI<Data>>;
  select?: (data: PaginationResponseI<Data>) => any;
  enabled?: boolean;
  gcTime?: number | undefined;
  placeholderData?: PaginationResponseI<Data>;
};

export const usePaginationDataFetch = <
  Args extends QueryParamsI,
  Data = unknown,
  TransformedData = PaginationResponseI<Data>,
>({
  queryKey,
  queryFn,
  enabled = true,
  select,
  search = "",
  limit,
  page,
  sortBy,
  order,
  filter,
  placeholderData,
}: UseGenericQueryProps<Args, Data> & {
  select?: (
    data: PaginationResponseI<Data>,
  ) => TransformedData;
}) => {
  return useQuery<
    PaginationResponseI<Data>,
    AxiosError,
    TransformedData
  >({
    queryKey: [
      ...queryKey,
      search,
      limit,
      page,
      sortBy,
      order,
      ...Object.values(filter || {}),
    ],
    queryFn: () =>
      queryFn({
        search,
        limit: limit ? String(limit) : undefined,
        page: page ? String(page) : undefined,
        sortBy: sortBy ? sortBy : undefined,
        order: order ? order : undefined,
        filter: filter ? filter : undefined,
      } as Args),
    enabled,
    placeholderData: placeholderData || {
      data: [],
      totalCount: 0,
      count: 0,
      currentPage: 1,
      totalPages: 1,
    },
    select,
  });
};
