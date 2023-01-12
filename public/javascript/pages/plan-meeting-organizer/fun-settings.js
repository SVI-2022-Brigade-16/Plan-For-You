/* Initial settings load */

function loadSettings() {
  $("#week-count option[value='" + weekCount + "']").attr('selected', 'selected')
  $("#timeslot-length option[value='" + timeslotLength + "']").attr("selected", "selected")
  $("#start-time").val(startTime)
  $("#rating-max option[value='" + ratingMax + "']").attr("selected", "selected")
  updatePublishingButton()
  addUpdateListener()
}


/* Update */

// Add click event on update button
function addUpdateListener() {
  $('#update-settings').click(async function () {
    await updateSettings()
    reloadPage()
  })
}

// Update plan settings through API
async function updateSettings() {
  const planName = $('#plan-name').val()
  const weekCount = parseInt($('#week-count').val())
  const timeslotLength = parseInt($('#timeslot-length').val())
  const startTime = parseInt($('#start-time').val())
  const ratingMax = parseInt($('#rating-max').val())

  await $.ajax({
    url: "/api/plan/meeting/" + planUuid,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify({
      "blockedTimeslots": getBlockedTimeslots(),
      "planName": planName,
      "weekCount": weekCount,
      "timeslotLengthMinutes": timeslotLength,
      "startTimeMinutes": startTime,
      "ratingMax": ratingMax,
    }),
  })
}


/* Publishing */

// Publish/unpublish plan answer form
function togglePublishLink() {
  receivingAnswers = !receivingAnswers
  updatePublishingButton()
  changePublishStateAjax()
}

// Update plan publishing button look
function updatePublishingButton() {
  var eyeIcon = $('#eye_icon')
  var publishButtonText = $('#publish-button-text')

  if (receivingAnswers) {
    eyeIcon.attr('src', PUBLISHED_ICON_PATH)
    publishButtonText.text("Unpublish link")
  } else {
    eyeIcon.attr('src', UNPUBLISHED_ICON_PATH)
    publishButtonText.text("Publish link")
  }
}

// Update plan publishing state through API
async function changePublishStateAjax() {
  updateSettings().then(function () {
    $.ajax({
      url: "/api/plan/meeting/" + planUuid + "/publish/" + (0 + receivingAnswers),
      type: "POST",
      contentType: "application/json"
    })
  })
}


/* Conditions */

// Remove all blocked timeslots
function unblockAllTimeslots() {
  timeslots = $('.schedule .day__timeslots__item')
  timeslots.addClass('rating-unblocked')
  timeslots.removeClass('rating-blocked')
}

// Get all blocked timeslots in {dayNum, timeslotNum} format for API call
function getBlockedTimeslots() {
  var blockedTimeslots = []
  $('.day__timeslots__item.rating-blocked').each(function () {
    day_timeslot = $(this).attr('id').split('-')
    blockedTimeslots.push({
      dayNum: parseInt(day_timeslot[0]),
      timeslotNum: parseInt(day_timeslot[1])
    })
  })
  return blockedTimeslots
}
