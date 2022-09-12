/**
 * Handles the tasks related with calculating and working with dates taking business days into account.
 *
 * @example
 * const businessDates = require('./dates')
 * businessDates.getTotalDelay('2021-11-10T10:10:10Z', 3)
 * // {holidayDays: 1, weekendDays: 2, totalDays: 6}
 *
 * @module dates
 */

/**
 * A Luxon DateTime object. Refer to the {@link https://moment.github.io/luxon/docs/ Luxon Documentation} for more info.
 * @typedef {Object} DateTime
 */

const Holidays = require('date-holidays')
const holidays = new Holidays()
const {DateTime} = require('luxon')

function toDateTime(dates) {
  return dates.map(date => DateTime.fromISO(date))
}

/**
 * Checks whether or not a date corresponds to a weekend day.
 *
 * @param {DateTime} date The date to check.
 * @return {Boolean} True if it's a weekend day, false otherwise.
 */
function isWeekendDay(date) {
  return date.weekday === 6 || date.weekday === 7
}

/**
 * Checks whether or not a date corresponds to a holiday.
 *
 * @param {DateTime} date The date to check.
 * @return {Boolean} True if it's a holiday, false otherwise.
 */
function isHolidayDay(date, country) {
  holidays.init(country)
  return holidays.isHoliday(date)
}

/**
 * Returns an object containing all the days in the delay by including weekend days and holidays.
 *
 * @param {DateTime} initialDate The date to start counting from.
 * @param {Number} delay How many business days to add to the initial date.
 * @return {Object} A hash containing the number of `holidayDays`, `totalDays` and `weekendDays`.
 */
exports.getTotalDelay = (initialDate, delay, country) => {
  let holidayDays = 0
  let totalDays = delay
  let weekendDays = 0
  let i = 0

  while (i < totalDays) {
    let day = initialDate.plus({days: i})
    if (isWeekendDay(day) && (weekendDays += 1) || isHolidayDay(day, country) && (holidayDays += 1)) totalDays += 1
    i++
  }

  return {holidayDays, totalDays, weekendDays}
}

/**
 * Checks if a given date is a business day.
 *
 * @param {String} date Date to check.
 * @return {Boolean} Either true if the given date is a business day or false otherwise.
 */
exports.isBusinessDay = (date, country) => {
  const day = DateTime.fromISO(date)
  return !isWeekendDay(day) && !isHolidayDay(day, country)
}
