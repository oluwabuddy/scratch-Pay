/**
 * Route definitions for the API that handles the tasks related with calculating and working with dates taking business
 * days into account.
 *
 * @module routes/businessDates
 */

const dates = require('../lib/dates')
const express = require('express')
const  {DateTime} = require('luxon')
const router = module.exports = {
  path: '/',
  routes: express.Router()
}
const routes = router.routes

/**
 * Handles requests for calculating the date on which a settlement will reach a bank account, based on an initial date
 * and a number of days of delay.
 *
 * This route handler requires a JSON payload with the parameters described below and will return a JSON object with
 * `initialQuery` and `results` properties. The `initialQuery` property contains the data that was passed in the client
 * request and `results` contains a hash that includes the `businessDate`, which is the actual date we're mostly
 * interested in, among other more fine grained details about the query.
 *
 * @param {Date} initialDate Date to start counting the time period.
 * @param {Number} delay How many business days to add to the `initialDate`.
 */
function getSettlementDate(req, res) {
  const delay = parseInt(req.query.delay)
  const initialDate = DateTime.fromISO(req.query.initialDate)
  const daysInDelay = dates.getTotalDelay(initialDate, delay, req.query.country || 'US')
  const businessDate = initialDate.plus({days: daysInDelay.totalDays - 1}).toUTC().toISO({suppressMilliseconds: true})

  res.json({
    ok: true,
    initialQuery: req.query,
    results: {
      businessDate,
      holidayDays: daysInDelay.holidayDays,
      totalDays: daysInDelay.totalDays,
      weekendDays: daysInDelay.weekendDays
    }
  })
}

/**
 * Handles requests for determining if a given date is a business day.
 *
 * This route handler requires a JSON payload with the parameters described below and will return a JSON object with
 * a `results` property containing either `true` or `false`.
 *
 * @param {Date} date Date to check.
 */
function isBusinessDay(req, res) {
  if (!req.query.date)
    return res.json({ok: false, errorMessage: 'A valid date is required'})

  res.json({ok: true, results: dates.isBusinessDay(req.query.date, req.query.country || 'US')})
}

routes
  .route('/isBusinessDay')
  .get(isBusinessDay)

routes
  .route('/settlementDate')
  .get(getSettlementDate)
