const phin = require("phin")

const readline = require("readline")

const LOGIN = "https://www.brick-hill.com/login"

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function getToken(body) {
    let token = body.match('<meta name="csrf-token" content="(.+)">')
    return token[1]
}

async function loginAccount(username, password) {
        // Visit the login page to set our tokens
        const homepage = await phin({url: LOGIN})

        // Get the XSRF token
        const token = getToken(homepage.body.toString())

        const login = await phin({
            url: LOGIN,
            method: "POST",
            headers: {
                "Cookie": homepage.headers["set-cookie"].join("; ") // big brain time
            },
            form: {
                _token: token,
                username: username,
                password: password
            }
        })
        if (login.headers.location === "https://www.brick-hill.com") {
            return Promise.resolve(true)
        } else {
            throw new Error(`Invalid account credentials for ${username}.`)
        }
}

console.log("Log in to your Brick Hill account.")

rl.question("Username: ", (username) => {
    rl.question("Password: ", (password) => {
        loginAccount(username, password)
            .then(() => {
                console.log(`Successfully logged in to ${username}.`)
                process.exit(0)
            })
            .catch((err) => {
                console.error(err.stack)
                process.exit(1)
            })
    })
})