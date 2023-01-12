var HOLD = false
var CURRENT_CHANGE_CLASS = ''
var CURRENT_CLICK_RATING = 'rating-unblocked'

function autoClickRating(timeslot) {
  if (timeslot.hasClass('rating-blocked')) {
    CURRENT_CLICK_RATING = 'rating-unblocked'
  } else {
    CURRENT_CLICK_RATING = 'rating-blocked'
  }
}

function addHoldClickRating(timeslots, type) {
  timeslots.on('mousedown', function () {
    if (type == 'block') {
      autoClickRating($(this))
    }
    HOLD = true
    const current_rating = $(this).attr('class').match(/rating-([^\s])+/g)
    $(this).addClass(CURRENT_CLICK_RATING)
    if (current_rating && current_rating[0] != CURRENT_CLICK_RATING) {
      $(this).removeClass(current_rating[0])
    }

  })

  $('body').on('mouseup', function () {
    HOLD = false
  })

  timeslots.on('mouseenter', function () {
    const current_rating = $(this).attr('class').match(/rating-([^\s])+/)
    if (HOLD) {
      $(this).addClass(CURRENT_CLICK_RATING)
      if (current_rating && current_rating[0] != CURRENT_CLICK_RATING) {
        $(this).removeClass(current_rating[0])
      }
    }
  })
}

function enableTimeslotRatingSelect(type) {
  let timeslots = $('.schedule .day__timeslots__item')
  addHoldClickRating(timeslots, type)
}