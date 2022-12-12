// Build whole rating buttons
function buildRatingButtons(ratingRange) {
  const buttons = $('#rating-buttons')
  for (let rating = 0; rating < ratingRange; ++rating) {
    buttons.append(buildRatingButton(rating, ratingRange))
  }
}

// Build one rating button
function buildRatingButton(rating, ratingRange) {
  let className = 'rating-' + ratingRange + rating
  const button = $('<div></div>').addClass('ratings-header__fields__item').addClass(className)
  const buttonName = $('<div></div>').addClass('small-text-bold').text(getTitle(rating, ratingRange))

  button.on('click', function () {
    CURRENT_CLICK_RATING = className
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

    case 5:
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

// Show plan conditions in existing schedule table
async function loadInitialTimeslots() {
  data = await $.ajax({
    url: "/api/plan/meeting/" + planUuid + "/answer/form"
  })
  $('.day__timeslots__item').addclass('rating-5-5')
  data.blockedTimeslots.forEach((timeslot) => {
    found = $('#' + getTimeslotId(timeslot.dayNum, timeslot.timeslotNum))
    found.removeClass('rating-5-5').addClass('rating-blocked').unbind()
  })
}

async function submitAnswer() {
  return await $.ajax({
    url: "/api/plan/meeting/" + planUuid + "/answer",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      "participantName": $("#name").val(),
    }),
  })
}