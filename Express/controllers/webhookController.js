const https = require('https');

exports.sendToDiscord = (req, res, next) => {
    const headers = JSON.parse(JSON.stringify(req.headers));
    delete headers.connection;
    delete headers['accept-encoding'];
    delete headers['postman-token'];
    delete headers.accept;

    console.log(12312312);

    const body = { ...req.body };
    if (Object.prototype.hasOwnProperty.call(body, 'password')) {
        delete body.password;
        Object.assign(body, { JWT: res.token });
    }

    const postData = JSON.stringify({
        content: `${new Date(req.requestTime).toLocaleString()}    ${req.method}    ${req.originalUrl}    ${res.statusCode}    ${JSON.stringify(body)}    ${JSON.stringify(headers)}`
    });

    const discordWebhookUrl = process.env.DISCORD_WEBHOOK;

    const options = {
        hostname: 'discord.com',
        path: `/api/webhooks/${discordWebhookUrl}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length,
        },
    };

    // Create HTTP request
    const reqToDiscord = https.request(options, (resFromDiscord) => {
        console.log(`statusCode: ${resFromDiscord.statusCode}`);
        resFromDiscord.on('data', (d) => {
            process.stdout.write(d);
        });
    });

    // Handle errors
    reqToDiscord.on('error', (error) => {
        console.error(error);
        //res.status(500).send('Error sending message to Discord');
    });

    // Write data to request body
    reqToDiscord.write(postData);
    reqToDiscord.end();
    next();
};