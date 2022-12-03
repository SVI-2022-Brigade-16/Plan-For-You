var HOLD = false
var CURRENT_CHANGE_CLASS = ''
var CHANGE_CLASS_MAP = new Map()

function addBlockedEventListeners() {

  $('.schedule .day__timeslots__item').on('mousedown', function () {
    HOLD = true
    if ($(this).hasClass('rating-blocked')) {
      CURRENT_CLICK_CLASS = 'rating-blocked'
    } else {
      CURRENT_CLICK_CLASS = 'rating-none'
    }
    const ratings = ($(this).attr('class').match(/rating-(.)+/g) || [])
    $(this).addClass(CURRENT_CLICK_CLASS)
    if (ratings.length > 1) {
      $(this).removeClass(ratings[0].split(' ')[0])
    }
  })

  $('body').on('mouseup', function () {
    CHANGE_CLASS_MAP.set($(this).attr('id'), CURRENT_CLICK_CLASS)
    HOLD = false
  })

  $('.schedule .day__timeslots__item').on('mouseenter', function () {
    if (!HOLD) {
      if ($(this).hasClass('rating-blocked')) {
        CURRENT_CLICK_CLASS = 'rating-none'
      } else {
        CURRENT_CLICK_CLASS = 'rating-blocked'
      }
    }
    const current_rating = ($(this).attr('class').match(/rating-(.)+/g) || [])[0].split(' ')[0]
    console.log('set: ' + current_rating)
    CHANGE_CLASS_MAP.set($(this).attr('id'), current_rating)
    $(this).addClass(CURRENT_CLICK_CLASS)
    $(this).removeClass(current_rating)
  })

  $('.schedule .day__timeslots__item').on('mouseleave', function () {
    if (!HOLD) {
      $(this).addClass(CHANGE_CLASS_MAP.get($(this).attr('id')))
      const ratings = ($(this).attr('class').match(/rating-(.)+/g) || [])[0].split(' ')
      if (ratings.length > 1) {
        $(this).removeClass(ratings[0])
      }
    }
  })
}