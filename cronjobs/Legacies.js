'use strict'

import cron from 'node-cron'
import {cronCheckNullLegacies} from '../controllers/Legacies'

/**
 * CRON JOB FOR CONTRACT PRICES
 */

cron.schedule('*/1 * * * *', async () => {
  console.log('Running Legacies cron')
  cronCheckNullLegacies()
})