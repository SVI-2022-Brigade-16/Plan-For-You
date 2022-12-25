const PUBLISHED_ICON_PATH = "/img/eye_opened_icon.svg"
const UNPUBLISHED_ICON_PATH = "/img/eye_closed_icon.svg"

const MODAL = $modal();
const RATED_TIMESLOTS = new Map();

function ratingClassPrefix() {
  return 'rating-' + ratingMax + '-'
}

var RATING_CLASS_PREFIX = ratingClassPrefix()

function ratingMaxClass() {
  return RATING_CLASS_PREFIX + ratingMax
}

var RATING_MAX_CLASS = ratingMaxClass()

function ratingClass(rating) {
  return RATING_CLASS_PREFIX + rating
}

// Show plan conditions in existing schedule table
async function loadBlockedTimeslots() {
  let data = await $.ajax({
    url: "/api/plan/meeting/" + planUuid + "/answer/conditions"
  })
  data.blockedTimeslots.forEach((timeslot) => {
    found = $('#' + getTimeslotId(timeslot.dayNum, timeslot.timeslotNum))
    found.removeClass('rating-unblocked').addClass('rating-blocked')
  })
}

// Show plan answer in existing schedule table
async function loadAnswer(answerId) {
  let data = await $.ajax({
    url: "/api/plan/meeting/" + planUuid + "/answer/" + answerId,
    type: "GET",
    success: function (data) {
      console.log(data)
    }
  })
  data.ratedTimeslots.forEach((timeslot) => {
    found = $('#' + getTimeslotId(timeslot.dayNum, timeslot.timeslotNum))
    found.addClass(ratingClass(timeslot.rating))
    if (timeslot.rating != ratingMax) {
      found.removeClass(RATING_MAX_CLASS)
    }
  })
}

// Show plan result in existing schedule table
async function loadResult() {
    let data = await $.ajax({
        url: "/api/plan/meeting/" + planUuid + "/result",
        type: "GET"
    })
    const answerCount = data.answerCount
    data.sortedTotalRatedTimeslots.forEach((timeslot) => {
        found = $('#' + getTimeslotId(timeslot.dayNum, timeslot.timeslotNum))
        found.addClass(ratingClass(Math.floor(timeslot.rating / answerCount)))

        if (timeslot.lowerThanMaxRatings.length != 0) {
            found.addClass("rated-timeslot-modal")
            RATED_TIMESLOTS.set(getTimeslotId(timeslot.dayNum, timeslot.timeslotNum), timeslot)
            found.on("mouseover", function(e) {
                timeslot = RATED_TIMESLOTS.get(e.target.id)
                if (timeslot) {
                    MODAL.setTitle("<div class='small-text-bold'>Low ratings from:</div>")
                    lower_text = "<div>"
                        // Добавляем ответы для всплывающего окна
                    timeslot.lowerThanMaxRatings.forEach(answer => {
                        lower_text += "<p class=small-text-normal>" + answer.participantName + ': ' + answer.rating + "</p>"
                    });
                    lower_text += "</div>"
                    MODAL.setContent(lower_text)
                    MODAL.show(e)
                }
            })
            found.on("mouseleave", function(e) { MODAL.hide(e) })
        }
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

async function changePublishStateAjax() {
  await $.ajax({
    url: "/api/plan/meeting/" + planUuid + "/publish/" + (0 + receivingAnswers),
    type: "POST",
    contentType: "application/json"
  })
}

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

function togglePublishLink() {
  receivingAnswers = !receivingAnswers
  updatePublishingButton()
  changePublishStateAjax()
}

function unblockAllTimeslots() {
  timeslots = $('.schedule .day__timeslots__item')
  timeslots.addClass('rating-unblocked')
  timeslots.removeClass('rating-blocked')
}

function getBlockedTimeslots() {
  var blockedTimeslots = []
  $('.day__timeslots__item.rating-blocked').each(function () {
    day_timeslot = $(this).attr('id').split('-')
    console.log(day_timeslot)
    blockedTimeslots.push({
      dayNum: parseInt(day_timeslot[0]),
      timeslotNum: parseInt(day_timeslot[1])
    })
  })
  return blockedTimeslots
}

async function updateSettings() {
  const planName = $('#plan-name').val()
  const weekCount = parseInt($('#week-count').val())
  const timeslotLength = parseInt($('#timeslot-length').val())
  const startTime = parseInt($('#start-time').text())
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

  console.log({
    "blockedTimeslots": getBlockedTimeslots(),
    "planName": planName,
    "weekCount": weekCount,
    "timeslotLengthMinutes": timeslotLength,
    "startTimeMinutes": startTime,
    "ratingMax": ratingMax,
  })

  window.location.reload()
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
  addResultSwitch()
}

function removeRatingClasses() {
  for (let rating = 1; rating <= ratingMax; rating++) {
    let ratingC = ratingClass(rating)
    $('.day__timeslots__item.' + ratingC).removeClass(ratingC)
  }
}

function addResultSwitch() {
  $('#read-result').click(function (e) {
    removeRatingClasses()
    $('#result-tab').removeClass('display-none').click()
    $('.day__timeslots__item.rating-unblocked').removeClass('rating-unblocked')
    $('.day__timeslots__item').unbind()
    console.log(e.currentTarget.id)
    const answerId = e.currentTarget.id.split('-')[1]
    loadResult(answerId)
    $('.schedule-viewer__buttons__unblock').prop('disabled', true)
  })
  $('#result-tab').click(function (e) {
    removeRatingClasses()
    $('.day__timeslots__item.rating-unblocked').removeClass('rating-unblocked')
    $('.day__timeslots__item').unbind()
    console.log(e.currentTarget.id)
    const answerId = e.currentTarget.id.split('-')[1]
    loadResult(answerId)
    $('.schedule-viewer__buttons__unblock').prop('disabled', true)
  })
}

function addAnswerSwitch() {
  $('.schedule-viewer__tabs__item.answer').click(function (e) {
    removeRatingClasses()
    $('.day__timeslots__item.rating-unblocked').removeClass('rating-unblocked')
    $('.day__timeslots__item').unbind()
    $('.day__timeslots__item:not(.rating-blocked)').addClass(RATING_MAX_CLASS)
    console.log(e.currentTarget.id)
    const answerId = e.currentTarget.id.split('-')[1]
    loadAnswer(answerId)
    $('.schedule-viewer__buttons__unblock').prop('disabled', true)
  })
}

function addConditionsSwitch() {
  $('.schedule-viewer__tabs__item.blocked-timeslots').click(function () {
    removeRatingClasses()
    $('.day__timeslots__item:not(.rating-blocked)').addClass('rating-unblocked')
    enableTimeslotRatingSelect('block')
    $('.schedule-viewer__buttons__unblock').prop('disabled', false)
  })
}

function addUpdateListener() {
  $('#update-settings').click(function () {
    updateSettings()
  })
}

window.onload = function () {
  loadSettings()
  TIMESLOT_HEIGHT = (timeslotLength / 3 > 30 ? timeslotLength / 3 : 30) + 'px'
  loadSchedule()
  addTabSwitch()
  updatePublishingButton()
  addUpdateListener()
}