const sendToken = (user, status, res) => {
    const token = user.getSignedJwt()
    const options = {
        expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000)),
        httpOnly: true
    }

    if (process.env.NODE_ENV == 'prod') {
        options.seure = true
    }

    res.status(status).cookie('token', token, options).json({
        success: true,
        token
    })
}

export { sendToken }