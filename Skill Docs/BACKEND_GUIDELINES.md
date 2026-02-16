# Backend Development Guidelines

## Core Principles

- **Language**: Plain JavaScript (no TypeScript)
- **Module System**: ESM (`"type": "module"` in `package.json`)
- **Pattern**: Feature-based modular architecture
- **Business Logic**: Lives in service file i.e., *.service.js
- **Validation**: Joi schemas applied via middleware
- **Error Handling**: Centralized via `error.middleware.js`
- **Responses**: Always use standardized helpers

## Project Structure (ERPB/)

```javascript
ERPB/
├── scripts/
│    └── createFeature.js     # to create a fetures folder structure using `npm run feature:create` command
├── src/
│   ├── common/
│   │   └── joiSchema.js      # Common Joi Schema
│   ├── constant/
│   │   ├── httpStatus.js     # export HTTP_STATUS object eg { OK:200 , CREATED:201, ...}
│   │   ├── endpoints.js         # export ENDPOINTS object eg { BASE:'/ , ID:'/:id', ...}
│   │   ├── ...
│   │   └── string.js
│   ├── db/
│   │   ├── migrations/      # Sequelize Migrations
│   │   └── seeders/           # Sequelize Seeds
│   ├── config/
│   │   ├── database.js       # Database configuration
│   │   ├── env.js            # Environment variables
│   │   └── logger.js         # Logging configuration
│   ├── features/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.router.js
│   │   │   └── auth.schema.js     # Joi Schema
│   │   ├── hr/               # Grouped Feature (Multiple controllers/routers)
│   │   │   ├── attendance.controller.js
│   │   │   ├── attendance.service.js
│   │   │   ├── leave.controller.js
│   │   │   ├── leave.service.js
│   │   │   ├── xxxx.router.js
│   │   │   └── ...
│   │   ├── user/
│   │   │   ├── user.controller.js
│   │   │   ├── user.service.js
│   │   │   ├── user.router.js
│   │   │   └── user.schema.js     # Joi Schema
│   │   ├── ...
│   │   │── v1.js  # Export all features routers with V1 router (api/v1)
│   │   └── index.js # Export main root router
│   ├── lib/      # helpers
│   │   ├── config.js        # .env export config
│   │   ├── mail.js    # nodemailer setup
│   │   ├── rateLimit.js      # API rate limiter
│   │   └── sqlConfig.js       # MySql Config with Sequelize
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── validation.middleware.js
│   │   └── logger.middleware.js
│   ├── models/        # Sequelize Model definitions
│   │   ├── users/
│   │   │   └── user.model.js
│   │   ├── roles/
│   │   │   └── role.model.js
│   │   └── index.js     # Sequelize model with associations defined
│   ├── utils/
│   │   ├── logger.js
│   │   ├── ...
│   │   ├── joiValidator.js  # Joi Schema Validator Func
│   │   └── helpers.js
│   ├── views/     # hbs email templates
│   ├── app.js     # Express App initiation
│   └── server.js  # HTTP server initiation
├── .env
├── .env.example
├── package.json
│  ...
└── jsconfig.json   # for editor path aliases
```

## Feature Creation Workflow

1. Run:
    ```bash
    npm run feature:create  [featureName]
    ```
2. Script auto-generates:
    - src/features/[featureName]/ with controller, router, schema
    - src/models/[featureName]/[featureName].model.js
    - Optional migration file (if flag[just pass true as 2nd arg] provided)

### Rules

- Routes hanle HTTP and validate input(via Joi) and call controller services
- Never write business logic in routes or models — only in controllers.
- Models define Sequelize schemas only.

## API Conventions

### Base Path

- All endpoints: /api/v1/...

### Pagination Defaults

- Default `page`: 1
- Default `limit`: 20
- Max `limit`: 100
- Default `sortBy`: `createdAt` (unless feature defines otherwise)
- Default `order`: `DESC`
- For paginated list endpoints, use `getPaginationParams` from `@utils/helpers`.

```javascript
import { getPaginationParams } from '../../utils/helpers.js';

const { page, limit, offset, sortBy, order } = getPaginationParams({
  page: req?.query?.page,
  limit: req?.query?.limit,
  sortBy: req?.query?.sortBy,
  order: req?.query?.order,
  defaultLimit: 20,
  maxLimit: 100,
  defaultSortBy: 'createdAt',
  defaultOrder: 'DESC',
});
```

### Response Format

- Success:

```json
{ "success": true, "data": ..., "message": "...", "severity": "success" }
```

- Error:

```json
{ "success": false, "data": ..., "message": "...", "severity": "error" }
```

### Response Helpers

- Always use:

```javascript
import { sendSuccessResponse, sendErrorResponse } from '../../middleware/sendResponse.js';
```

## Authentication Flow

- Access Token: `Authorization: Bearer <token>` header
- Refresh Token: HTTP-only cookie
- Middleware: `auth.middleware.js` verifies tokens and attaches `req.user`
- Role Check: Middleware enforces `allowedRoles` array
- User Payload: Password excluded; role details joined via Sequelize
- Auth rate limiting: Use `authLimiter` (15 requests / 15 minutes) for login, refresh, OTP, and 2FA verify endpoints.
- Auth error policy: Do not reveal user existence; use generic invalid-credentials responses and generic forget-password success message.

## Model Guidelines

### File Location

- `src/models/[feature]/[feature].model.js`

### Template

```javascript
import { TABLES } from '../../constant/strings.js';

const Role = (sequelize, DataTypes) => {
	return sequelize.define(TABLES.ROLES, {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		code: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
	});
};

export default Role;
```

### Rules

