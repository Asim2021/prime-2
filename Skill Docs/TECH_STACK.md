# Tech Stack

## Backend (ERPB)

- **Runtime**: Node.js
- **Framework**: Express.js (`express@4.21.2`)
- **Database**: MySQL (`mysql2@3.11.5`)
- **ORM**: Sequelize (`sequelize@6.37.5`)
- **Validation**: Joi (`joi@17.13.3`)
- **Auth**: JWT (`jsonwebtoken@9.0.2`), bcrypt (`bcryptjs@2.4.3`), otplib(`13.2.1`) and qrcode(`@1.5.4`)
- **Email**: Nodemailer (`nodemailer@6.9.16`) + Handlebars templates
- **Utils**: dayjs (`dayjs@1.11.19`), Lodash (`lodash@4.17.21`), Multer (`multer@2.0.2`), csv-parse (`@6.1.0`)
- **Security**: Helmet, CORS, Rate Limiting, Cookie Parser
- **Logging**: Winston
- **Language**: JavaScript (no TypeScript)

## Frontend (ERPF)

- **Framework**: React 19 (`react@19.1.0`, `react-dom@19.1.0`)
- **Routing**: React Router v7 (`react-router-dom@7.7.1`)
- **State Management**:
    - Server state: TanStack Query v5 (`@tanstack/react-query@5.83.0`)
    - Client state: Zustand (`zustand@5.0.6`)
- **UI Library**: Mantine v8 (`@mantine/core@8.2.1`, `@mantine/hooks`, `@mantine/form`,`@mantine/dates`,`@mantine/notifications`, `@mantine/modals` etc.)
- **UI Charts**: @mantine/charts and recharts
- **Tables**: TanStack Table v8 (`@tanstack/react-table@8.21.3`)
- **Forms**: Mantine Form + react-imask (`react-imask@7.6.1`)
- **Styling**: Tailwind preset for Mantine
- **HTTP Client**: Axios (`axios@1.11.0`)
- **Utils**:
    - Date handling: dayjs (`dayjs@1.11.19`)
    - Utilities: Lodash-es (`lodash-es@4.17.21`)
    - Crypto: crypto-js (`crypto-js@4.2.0`)
- **UI Enhancements**:
    - Drag & Drop: dnd-kit (`@dnd-kit/core@6.3.1`)
    - Select: react-select (`react-select@5.10.2`)
    - Icons: react-icons
- **Language**: TypeScript

## Shared Dependencies

- **Date Library**: dayjs (`1.11.19`)
- **Crypto**: crypto-js (`4.2.0`)
