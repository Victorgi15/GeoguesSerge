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


const signUpSubmitted = async (event) => {
    event.preventDefault();
    const email = event.target[0].value;
    const password = event.target[1].value;
    const pseudo = event.target[2].value;

    try {
        const response = await db_client.auth.signUp({ email, password });
        console.log('Sign Up Response:', response);  // Log entire response for debugging

        if (response.error) {
            alert(response.error.message);
            return;
        }

        const user = response.data.user;  // Corrected to access the user object
        if (!user) {
            alert('User creation failed. No user returned.');
            return;
        }

        // Adding the pseudo in the user_pseudo table
        const { error } = await db_client.from('user_pseudo').insert([{ user_uuid: user.id, user_pseudo: pseudo }]);
        if (error) {
            alert('Erreur lors de l\'ajout du pseudo : ' + error.message);
        } else {
            setToken(response);
        }
    } catch (err) {
        console.error('Sign Up Error:', err);
        alert('Erreur lors de la création du compte: ' + err.message);
    }
};


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
        })
        .catch((err) => {
            alert(err.response.text)
        })
}

function setToken(response) {
    const session = response.data.session;
    if (!session) {
        alert('No session data available.');
        return;
    }

    const accessTokenInput = document.querySelector('#access-token');
    const refreshTokenInput = document.querySelector('#refresh-token');

    if (accessTokenInput && refreshTokenInput) {
        accessTokenInput.value = session.access_token;
        refreshTokenInput.value = session.refresh_token;
    } else {
        alert('Token inputs not found in DOM.');
    }
}

