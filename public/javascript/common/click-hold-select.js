var HOLD = false
var CURRENT_CHANGE_CLASS = ''
var CHANGE_CLASS_MAP = new Map()
var CURRENT_CLICK_RATING = 'rating-none'

function addTimeslotRatingSelect(type) {
  timeslots = $('.schedule .day__timeslots__item')
  addHoldClickRating(timeslots, type)
}

function addHoldClickRating(timeslots, type) {
  timeslots.on('mousedown', function () {
    HOLD = true
    const previous_rating = $(this).attr('class').match(/rating-([^\s])+/g)[0]
    if (previous_rating != CURRENT_CLICK_RATING) {
      $(this).addClass(CURRENT_CLICK_RATING)
      $(this).removeClass(previous_rating)
      CHANGE_CLASS_MAP.set($(this).attr('id'), CURRENT_CLICK_RATING)
    }
  })

  $('body').on('mouseup', function () {
    HOLD = false
  })

  timeslots.on('mouseup', function () {
    CHANGE_CLASS_MAP.set($(this).attr('id'), CURRENT_CLICK_RATING)
  })

  timeslots.on('mouseenter', function () {
    const previous_rating = $(this).attr('class').match(/rating-([^\s])+/)[0]
    if (!HOLD) {
      if (type == 'block') {
        if ($(this).hasClass('rating-blocked')) {
          CURRENT_CLICK_RATING = 'rating-none'
        } else {
          CURRENT_CLICK_RATING = 'rating-blocked'
        }
      }
      CHANGE_CLASS_MAP.set($(this).attr('id'), previous_rating)
    } else {
      CHANGE_CLASS_MAP.set($(this).attr('id'), CURRENT_CLICK_RATING)
    }
    if (previous_rating != CURRENT_CLICK_RATING) {
      $(this).addClass(CURRENT_CLICK_RATING)
      $(this).removeClass(previous_rating)
    }
  })

  timeslots.on('mouseleave', function () {
    if (!HOLD) {
      $(this).addClass(CHANGE_CLASS_MAP.get($(this).attr('id')))
      const ratings = ($(this).attr('class').match(/rating-(.)+/g) || [])[0].split(' ')
      if (ratings.length > 1) {
        $(this).removeClass(ratings[0])
      }
    }
  })
}