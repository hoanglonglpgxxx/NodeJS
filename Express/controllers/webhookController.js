const https = require('https');

exports.sendToDiscord = (req, res, next) => {
    const postData = JSON.stringify({
        content: [req.requestTime, req.method, req.originalUrl, res.statusCode, JSON.stringify(req.body)].join('    ')
    });

    const discordWebhookUrl = process.env.DISCORD_CALL_API_WEBHOOK;

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
};