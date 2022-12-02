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
        success: function(response) {
            window.location.href = "/view/user/home"
        }
    })
}

$("#auth").on("submit", async function(e) {
    e.preventDefault()
    await auth()
})

function switch_to_login() {
    $("#register").removeClass("chosen")
    $("#login").addClass("chosen")
    $(".form__enter__button__text").text("Sing in")
}

function switch_to_register() {
    $("#login").removeClass("chosen")
    $("#register").addClass("chosen")
    $(".form__enter__button__text").text("Register")

}