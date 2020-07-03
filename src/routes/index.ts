import express from 'express';
import {TestController} from '../controllers';

const router = express.Router();

router.route('/test')
    .get(TestController.getSomeData)

export default router;