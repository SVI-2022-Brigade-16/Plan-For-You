// Show plan conditions in existing schedule table
async function loadConditions(blockedTimeslots) {
  data = await $.ajax({
    url: "/api/plan/meeting/" + planUuid + "/answer/conditions"
  })
  $('.day__timeslots__item').addClass('rating-unblocked')
  data.blockedTimeslots.forEach((timeslot) => {
    blockedTimeslot = $('#' + getTimeslotId(timeslot.dayNum, timeslot.timeslotNum))
    blockedTimeslot.removeClass('rating-unblocked').addClass('rating-blocked')
  })
}

// Build whole rating buttons
function buildRatingButtons(ratingRange) {
  const buttons = $('.settings-bar.settings-bar__fields')
  for (let rating = 0; rating < ratingRange; ++rating) {
    buttons.append(buildRatingButton(rating, ratingRange))
  }
}

// Build one rating button
function buildRatingButton(rating, ratingRange) {
  let className = 'rating-' + rating + ratingRange
  const button = $('<div></div>').addClass('settings-bar__fields__item').addClass(className)
  const buttonName = $('<div></div>').addClass('small-text-normal').text(getTitle(rating, ratingRange))

  button.on('click', function () {
    CURRENT_CLICK_CLASS = className
  })

  button.append(buttonName)
  return button
}

// Get title to rating button
function getTitle(rating, ratingRange) {
  switch (ratingRange) {
    case 2:
      switch (rating) {
        case 0:
          return "Unavailable"

        case 1:
          return "Available"

        default:
          break
      }
      break

    case 3:
      switch (rating) {
        case 0:
          return "Unavailable"

        case 1:
          return "Uncertain"

        case 2:
          return "Available"

        default:
          break
      }
      break

    case 4:
      switch (rating) {
        case 0:
          return "Unavailable"

        case 1:
          return "Likely Unavailable"

        case 2:
          return "Likely Available"

        case 3:
          return "Available"

        default:
          break
      }
      break

    case 4:
      switch (rating) {
        case 0:
          return "Unavailable"

        case 1:
          return "Likely Unavailable"

        case 2:
          return "Uncertain"

        case 3:
          return "Likely Available"

        case 4:
          return "Available"

        default:
          break
      }
      break

    default:
      break
  }
}