# Frontend Development Guidelines

## Core Principles

- **Language**: TypeScript (strict mode enabled)
- **State Management**:
    - Server state → TanStack Query (`@tanstack/react-query`)
    - Client/UI state → Zustand stores
- **UI Library**: Mantine (with custom wrappers) + Tailwind CSS (for layout/utilities)
- **Data Tables**:
    - Complex tables → `<MainTable />` (TanStack Table v8 wrapper)
    - Simple tables → `<MantineTable />` (basic Mantine table)
- **API Layer**: Never call Axios directly in components — always use service functions + hooks

## Project Structure

```typescript
ERPF/
├── public/     # Static files
├── src/
│    ├── components/           # Shared UI components (Modal, Header, Table, ERPSelect, PageLoader, Sidebar etc.)
│    ├── constants/            # All Constants
│    ├── hooks/                # custom hooks
│    │   └── usePaginationDataFetch.tsx  # custom hook for paginated data fetching
│    ├── lib/
│    │   └── axiosInstance.ts  # axios instance
│    ├── mantineStyles/
│    │   └── focus.module.css
│    ├── pages/                # Route compositions
│    │   ├── Auth/             # Authentication feature
│    │   ├── Items/             # Items module feature
│    │   ├── ...
│    │   └── Users/            # Users module feature
│    ├── routers/              # Main and Auth router
│    ├── services/             # Business features
│    │   ├── authService.ts/             # API Endpoints of Auth
│    │   ├── userService.ts/             # API Endpoints of User
│    │   └── itemService.ts/             # API Endpoints of Item
│    ├── stores/               # Zustand Store files
│    ├── types/               # types folder
│    ├── utils/               # utility function folder
│    │   ├── validators.ts/             # form input validator functions
│    │   ├── sendNotification.ts/             # Api response toast notifications
│    │   ├── currencyAndCountries.ts/             # Currency and Countries connection function
│    │   ├── ...             # Others
│    │   └── formatNumbers.ts/             # Number formate function
│    ├── App.tsx
│    ├── index.css
│    ├── theme.tsx
│    └── main.tsx              # Entry point
├── .env
├── .env.example
├── package.json
├── tsconfig.json
│  ...
└── vite.config.ts
```

## Component Guidelines

### Folder Structure

- `src/pages/`: UI Views. Grouped by Module (e.g., `HR/Attendance`, `Purchase/PurchaseOrders`).
- `src/services/`: API integration.
    - Export functions wrapping `erpApi` (Axios instance).
    - Example: `fetchAttendance`, `applyLeave`.
- `src/types/`: TypeScript interfaces corresponding to Backend Models.
- `src/hooks/`: Custom hooks (e.g., `usePaginationDataFetch.tsx` for standardized API lists).
- `src/utils/`: Helpers for Formatting (`formatNumbers.ts`), Validation (`validators.ts`), and Notifications (`sendNotification.ts`).
- `src/routers/MainRouter.tsx`: Application Route definitions.
- `src/constants/routes.ts`: centralized Route strings.

### File Location

- Module: `ERPB/src/components/[Module]/[ComponentName/index].tsx`

### Component Template

```typescript
import { FC } from 'react';
import { Divider } from "@mantine/core";
import ItemHeader from "../common/ItemHeader";

interface ComponentNameProps {
  // Define props
}

export const ComponentName: FC<ComponentNameProps> = ({ }) => {
  return (
    <div className="w-full h-full pb-24">
      <ItemHeader title="Settings" placeholder="Search Item..." withSearch />  // Use header for main(index.tsx) pages
      <Divider />
      {
        //... content
      }
    </div>
  );
};
```

### Reusable Components

#### **`<MainTable />`**

Located at: `src/components/Table/index.tsx`
This is the standard component for all data grids. It wraps **TanStack Table**.

**Implementation Steps:**

Take reference from src\pages\Users\components\UserTable\UserTable.tsx

1.  **Define Columns Hook**: Create `use[Feature]Columns.tsx` returning `ColumnDef[]`.
    - Define `INITIAL_VISIBILITY`.
    - Use `accessorKey` for data fields except `action` column.
    - Use `cell` renderer for custom UI (Badges, Actions).
    - Note for actions column do not define `header` but `id` only to "action" , i.e ` id: "action"`.
    - Use `modals.openConfirmModal` for confirmation like delete operation.
