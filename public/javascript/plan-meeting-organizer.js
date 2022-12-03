const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thurday', 'Friday', 'Saturday', 'Sunday']

// Pad number with leading zeros
function pad(num, size) {
  num = num.toString()
  while (num.length < size) num = "0" + num
  return num
}

// Transforms number of minutes to clock representation
function ToClock(minutes) {
  let clockHours = minutes / 60
  let clockMinutes = minutes % 60

  if (clockHours > 23) {
    clockHours = 0
  }

  return pad(clockHours, 2) + ":" + pad(clockMinutes, 2)
}

// Function for timeslot block ids
function timeslotId(dayNum, timeslotNum) {
  return dayNum + "-" + timeslotNum
}

// Creates text to put inside timeslot
function timeslotText(start, length) {
  const startClock = ToClock(start)
  const endClock = ToClock(start + length)
  return startClock + " - " + endClock
}

// Gets day of the week from day number
function getDay(dayNum) {
  return dayNames[dayNum % 7]
}

// Builds one timeslot block
function buildScheduleTimeslot(dayNum, timeslotNum, currentTime, timeslotLength) {
  const timeslot = $('<div></div>').addClass('day__timeslots__item').attr('id', timeslotId(dayNum, timeslotNum))
  timeslot.addClass('small-text-bold').text(timeslotText(currentTime, timeslotLength))
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
function buildScheduleTable() {
  const weekCount = parseInt($('#week-count').val())
  const timeslotLength = parseInt($('#timeslot-length').val())
  const startingTime = parseInt($('#start-time').text())
  const schedule = $('#schedule')
  const dayCount = weekCount * 7
  const timeslotCount = (1440 - startingTime) / timeslotLength
  schedule.empty()

  for (let dayNum = 0; dayNum < dayCount; dayNum++) {
    schedule.append(buildScheduleDay(dayNum, timeslotLength, startingTime, timeslotCount))
  }
}

// Show plan conditions in existing schedule table
async function loadConditions() {
  data = await $.ajax({
    url: "/api/plan/meeting/" + planUuid + "/answer/conditions"
  })
  data.blockedTimeslots.forEach((timeslot) => {
    blockedTimeslot = $('#' + timeslotId(timeslot.dayNum, timeslot.timeslotNum))
    blockedTimeslot.addClass("blocked")
  })
  $('.day__timeslots__item').on('click', (e) => {
    e.target.classList.toggle('blocked')
  })
}

// Show plan answer in existing schedule table
async function loadAnswer(answerId) {
  data = await $.ajax({
    url: "answer/" + answerId
  })
}

// Show plan result in existing schedule table
async function loadResult() {
  data = await $.ajax({
    url: "calculate"
  })
}


async function updateConditions() {

}

window.onload = function () {
  buildScheduleTable()
  loadConditions()
}