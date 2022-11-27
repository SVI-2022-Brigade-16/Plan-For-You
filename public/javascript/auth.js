function saveToken(token) {
  localStorage.setItem('accessToken', token.access_token)
  localStorage.setItem('refreshToken', token.refresh_token)
}

async function auth() {
  return await $.ajax({
    url: "/auth/signin",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      "login": $("#login").val(),
      "password": $("#password").val()
    }),
    success: function (response) {
    }
  })
}

$("#auth").on("submit", async function (e) {
  e.preventDefault()
  await auth()
})