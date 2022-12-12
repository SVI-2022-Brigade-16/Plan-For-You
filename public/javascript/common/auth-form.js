const AUTH_FORM_REGISTER_OFFSET_CLASS = 'auth-form-register-offset'
const CHOSEN_CLASS = 'chosen'
const SIGN_IN = 'sign-in'
const REGISTER = 'register'
const USER_HOME_ENDPOINT = "/view/user/home"

var FORM_MODE = SIGN_IN

async function signIn() {
  return await $.ajax({
    url: "/auth/signin",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      "login": $("#login").val(),
      "password": $("#password").val()
    }),
    success: function (response) {
      location.href = USER_HOME_ENDPOINT
    },
    error: function (e) {
      if (e.responseJSON.credentialErrorType == "login") {
        $("#login-error").text("User with this login doesn't exist!")
        return
      }
      if (e.responseJSON.credentialErrorType == "password") {
        $("#password-error").text("Wrong password!")
        return
      }
    }
  })
}

async function register() {
  return await $.ajax({
    url: "/auth/signup",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      "nickname": $("#nickname").val(),
      "login": $("#login").val(),
      "password": $("#password").val()
    }),
    success: function (response) {
      location.href = USER_HOME_ENDPOINT
    },
    error: function (e) {
      if (e.responseJSON.credentialErrorType == "login-taken") {
        $("#login-error").text("User with this login already exists!")
        return
      }
    }
  })
}

$("#auth-form").on("submit", async function (e) {
  e.preventDefault()
  $("#login-error").text("")
  $("#password-error").text("")
  if (FORM_MODE == SIGN_IN) {
    await signIn()
  } else {
    await register()
  }
})


function switchToSignIn() {
  FORM_MODE = SIGN_IN
  $("#nickname-section").hide()
  $('#nickname').removeAttr('required')
  $("#auth-form").removeClass(AUTH_FORM_REGISTER_OFFSET_CLASS)
  $("#register-choice").removeClass(CHOSEN_CLASS)
  $("#sign-in-choice").addClass(CHOSEN_CLASS)
  $(".auth-form__enter__button__text").text("Sign in")
}

function switchToRegister() {
  FORM_MODE = REGISTER
  $("#nickname-section").css('display', 'flex')
  $('#nickname').attr('required', 'required')
  $("#auth-form").addClass(AUTH_FORM_REGISTER_OFFSET_CLASS)
  $("#sign-in-choice").removeClass(CHOSEN_CLASS)
  $("#register-choice").addClass(CHOSEN_CLASS)
  $(".auth-form__enter__button__text").text("Register")
}