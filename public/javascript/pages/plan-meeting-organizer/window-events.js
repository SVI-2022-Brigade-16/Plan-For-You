window.addEventListener('load', function () {
  loadSchedule() // fun-schedule.js
  loadSettings() // fun-settings.js
  if ($(window).width() < TIMESLOT_EXPAND_WINDOW_WIDTH) {
    $('.day__timeslots__item').each(function () {
      $(this).height(TIMESLOT_HEIGHT * 2)
    })
  }
})

window.addEventListener('resize', function () {
  if ($(window).width() < TIMESLOT_EXPAND_WINDOW_WIDTH) {
    $('.day__timeslots__item').each(function () {
      $(this).height(TIMESLOT_HEIGHT * 2)
    })
  } else {
    $('.day__timeslots__item').each(function () {
      $(this).height(TIMESLOT_HEIGHT)
    })
  }
})