import { Router } from 'express';
import v1Router from './v1.js';
import { ENDPOINT } from '#constant/endpoints.js';

const rootRouter = Router();
rootRouter.use(ENDPOINT.ROOT_V1, v1Router);
export default rootRouter;
//# sourceMappingURL=index.js.map