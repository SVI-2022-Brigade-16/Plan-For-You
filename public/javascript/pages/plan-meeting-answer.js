// Build whole rating buttons
function buildRatingButtons() {
  CURRENT_CLICK_RATING = 'rating-' + ratingMax + '-1'
  const buttons = $('#rating-buttons')
  for (let rating = 1; rating <= ratingMax; ++rating) {
    buttons.append(buildRatingButton(rating, ratingMax))
  }
  $('.ratings-header__fields__item.' + CURRENT_CLICK_RATING).addClass('selected')
}

// Build one rating button
function buildRatingButton(rating, ratingMax) {
  let className = 'rating-' + ratingMax + '-' + rating
  const button = $('<div></div>').addClass('ratings-header__fields__item').addClass(className)
  const buttonName = $('<div></div>').addClass('small-text-bold').text(getTitle(rating, ratingMax))

  button.on('click', function (e) {
    CURRENT_CLICK_RATING = className
    $('.ratings-header__fields__item').removeClass('selected')
    $(e.currentTarget).addClass('selected')
  })

  button.append(buttonName)
  return button
}

// Get title to rating button
function getTitle(rating, ratingMax) {
  switch (ratingMax) {
    case 2:
      switch (rating) {
        case 1:
          return "Unavailable"

        case 2:
          return "Available"

        default:
          break
      }
      break

    case 3:
      switch (rating) {
        case 1:
          return "Unavailable"

        case 2:
          return "Uncertain"

        case 3:
          return "Available"

        default:
          break
      }
      break

    case 4:
      switch (rating) {
        case 1:
          return "Unavailable"

        case 2:
          return "Likely Unavailable"

        case 3:
          return "Likely Available"

        case 4:
          return "Available"

        default:
          break
      }
      break

    case 5:
      switch (rating) {
        case 1:
          return "Unavailable"

        case 2:
          return "Likely Unavailable"

        case 3:
          return "Uncertain"

        case 4:
          return "Likely Available"

        case 5:
          return "Available"

        default:
          break
      }
      break

    default:
      break
  }
}

// Show plan conditions in existing schedule table
async function loadInitialTimeslots() {
  data = await $.ajax({
    url: "/api/plan/meeting/" + planUuid + "/answer/form"
  })
  $('.day__timeslots__item').removeClass('rating-unblocked').addClass('rating-5-5')
  data.blockedTimeslots.forEach((timeslot) => {
    found = $('#' + getTimeslotId(timeslot.dayNum, timeslot.timeslotNum))
    found.removeClass('rating-5-5').addClass('rating-blocked').unbind()
  })
}

function getRatedTimeslots(ratingMax) {
  var ratedTimeslots = []
  for (let rating = 1; rating <= ratingMax; rating++) {
    $('.day__timeslots__item.rating-' + ratingMax + '-' + rating).each(function () {
      day_timeslot = $(this).attr('id').split('-')
      console.log(day_timeslot)
      ratedTimeslots.push({
        dayNum: parseInt(day_timeslot[0]),
        timeslotNum: parseInt(day_timeslot[1]),
        rating: rating
      })
    })
  }
  console.log(ratedTimeslots)
  return ratedTimeslots
}

async function submitAnswer(ratingMax) {
  return await $.ajax({
    url: "/api/plan/meeting/" + planUuid + "/answer",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      "participantName": $("#name").val(),
      "ratedTimeslots": getRatedTimeslots(ratingMax)
    }),
    success: function () {
      alert("Your answer has been submited!")
    }

  })
}

window.onload = function () {
  buildScheduleTable(
    weekCount,
    timeslotLength,
    startTime
  )
  loadInitialTimeslots()
  buildRatingButtons()
  enableTimeslotRatingSelect('')
}

