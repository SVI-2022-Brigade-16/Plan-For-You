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

function create_new_plan() { }


function delete_plan() {

}

