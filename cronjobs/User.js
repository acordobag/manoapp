'use strict'

import cron from 'node-cron'
import {cronCheckUserStatus} from '../controllers/User'

/**
 * CRON JOB FOR CONTRACT PRICES
 */

cron.schedule('*/30 * * * *', async () => {
  cronCheckUserStatus()
})