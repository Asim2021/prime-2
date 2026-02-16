import { Router } from 'express';
import v1Router from './v1.js';

const rootRouter = Router();
rootRouter.use('/v1', v1Router);
export default rootRouter;
//# sourceMappingURL=index.js.map