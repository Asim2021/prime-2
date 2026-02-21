# Backend Development Guidelines

## Core Principles

- **Language**: Plain JavaScript (no TypeScript)
- **Module System**: ESM with abosolute import with '#\*.js' (`"type": "module"` in `package.json`) eg ` '#constant/endpoints.js'`
- **Pattern**: Feature-based modular architecture
- **Business Logic**: Lives in service file i.e., \*.service.js
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
│   ├── features/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.router.js
│   │   │   └── auth.schema.js     # Joi Schema
│   │   ├── medicine/               # Grouped Feature (Multiple controllers/routers)
│   │   │   ├── medicine.controller.js
│   │   │   ├── medicine.router.js
│   │   │   ├── medicine.service.js
│   │   │   └── medicine.schema.js
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
│   │   ├── rateLimit.js      # API rate limiter
│   │   └── sqlConfig.js       # MySql Config with Sequelize
│   ├── middleware/
│   │   ├── error.middleware.js
│   │   ├── notFound.handler.js
│   │   ├── sendResponse.js
│   │   └── verifyTokens.js
│   ├── models/        # Sequelize Model definitions
│   │   ├── users/
│   │   │   └── user.model.js
│   │   ├── roles/
│   │   │   └── role.model.js
│   │   └── index.js     # Sequelize model with associations defined
│   ├── utils/
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
    - src/features/[featureName]/ with controller,service, router, schema
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
- Default `sortBy`: `created_at` (unless feature defines otherwise)
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
import { DataTypes, Model } from 'sequelize';
import sequelize from '#lib/sqlConfig.js';
export class User extends Model {}
User.init(
	{
		id: {
			type: DataTypes.CHAR(36),
			primaryKey: true,
		},
		username: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
		},
		email: {
			type: DataTypes.STRING(150),
			allowNull: false,
			unique: true,
		},
		password_hash: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		role_id: {
			type: DataTypes.CHAR(36),
			allowNull: false,
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		last_login_at: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		session_token: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		created_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		updated_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		sequelize,
		tableName: 'users',
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
);
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
// user.controller.js
import _ from 'lodash';
import * as userService from './user.service.js';
import { HTTP_STATUS } from '#constant/httpStatus.js';
import { sendSuccessResponse, sendErrorResponse } from '#middleware/sendResponse.js';
import { getPaginationParams, parseBoolean } from '#utils/helpers.js';
import { USERS_STRING } from '#constant/strings.js';

export const list = async (req, res) => {
	try {
		const { page, limit, offset, sortBy, order } = getPaginationParams({
			page: req?.query?.page,
			limit: req?.query?.limit,
			sortBy: req?.query?.sort_by,
			order: req?.query?.order,
			defaultLimit: 10,
			maxLimit: 100,
			defaultSortBy: 'created_at',
			defaultOrder: 'DESC',
		});
		const search = req?.query?.search ? decodeURIComponent(req.query.search).trim() : undefined;
		const active = parseBoolean(req?.query?.filter?.active);
		const { rows, count } = await userService.getAllUsers({
			page,
			limit,
			offset,
			sortBy,
			order,
			search,
			active,
		});

		sendSuccessResponse({
			res,
			status: HTTP_STATUS.OK,
			message: USERS_STRING.USER_FETCHED,
			data: _.isEmpty(rows)
				? {
						data: [],
						totalCount: 0,
						count: 0,
						currentPage: 1,
						totalPages: 1,
					}
				: {
						data: rows,
						totalCount: count,
						count: rows.length,
						currentPage: page,
						totalPages: Math.ceil(count / limit),
					},
		});
	} catch (error) {
		sendErrorResponse({
			res,
			error,
			status: error.statusCode || HTTP_STATUS.SERVER_ERROR,
			message: error.message || error,
		});
	}
};

// ... other CRUD methods
```

## Service Guidelines

### File Location

`src/features/[featureName]/[featureName].service.js`

```javascript
// user.service.js
import { Op, Sequelize } from 'sequelize';
import { User, Role } from '#models/index.js';
import { createError } from '#middleware/error.middleware.js';
import { HTTP_STATUS } from '#constant/httpStatus.js';

/**
 * Get all users with their roles.
 */
export const getAllUsers = async ({ page, limit, offset, sortBy, order, search, active }) => {
	return User.findAndCountAll({
		raw: true,
		include: [{ model: Role, as: 'role', attributes: [] }],
		attributes: {
			exclude: ['password_hash', 'session_token'],
			include: [
				[Sequelize.col('role.name'), 'role_name'],
				[Sequelize.col('role.code'), 'role_code'],
			],
		},
		where: {
			...(search && {
				username: { [Op.like]: `%${search.trim()}%` },
			}),
			...(active && { is_active: active }),
		},
		limit,
		offset,
		order: [[sortBy, order]],
	});
};
```

## Route Guidelines

### Middleware Order

- Required order: `auth` → `role/permission` → `validation` → `controller`.

### File Location

`src/features/[featureName]/[featureName].router.js`

### Template

```javascript
// user.router.js
import { Router } from 'express';

import { verifyAccessToken, verifyUserRole } from '#middleware/verifyTokens.js';
import { JOI_TYPES, joiValidate } from '#utils/joiValidator.js';
import { ENDPOINT } from '#constant/endpoints.js';
import { list, getById, create, update, deactivate } from './user.controller.js';
import { createUserSchema, getAllUserSchema, updateUserSchema, userIdParamSchema } from './user.schema.js';

const router = Router();

// All user routes require authentication
router.use(verifyAccessToken);

router.get(ENDPOINT.BASE, verifyUserRole(['admin']), joiValidate(getAllUserSchema, JOI_TYPES.QUERY), list);
router.get(ENDPOINT.ID, joiValidate(userIdParamSchema, JOI_TYPES.PARAMS), getById);
router.post(ENDPOINT.BASE, verifyUserRole(['admin']), joiValidate(createUserSchema, JOI_TYPES.BODY), create);
router.patch(
	ENDPOINT.ID,
	verifyUserRole(['admin']),
	joiValidate(userIdParamSchema, JOI_TYPES.PARAMS),
	joiValidate(updateUserSchema, JOI_TYPES.BODY),
	update,
);
router.delete(ENDPOINT.ID, verifyUserRole(['admin']), joiValidate(userIdParamSchema, JOI_TYPES.PARAMS), deactivate);

export default router;
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
import db from '#models/index.js';

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
