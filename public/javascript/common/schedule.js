const FULL_DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thurday', 'Friday', 'Saturday', 'Sunday']
const SHORT_DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const SHORT_DAY_NAMES_WINDOW_WIDTH = 960

var TIMESLOT_HEIGHT = 60

// Pad number with leading zeros
function pad(num, size) {
  num = num.toString()
  while (num.length < size) num = "0" + num
  return num
}

// Transforms number of minutes to clock representation
function ToClock(minutes) {
  let clockHours = Math.floor(minutes / 60)
  let clockMinutes = minutes % 60

  if (clockHours > 23) {
    clockHours = 0
  }

  return pad(clockHours, 2) + ":" + pad(clockMinutes, 2)
}

// Creates text to put inside timeslot
function getTimeslotText(start, length) {
  const startClock = ToClock(start)
  const endClock = ToClock(start + length)
  return startClock + " - " + endClock
}

// Gets day of the week from day number
function getDay(dayNum) {
  if ($(window).width() > SHORT_DAY_NAMES_WINDOW_WIDTH) {
    return FULL_DAY_NAMES[dayNum % 7]
  } else {
    return SHORT_DAY_NAMES[dayNum % 7]
  }
}

// Builds one timeslot block
function buildScheduleTimeslot(dayNum, timeslotNum, currentTime, timeslotLength) {
  const timeslot = $('<div></div>').addClass('day__timeslots__item').attr('id', getTimeslotId(dayNum, timeslotNum))
  const timeslotText = $('<p></p>').addClass('small-text-normal').text(getTimeslotText(currentTime, timeslotLength))
  timeslot.append(timeslotText).height(TIMESLOT_HEIGHT)
  return timeslot
}

// Builds one day containing timeslots
function buildScheduleDay(dayNum, timeslotLength, startingTime, timeslotCount) {
  const day = $('<div></div>').addClass('day')
  const dayName = $('<div></div>').addClass('day__name').addClass('small-text-bold').text(getDay(dayNum))
  const dayTimeslots = $('<div></div>').addClass('day__timeslots')

  let currentTime = startingTime
  for (let timeslotNum = 0; timeslotNum < timeslotCount; timeslotNum++) {
    dayTimeslots.append(buildScheduleTimeslot(dayNum, timeslotNum, currentTime, timeslotLength))
    currentTime += timeslotLength
  }

  day.append(dayName)
  day.append(dayTimeslots)
  return day
}

// Builds the whole table with all days containing timeslots
function buildSchedule(weekCount, timeslotLength, startTime) {
  const schedule = $('#schedule')
  const dayCount = weekCount * 7
  const timeslotCount = Math.floor((1440 - startTime) / timeslotLength)
  schedule.empty()

  for (let dayNum = 0; dayNum < dayCount; dayNum++) {
    schedule.append(buildScheduleDay(dayNum, parseInt(timeslotLength), parseInt(startTime), timeslotCount))
  }
}

window.addEventListener('resize', function () {
  adjustDayNames()
})

function adjustDayNames() {
  dayNameElements = $('.schedule .day__name')
  if ($(window).width() > SHORT_DAY_NAMES_WINDOW_WIDTH) {
    for (let i = 0; i < weekCount * 7; i++) {
      dayNameElements[i].innerText = FULL_DAY_NAMES[i % 7]
    }
  } else {
    for (let i = 0; i < weekCount * 7; i++) {
      dayNameElements[i].innerText = SHORT_DAY_NAMES[i % 7]
    }
  }
}