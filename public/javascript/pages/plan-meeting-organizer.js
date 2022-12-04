// Show plan conditions in existing schedule table
async function loadConditions() {
  data = await $.ajax({
    url: "/api/plan/meeting/" + planUuid
  })
  $('.day__timeslots__item').addClass('rating-unblocked')
  data.blockedTimeslots.forEach((timeslot) => {
    blockedTimeslot = $('#' + getTimeslotId(timeslot.dayNum, timeslot.timeslotNum))
    blockedTimeslot.removeClass('rating-unblocked').addClass('rating-blocked')
  })
}

// Show plan answer in existing schedule table
async function loadAnswer(answerId) {
  data = await $.ajax({
    url: "answer/" + answerId
  })
}

// Show plan result in existing schedule table
async function loadResult() {
  data = await $.ajax({
    url: "calculate"
  })
}


async function updateConditions() {

}

function togglePublishLink() {
  var eyeIcon = $('#eye_icon')[0]
  var publishButtonText = $('#publish-button-text')
  console.log(eyeIcon.src, publishButtonText)
  if (eyeIcon.src.indexOf("/img/eye_opened_icon.svg") != -1) {
    eyeIcon.src = "/img/eye_closed_icon.svg"
    publishButtonText.text("Publish link")
  } else {
    eyeIcon.src = "/img/eye_opened_icon.svg"
    publishButtonText.text("Unpublish link")
  }
}