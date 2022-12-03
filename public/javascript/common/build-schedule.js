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
    const timeslot = $('<div></div>').addClass('day__timeslots__item').attr('id', getTimeslotId(dayNum, timeslotNum))
    timeslot.addClass('tiny-text-normal').text(timeslotText(currentTime, timeslotLength))
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
function buildScheduleTable(weekCount, timeslotLength, startingTime) {
    const schedule = $('#schedule')
    const dayCount = weekCount * 7
    const timeslotCount = (1440 - startingTime) / timeslotLength
    schedule.empty()

    for (let dayNum = 0; dayNum < dayCount; dayNum++) {
        schedule.append(buildScheduleDay(dayNum, timeslotLength, startingTime, timeslotCount))
    }
}

// Building table init
function initSheduleTable() {
    const weekCount = parseInt($('#week-count').val())
    const timeslotLength = parseInt($('#timeslot-length').val())
    const startingTime = parseInt($('#start-time').text())
    buildScheduleTable(weekCount, timeslotLength, startingTime)
}