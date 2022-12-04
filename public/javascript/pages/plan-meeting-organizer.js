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

async function signOut() {
  return new Promise(function () {
    $.ajax({
      url: "/auth/signout",
      type: "POST",
      contentType: "application/json",
      success: function () {
        location.href = "/"
      }
    })
  })
}


function publishLink() {
  var eye_icon = document.getElementById("eye_icon");
  var state_link = document.getElementById("state_link");
  if (eye_icon.src === "/img/eyeOpened_icon.svg") {
    eye_icon.src = "/img/eyeClosed_icon.svg";
    state_link.innerHTML = "Unpublish link";
  } else {
    eye_icon.src = "/img/eyeOpened_icon.svg";
    state_link.innerHTML = "Publish link";
  }

}