var HOLD = false
var CURRENT_CLICK_CLASS = ''
var CHANGE_CLASS_MAP = new Map()

function addBlockedEventListeners() {

    $('.schedule .day__timeslots__item').on('mousedown', function() {
        HOLD = true
        if ($(this).hasClass('rating-blocked')) {
            CURRENT_CLICK_CLASS = 'rating-blocked'
        } else {
            CURRENT_CLICK_CLASS = 'rating-none'
        }
        const ratings = $(this).attr('class').match(/rating-([^\s])+/)
        if (ratings) {
            $(this).removeClass(ratings[0])
        }
        $(this).addClass(CURRENT_CLICK_CLASS)
    })

    $('body').on('mouseup', function() {
        HOLD = false
    })

    $('.schedule .day__timeslots__item').on('mouseenter', function() {
        const current_rating = $(this).attr('class').match(/rating-([^\s])+/)[0]
        if (!HOLD) {
            if ($(this).hasClass('rating-blocked')) {
                CURRENT_CLICK_CLASS = 'rating-none'
            } else {
                CURRENT_CLICK_CLASS = 'rating-blocked'
            }
            CHANGE_CLASS_MAP.set($(this).attr('id'), current_rating)
        } else {
            CHANGE_CLASS_MAP.set($(this).attr('id'), CURRENT_CLICK_CLASS)
        }
        $(this).removeClass(current_rating)
        $(this).addClass(CURRENT_CLICK_CLASS)
    })

    $('.schedule .day__timeslots__item').on('mouseleave', function() {
        if (!HOLD) {
            const rating = $(this).attr('class').match(/rating-([^\s])+/)[0]
            $(this).removeClass(rating)
            $(this).addClass(CHANGE_CLASS_MAP.get($(this).attr('id')))
        }
    })
}