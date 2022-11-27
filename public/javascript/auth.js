function saveToken(token) {
    localStorage.setItem('accessToken', token.access_token)
    localStorage.setItem('refreshToken', token.refresh_token)
}

async function auth() {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: "/auth/signin",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                "login": $("#login").val(),
                "password": $("#password").val()
            }),
            success: function(response) {
                // if (response.status == "FIELD_ERROR") {
                //     alert("Incorrect credentials format")
                //     return
                // }
                // if (response.status == "WRONG_CREDENTIALS_ERROR") {
                //     alert("Incorrect login or password")
                //     return
                // }
                // saveToken(response); // сохраняем полученный обновленный токен в sessionStorage, с помощью функции, заданной ранее
                // $.ajax({
                //     url: "/view/user/home",
                //     type: "GET",
                //     beforeSend: function(xhr) {
                //         xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));
                //     },
                //     success: function(responce) {
                //         location.href = '/view/user/home';
                //     }
                // }
                //);

            }
        })
    })
}

$("#auth").on("submit", async function(e) {
    e.preventDefault()
    const result = await auth()
})