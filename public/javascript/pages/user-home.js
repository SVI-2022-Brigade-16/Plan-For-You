function sign_out_Ajax() {
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

async function sign_out() {
  await sign_out_Ajax()
}

function create_new_plan() {
  return new Promise(function () {
    $.ajax({
      url: "/api/plan/meeting",
      type: "POST",
      contentType: "application/json",
      success: function (response) {
        location.href = "/view/plan/meeting/" + response.planUuid

      }
    })
  })
}


function delete_plan(u) {
  confirm_ = confirm('Are you sure you want to delete this plan?');
  if (confirm_) {
    $.ajax({
      url: '/api/plan/meeting/' + u.substring(7),
      type: "DELETE",
      success: function () {
        alert("Meeting plan successfully deleted!");
        window.location.reload();
      }
    });
  }
}

