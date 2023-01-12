/* Initial schedule load */

// Build schedule table and load plan conditions by default
function loadSchedule() {
  buildSchedule(weekCount, timeslotLength, startTime) // schedule.js
  loadConditionsOnce()
  addTabSwitch()
}


/* Schedule data loaders */

// Load plan conditions in existing schedule table to be kept until reload
async function loadConditionsOnce() {
  let data = await $.ajax({
    url: "/api/plan/meeting/" + planUuid + "/answer/conditions"
  })
  $('.day__timeslots__item').addClass('rating-unblocked')
  data.blockedTimeslots.forEach((timeslot) => {
    found = $('#' + getTimeslotId(timeslot.dayNum, timeslot.timeslotNum))
    found.removeClass('rating-unblocked').addClass('rating-blocked')
  })
  enableTimeslotRatingSelect('block') // click-hold-select.js
}

// Load plan answer in existing schedule table
async function loadAnswer(answerId) {
  let data = await $.ajax({
    url: "/api/plan/meeting/" + planUuid + "/answer/" + answerId,
    type: "GET"
  })
  data.ratedTimeslots.forEach((timeslot) => {
    found = $('#' + getTimeslotId(timeslot.dayNum, timeslot.timeslotNum))
    found.addClass(ratingClass(timeslot.rating))
    if (timeslot.rating != ratingMax) {
      found.removeClass(RATING_MAX_CLASS)
    }
  })
}

// Load plan result in existing schedule table
async function loadResult() {
  let data = await $.ajax({
    url: "/api/plan/meeting/" + planUuid + "/result",
    type: "GET"
  })
  const answerCount = data.answerCount
  data.sortedTotalRatedTimeslots.forEach((timeslot) => {
    found_timeslot = $('#' + getTimeslotId(timeslot.dayNum, timeslot.timeslotNum))
    relative_rating = Math.ceil(timeslot.rating / answerCount)
    found_timeslot.addClass(ratingClass(relative_rating))
    total_rating = $('<p></p>').text('Rating: ' + timeslot.rating).addClass('timeslot_total_rating')
    found_timeslot.append(total_rating)

    if (Math.ceil(timeslot.rating / answerCount) == ratingMax) {
      total_rating.css('font-weight', 'bold')
    }

    if (timeslot.lowerThanMaxRatings.length == 0) {
      found_timeslot.attr('title', "All participants like this timeslot!")
      return
    }

    var lowerThanMaxRatingsText = "Participants who gave lower ratings:\n"
    timeslot.lowerThanMaxRatings.forEach(function (answerRating) {
      lowerThanMaxRatingsText += answerRating.participantName + ': ' + answerRating.rating + '\n'
    })
    found_timeslot.attr('title', lowerThanMaxRatingsText)
  })
}


/* Tab switches */

// Add click events on all tabs
function addTabSwitch() {
  $('.schedule-viewer__tabs__item').click(function () {
    $('.schedule-viewer__tabs__item.selected').removeClass('selected')
    $(this).addClass('selected')
    $('.timeslot_total_rating').remove()
  })

  addConditionsSwitch()
  addAnswerSwitch()
  addResultSwitch()
}

// Add click event on conditions tab
function addConditionsSwitch() {
  $('.schedule-viewer__tabs__item.conditions').click(function () {
    removeRatingClasses()
    $('.day__timeslots__item:not(.rating-blocked)').addClass('rating-unblocked')
    enableTimeslotRatingSelect('block')
    $('.schedule-viewer__buttons__unblock').prop('disabled', false)
    TIMESLOT_HEIGHT = TIMESLOT_HEIGHT_INITIAL
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
}

function removeRatingClasses() {
  for (let rating = 1; rating <= ratingMax; rating++) {
    let ratingC = ratingClass(rating)
    $('.day__timeslots__item.' + ratingC).removeClass(ratingC)
  }
}

function ratingClass(rating) {
  return RATING_CLASS_PREFIX + rating
}

// Add click event on answer tabs
function addAnswerSwitch() {
  $('.schedule-viewer__tabs__item.answer').click(function (e) {
    removeRatingClasses()
    $('.day__timeslots__item.rating-unblocked').removeClass('rating-unblocked')
    $('.day__timeslots__item').unbind()
    $('.day__timeslots__item:not(.rating-blocked)').addClass(RATING_MAX_CLASS)
    const answerId = e.currentTarget.id.split('-')[2] // answer-tab-{id}
    loadAnswer(answerId)
    $('.schedule-viewer__buttons__unblock').prop('disabled', true)
    TIMESLOT_HEIGHT = TIMESLOT_HEIGHT_INITIAL
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
}

// Add click event on result tab
function addResultSwitch() {
  $('#read-result').click(function (e) {
    $('#result-tab').removeClass('display-none').click()
  })
  $('#result-tab').click(function (e) {
    removeRatingClasses()
    $('.day__timeslots__item.rating-unblocked').removeClass('rating-unblocked')
    $('.day__timeslots__item').unbind()
    const answerId = e.currentTarget.id.split('-')[1]
    loadResult(answerId)
    $('.schedule-viewer__buttons__unblock').prop('disabled', true)
    TIMESLOT_HEIGHT = TIMESLOT_HEIGHT_INITIAL * 2
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
}