- PK = UUID v4 string
- Use camelCase for columns
- No business logic in models

## Controller Guidelines

### File Location

`src/features/[featureName]/[featureName].controller.js`

### Responsibilities

- Handle HTTP request/response
- Contain all business logic
- Use try-catch for error handling
- Call `sendSuccessResponse`/`sendErrorResponse`
- Write optimized, efficient and fast database queries using sequelize
- For list endpoints, parse pagination/sort using `getPaginationParams` instead of inline pagination logic.

### Template

```javascript
// itemStore.controller.js
import _ from 'lodash';
import { Op } from 'sequelize';

import { HTTP_STATUS } from '../../constant/httpStatus.js';
import { ITEM_STORE_STRING } from '../../constant/strings.js';
import { sendSuccessResponse, sendErrorResponse } from '../../middleware/sendResponse.js';
import db from '../../models/index.js';
import { parseBoolean } from '../../utils/helpers.js';

const { itemstores: ItemStores } = db;

//// GET /////
async function getAllItemStores(req, res) {
	try {
		const page = req?.query?.page ? Math.max(Number(req?.query?.page), 1) : undefined;
		const limit = req?.query?.limit ? Number(req?.query?.limit) : 100;
		const search = req?.query?.search ? decodeURIComponent(req.query.search).trim() : undefined;
		const sortBy = req?.query?.sortBy || 'updatedAt';
		const order = req?.query?.order || 'DESC';
		const offset = page && limit ? Math.max(page - 1, 0) * limit : 0;
		const active = parseBoolean(req?.query?.active);
		const isActiveKey = Object.keys(req.query).includes('active');

		const whereClause = search
			? {
					[Op.or]: [{ discount: { [Op.like]: `%${search}%` } }, { creator: { [Op.like]: `%${search}%` } }],
					...(isActiveKey && { active }),
				}
			: undefined;

		const { rows = [], count } = await ItemStores.findAndCountAll({
			raw: true,
			where: whereClause,
			limit: req.query.limit ? limit : undefined,
			offset: req.query.page ? offset : undefined,
			order: [[sortBy, order]],
		});

		if (_.isEmpty(rows)) {
			return sendSuccessResponse({
				res,
				status: HTTP_STATUS.OK,
				data: {
					data: [],
					totalCount: 0,
					count: 0,
					currentPage: 1,
					totalPages: 1,
				},
				message: ITEM_STORE_STRING.NOT_FOUND,
			});
		}
		sendSuccessResponse({
			res,
			status: HTTP_STATUS.OK,
			data: {
				data: rows,
				totalCount: count,
				count: rows.length,
				currentPage: page,
				totalPages: Math.ceil(count / limit),
			},
			message: ITEM_STORE_STRING.FETCHED,
		});
	} catch (error) {
		sendErrorResponse({ res, status: HTTP_STATUS.SERVER_ERROR, message: error });
	}
}

// ... other CRUD methods
```

## Route Guidelines

### Middleware Order

- Required order: `auth` → `role/permission` → `validation` → `controller`.

### File Location

`src/features/[featureName]/[featureName].router.js`

### Template

```javascript
// itemStore.router.js
import { Router } from 'express';

import { idSchema, querySchema } from '../../common/joiSchema.js';
import { ENDPOINT } from '../../constant/endpoints.js';
import { joiValidate, JOI_TYPES } from '../../utils/joiValidator.js';
const {
	getAllItemStores,
	getItemStoresById,
	addItemStores,
	updateItemStores,
	deleteItemStores,
} from './itemStore.controller.js';

const itemStoreRouter = Router();

itemStoreRouter.get(ENDPOINT.BASE, joiValidate(querySchema, JOI_TYPES.QUERY), getAllItemStores);
itemStoreRouter.get(ENDPOINT.ID, joiValidate(idSchema, JOI_TYPES.PARAMS), getItemStoresById);
itemStoreRouter.post(ENDPOINT.BASE, joiValidate(addItemStoresSchema, JOI_TYPES.BODY), addItemStores);
itemStoreRouter.put(
	ENDPOINT.ID,
	joiValidate(updateItemStoresSchema, JOI_TYPES.BODY),
	joiValidate(idSchema, JOI_TYPES.PARAMS),
	updateItemStores,
);
itemStoreRouter.delete(ENDPOINT.ID, joiValidate(idSchema, JOI_TYPES.PARAMS), deleteItemStores);

export default itemStoreRouter;
```

## Error Handling

- Always wrap controller logic in `try-catch`
- Never expose raw errors to client
- Log errors with context (service name, args)
- Use centralized error middleware for final response

## Transactions

- For multi-table operations:
- **Transactions**: Use `db.sequelize.transaction()` for operations involving multiple tables (e.g., Creating Invoice & Items).

```javascript
import db from '../models/index.js';

await db.sequelize.transaction(async (t) => {
	await Model1.create(data1, { transaction: t });
	await Model2.create(data2, { transaction: t });
});
```

## Dependencies & Libs

- **Utils**: `src/utils/` contains helper functions.
- **Mailer**: Configured in `src/lib/mail.js` using `nodemailer`.

## Environment Variable Handling

- Never access process.env directly
- use env variables from `src/lib/config.js`

```javascript
import config from '../lib/config.js';
```

## Migration Practices

- Generate via:

```bash
npm run db:migrate  [feature-name-in-snake-case]  # Example: "npm run db:migrate create-users"
```

## Imports

- Use ESM imports with explicit `.js` extension in runtime code.
- Prefer relative imports in Node runtime unless you have a runtime alias resolver configured.
- `jsconfig.json` aliases are useful for editor intellisense, but do not change Node module resolution by default.
