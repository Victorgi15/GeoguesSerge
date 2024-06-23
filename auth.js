window.userToken = null
game_container.hidden = true

document.addEventListener('DOMContentLoaded', function (event) {
    const signUpForm = document.querySelector('#sign-up')
    signUpForm.onsubmit = signUpSubmitted.bind(signUpForm)

    const logInForm = document.querySelector('#log-in')
    logInForm.onsubmit = logInSubmitted.bind(logInForm)

    const logoutButton = document.querySelector('#logout-button')
    logoutButton.onclick = logoutSubmitted.bind(logoutButton)
})

db_client.auth.onAuthStateChange((event, session) => {
    setTimeout(async () => {
        if (event === 'SIGNED_IN') {
            game_container.hidden = false;
            map_container.hidden = false;
            auth_container.hidden = true;
        } else if (event === 'SIGNED_OUT') {
            game_container.hidden = true;
            map_container.hidden = true;
            auth_container.hidden = false;
        }
    }, 0)
});


const signUpSubmitted = (event) => {
    event.preventDefault()
    const email = event.target[0].value
    const password = event.target[1].value

    db_client.auth
        .signUp({email, password})
        .then((response) => {
            response.error ? alert(response.error.message) : setToken(response)
        })
        .catch((err) => {
            alert(err)
        })
}

const logInSubmitted = (event) => {
    event.preventDefault()
    const email = event.target[0].value
    const password = event.target[1].value

    db_client.auth
        .signInWithPassword({email, password})
        .then((response) => {
            response.error ? alert(response.error.message) : setToken(response)
        })
        .catch((err) => {
            alert(err.response.text)
        })
}


const logoutSubmitted = (event) => {
    event.preventDefault()

    db_client.auth
        .signOut()
        .then((_response) => {
            document.querySelector('#access-token').value = ''
            document.querySelector('#refresh-token').value = ''
            alert('Logout successful')
        })
        .catch((err) => {
            alert(err.response.text)
        })
}

function setToken(response) {
    document.querySelector('#access-token').value = response.data.session.access_token
    document.querySelector('#refresh-token').value = response.data.session.refresh_token
    alert('Logged in as ' + response.data.user.email)
}