2.  **Fetch Data**:
    - Use `usePaginationDataFetch` for paginated list endpoints.
    - Use `useQuery` for non-paginated or detail endpoints.
3.  **Initialize Table**: Use `useReactTable` hook.
    - Pass `data`, `columns`, `state` (sorting, pagination, visibility, etc).
    - Pass `getCoreRowModel`, `getSortedRowModel`, `getPaginationRowModel` etc.
4.  **Render**:

    ```tsx

    import { TABLES } from "@constants/tables";

    const table = useReactTable<T>({
    tableId: TABLES.USERS,
    data: usersData,
    columns,
    state: {
      sorting,
      columnOrder,
      pagination,
    },
    initialState: {
      columnPinning: {
       left: [],
       right: ["action"],
      },
    },
    columnResizeMode: "onChange",
    onColumnOrderChange: setColumnOrder,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true, // use this instead of onPaginationChange
    } as CustomTableOptions<T>)

    <MainTable
    	id={TABLES.USERS}
    	table={table} // The instance from useReactTable
      columnOrder={columnOrder}
      setColumnOrder={setColumnOrder}
      columnIdsToSort={sortableHeader}
      excludeColumnFromSwap={['FIRST_COLUMN_NAME', 'action']}
      isLoading={isFetching}
      isError={isError}
      error={error as Error}
      setPagination={setPagination}
      withFooter
      showTableOptions
      showColumnVisibilityButton
      showPinningButton
      persistColumnPinning
      persistColumnSorting
    />
    ```

#### **Modals & State Management (Zustand)**

For managing Modals (Edit/View), we use a **Zustand Store** pattern instead of passing props deep down.

**Pattern:**

1.  **Create Store**: `src/stores/[feature]Store.ts`
    ```ts
    interface FeatureStoreI {
    	detail: FeatureI | null;
    	modalAction: 'ADD' | 'EDIT' | 'VIEW' | null;
    	setDetail: (data: FeatureI) => void;
    	setModalAction: (action: string | null) => void;
    }
    // ... create(devtools(...))
    ```
2.  **Trigger Modal**: In `use[Feature]Columns.tsx` (Action Column):
    ```tsx
    onClick={() => {
       setModalAction('EDIT');
       setDetail(row.original);
    }}
    ```
3.  **Modal Component**: Subscribes to the store.
    - Read `detail` to pre-fill the Form (if EDIT/VIEW).
    - Read `modalAction` to set Title ("Edit Item" vs "Add Item").
    - On Close: Reset store (`setDetail(INITIAL)`, `setModalAction(null)`).

#### **Common UI Components**

- **`ERPSelect`**: Custom styled select component (`src/components/ERPSelect/index.tsx`). Use this instead of Mantine native `Select`.
- **`ModalTriggerButton`**: Wraps a button that opens a modal (`src/components/button/ModalTriggerButton.tsx`).

## API Client Pattern

- Use service functions from `src/services/` only.
- Use `usePaginationDataFetch` for paginated list endpoints.
- Use `useQuery` for non-paginated or detail endpoints.
- Use and create(if not exist) queryKeys from global constants `src/constants/queryKeys`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebouncedValue } from '@mantine/hooks';
import { usePaginationDataFetch } from '@hooks/usePaginationDataFetch';
import { deleteItemStore, fetchAllItemStore } from '@services/itemService';
import { QUERY_KEY } from '@constants/queryKeys';
import { apiErrNotification, successNotification } from '@utils/sendNotification';

const [debouncedSearch] = useDebouncedValue(searchUser, 400);
const queryClient = useQueryClient();

const {
	data: users,
	isFetching,
	isError,
	error,
} = usePaginationDataFetch({
	queryKey: [QUERY_KEY.GET_ALL_ITEM_STORE], // create queryKey if not exist
	queryFn: fetchAllItemStore,
	search: debouncedSearch,
});

