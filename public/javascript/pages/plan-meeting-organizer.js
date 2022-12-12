// Show plan conditions in existing schedule table
async function loadBlockedTimeslots() {
  data = await $.ajax({
    url: "/api/plan/meeting/" + planUuid + "/answer/conditions"
  })
  data.blockedTimeslots.forEach((timeslot) => {
    found = $('#' + getTimeslotId(timeslot.dayNum, timeslot.timeslotNum))
    found.removeClass('rating-unblocked').addClass('rating-blocked')
  })
}

// Show plan answer in existing schedule table
async function loadAnswer(answerId) {
  data = await $.ajax({
    url: "/api/plan/meeting/" + planUuid + "/answer/" + answerId,
    type: "GET",
    success: function (data) {
      console.log(data)
    }
  })
  data.ratedTimeslots.forEach((timeslot) => {
    found = $('#' + getTimeslotId(timeslot.dayNum, timeslot.timeslotNum))
    found.addClass('rating-' + ratingMax + '-' + timeslot.rating)
    if (timeslot.rating != ratingMax) {
      found.removeClass('rating-' + ratingMax + '-' + ratingMax)
    }
  })
}

// Show plan result in existing schedule table
async function loadScheduleResult() {
  data = await $.ajax({
    url: "result"
  })
}


async function updateConditions() {
  await $.ajax({
    url: "/api/plan/meeting/" + planUuid,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify({
      "participantName": $("#name").val(),
    }),
  })
}

async function changePublishStateAjax(state) {
  await $.ajax({
    url: "/api/plan/meeting/" + planUuid + "/publish/" + state,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      "receivingAnswers": state,
    }),
  })
}

function togglePublishLink() {
  var eyeIcon = $('#eye_icon')[0]
  var publishButtonText = $('#publish-button-text')
  console.log(eyeIcon.src, publishButtonText)
  if (eyeIcon.src.indexOf("/img/eye_opened_icon.svg") != -1) {
    eyeIcon.src = "/img/eye_closed_icon.svg"
    publishButtonText.text("Publish link")
    changePublishStateAjax(1)
  } else {
    eyeIcon.src = "/img/eye_opened_icon.svg"
    publishButtonText.text("Unpublish link")
    changePublishStateAjax(0)
  }
}

function unblockAllTimeslots() {
  timeslots = $('.schedule .day__timeslots__item')
  timeslots.addClass('rating-unblocked')
  timeslots.removeClass('rating-blocked')
}

function updateSettings() {
  weekCount = parseInt($('#week-count').val())
  timeslotLength = parseInt($('#timeslot-length').val())
  startTime = parseInt($('#start-time').text())
  buildScheduleTable(weekCount, timeslotLength, startTime)
}

function loadSettings() {
  $("#week-count option[value='" + weekCount + "']").attr('selected', 'selected')
  $("#timeslot-length option[value='" + timeslotLength + "']").attr("selected", "selected")
  $("#start-time").text(startTime)
  $("#rating-max option[value='" + ratingMax + "']").attr("selected", "selected")
}

function loadSchedule() {
  buildScheduleTable(weekCount, timeslotLength, startTime)
  loadBlockedTimeslots()
  enableTimeslotRatingSelect('block')
}

function addTabSwitch() {
  $('.schedule-viewer__tabs__item').click(function () {
    $('.schedule-viewer__tabs__item.selected').removeClass('selected')
    $(this).addClass('selected')
  })
  addAnswerSwitch()
  addConditionsSwitch()
}

function addAnswerSwitch() {
  $('.schedule-viewer__tabs__item.answer').click(function (e) {
    for (let rating = 1; rating < ratingMax; rating++) {
      $('.day__timeslots__item.rating-' + ratingMax + '-' + rating).addClass('rating-' + ratingMax + '-' + ratingMax).removeClass('rating-' + ratingMax + '-' + rating)
    }
    $('.day__timeslots__item.rating-unblocked').removeClass('rating-unblocked')
    $('.day__timeslots__item').unbind()
    console.log(e.currentTarget.id)
    const answerId = e.currentTarget.id.split('-')[1]
    loadAnswer(answerId)
  })
}

function addConditionsSwitch() {
  $('.schedule-viewer__tabs__item.blocked-timeslots').click(function () {
    for (let rating = 1; rating <= ratingMax; rating++) {
      $('.day__timeslots__item.rating-' + ratingMax + '-' + rating).add('rating-unblocked').removeClass('rating-' + ratingMax + '-' + rating)
    }
    enableTimeslotRatingSelect('block')
  })
}

window.onload = function () {
  loadSettings()
  TIMESLOT_HEIGHT = timeslotLength / 2 + 'px'
  loadSchedule()
  addTabSwitch()
}