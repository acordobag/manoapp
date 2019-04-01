'use strict'

import cron from 'node-cron'
import Legacy from '../controllers/Legacies'

/**
 * CRON JOB FOR CONTRACT PRICES
 */

cron.schedule('*/1 * * * *', async () => {
  Legacy.cronCheckNullLegacies()
})