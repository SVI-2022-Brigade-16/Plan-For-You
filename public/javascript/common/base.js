// Function for timeslot block ids
function getTimeslotId(dayNum, timeslotNum) {
  return dayNum + "-" + timeslotNum
}

function signOutAjax() {
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

async function signOut() {
  await signOutAjax()
}