const useDeleteItemStore = useMutation<ErpResponse<null>, AxiosError, string>({
	mutationFn: (id) => deleteItemStore(id),
	onSuccess: (res) => {
		queryClient.invalidateQueries({
			queryKey: [QUERY_KEY.GET_ALL_ITEM_STORE],
		});
		successNotification(res.message);
	},
	onError: (err) => {
		apiErrNotification(err);
	},
});
//  ...further logic
```

```typescript
import { AxiosResponse } from 'axios';

import { ENDPOINT } from '@constants/endpoints';
import erpApi from '@lib/axiosInstance';
import { paramsToQueryString } from '@utils/helpers';

export const fetchAllItemStore = async (params: QueryParamsI): Promise<PaginationResponse<ItemStoreI[]>> => {
	const url = `${ENDPOINT.ITEM_STORE}` + paramsToQueryString(params);
	const res: AxiosResponse = await erpApi.get(url);
	return res?.data as PaginationResponse<ItemStoreI[]>;
};

export const deleteItemStore = async (id: string): Promise<ErpResponse<null>> => {
	const url = `${ENDPOINT.ITEM_STORE}/${id}`;
	const res: ErpResponse<null> = await erpApi.delete(url);
	return res;
};
```

```typescript
import { QueryKey, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

type UseGenericQueryProps<Args, Data> = QueryParamsI & {
	queryKey: QueryKey;
	queryFn: (args: Args) => Promise<PaginationResponse<Data>>;
	select?: (data: PaginationResponse<Data>) => any;
	enabled?: boolean;
	gcTime?: number | undefined;
};

export const usePaginationDataFetch = <
	Args extends QueryParamsI,
	Data = unknown,
	TransformedData = PaginationResponse<Data>,
>({
	queryKey,
	queryFn,
	enabled = true,
	select,
	search = '',
	limit,
	page,
	sortBy,
	order,
	filter,
}: UseGenericQueryProps<Args, Data> & {
	select?: (data: PaginationResponse<Data>) => TransformedData;
}) => {
	return useQuery<PaginationResponse<Data>, AxiosError, TransformedData>({
		queryKey: [...queryKey, search, limit, page, sortBy, order, ...Object.values(filter || {})],
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
		placeholderData: {
			data: [],
			totalCount: 0,
			count: 0,
			currentPage: 1,
			totalPages: 1,
		},
		select,
	});
};
```

### File Location

`ERPF/src/services/[moduleName]Service.ts`

### Template

```typescript
import { AxiosResponse } from 'axios';

import { ENDPOINT } from '@constants/endpoints';
import erpApi from '@lib/axiosInstance';
import { paramsToQueryString } from '@utils/helpers';

export const fetchUserById = async (id: QueryParamsI): Promise<UserI> => {
	const res: AxiosResponse = await erpApi.get(`/users/${id}`);
	const user = res?.data;
	return user as UserI;
};

export const fetchAllUser = async (params: QueryParamsI): Promise<PaginationResponse<UserI[]>> => {
	const url = `${ENDPOINT.USERS.BASE}` + paramsToQueryString(params);
	const res: AxiosResponse = await erpApi.get(url);
	const users = res?.data;
	return users as PaginationResponse<UserI[]>;
};
// ... other methods
```

### Rules

✅ Always use service functions from src/services/
✅ Always wrap with React Query hooks
❌ Never use fetch or axios directly in components

## Mantine Usage

- Use Mantine components consistently
- Follow theme configuration
- Common components: Button, TextInput, Select, Modal, Table

## TypeScript Conventions

- Define interfaces in same file or `types/` folder
- Use explicit return types for functions
- Avoid `any` - use `unknown` if needed
- Type naming convention for interface like UserI, for type RoleT

## DevelopmentRules:

- Paginated list API calls use `usePaginationDataFetch`.
- Detail or non-paginated API calls use `useQuery`.
- No direct fetch/axios inside components
- Tables use <MainTable> re-usable component build over tanstack-react-table
- Some tables also ue reusable <MantineTable/> for normal table use.
- UI components use Mantine
- Functional components only
- Hooks start with use\*
- TypeScript strict mode
- Define **Interface** in `src/types/`.
- Add **Service** functions in `src/services/`.
- Add **Constants** in `src/constants/routes.ts`.
- Create **Page Component** using `MainTable` (if list) or Mantine Forms (if input).
- Register Route in `MainRouter.tsx` and Sidebar.
