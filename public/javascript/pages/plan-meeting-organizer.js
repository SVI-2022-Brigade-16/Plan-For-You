// Show plan conditions in existing schedule table
async function loadConditions() {
  data = await $.ajax({
    url: "/api/plan/meeting/" + planUuid + "/answer/conditions"
  })
  $('.day__timeslots__item').addClass('rating-none')
  data.blockedTimeslots.forEach((timeslot) => {
    blockedTimeslot = $('#' + getTimeslotId(timeslot.dayNum, timeslot.timeslotNum))
    blockedTimeslot.removeClass('rating-none').addClass('rating-blocked')
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