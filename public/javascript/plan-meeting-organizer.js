function pad(num, size) {
  num = num.toString()
  while (num.length < size) num = "0" + num
  return num
}

function minutesToClock(minutes) {
  let clockHours = minutes / 60
  let clockMinutes = minutes % 60

  if (clockHours > 23) {
    clockHours = 0
  }

  return pad(clockHours, 2) + ":" + pad(clockMinutes, 2)
}

function timeslotId(dayNum, timeslotNum) {
  return dayNum + "-" + timeslotNum
}

function timeslotText(startMinutes, lengthMinutes) {
  const startClock = minutesToClock(startMinutes)
  const endClock = minutesToClock(startMinutes + lengthMinutes)
  return startClock + " - " + endClock
}

function makeScheduleTable() {
  const weekCount = parseInt($('#week-count').val())
  const timeslotLengthMinutes = parseInt($('#timeslot-length').val())
  const startingTimeMinutes = parseInt($('#start-time').text())
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thurday', 'Friday', 'Saturday', 'Sunday']

  const schedule = $('#schedule')
  schedule.empty()

  const dayCount = weekCount * 7
  const timeslotCount = (1440 - startingTimeMinutes) / timeslotLengthMinutes

  for (let dayNum = 0; dayNum < dayCount; dayNum++) {
    const day = $('<div></div>').addClass('schedule__day')
    const dayName = $('<div></div>').addClass('schedule__day__name').addClass('small-text-bold').text(dayNames[dayNum % 7])
    const dayTimeslots = $('<div></div>').addClass('schedule__day__timeslots')

    let currentTimeMinutes = startingTimeMinutes

    for (let timeslotNum = 0; timeslotNum < timeslotCount; timeslotNum++) {
      const timeslot = $('<div></div>').addClass('schedule__day__timeslots__item').attr('id', timeslotId(dayNum, timeslotNum))
      timeslot.text(timeslotText(currentTimeMinutes, timeslotLengthMinutes))
      dayTimeslots.append(timeslot)
      currentTimeMinutes += timeslotLengthMinutes
    }

    day.append(dayName)
    day.append(dayTimeslots)
    schedule.append(day)
  }
}

function loadSchedule() {
}

async function loadConditions() {
  data = await $.ajax({
    url: "/api/plan/meeting/" + planUuid + "/answer/conditions"
  })
  data.blockedTimeslots.forEach((timeslot) => {
    blockedTimeslot = $('#' + timeslotId(timeslot.dayNum, timeslot.timeslotNum))
    blockedTimeslot.addClass("blocked-timeslot")
  })
  $('.schedule__day__timeslots__item').on('click', (e) => {
    e.target.classList.toggle('blocked-timeslot')
  })
}

async function loadAnswer(answerId) {
  data = await $.ajax({
    url: "answer/" + answerId
  })
}

async function loadResult() {
  data = await $.ajax({
    url: "calculate"
  })
}

async function updateConditions() {

}

window.onload = function () {
  makeScheduleTable()
}