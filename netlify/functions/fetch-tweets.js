const fetch = require('node-fetch');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

exports.handler = async (event) => {
    const handle = event.queryStringParameters.handle || "bitkoinafrika"; // Replace with your handle, e.g., "MyTestAccount"

    const oauth = OAuth({
        consumer: { key: "H8cAZfm1j7T4YtPgEc8oOZDn7", secret: "7AAhIBTYOQGB3YEtlWr3FbK3vI37AzeSOlw6zoTWVioBpUuiVz" },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
            return crypto.createHmac('sha1', key).update(base_string).digest('base64');
        }
    });

    const token = {
        key: "968073041568845827-HLBtJgES8xifZeBrEQci6Uab9UXYEkJ",
        secret: "VKbNCiPB5cy6oZXfOpBBYZacanaX61P2B5SkNdbf7k9Ic"
    };

    const url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${handle}&count=5`;
    const authHeader = oauth.toHeader(oauth.authorize({ url, method: 'GET' }, token));

    try {
        const response = await fetch(url, {
            headers: { "Authorization": authHeader["Authorization"] }
        });
        const data = await response.json();
        const posts = data.map(tweet => ({
            text: tweet.text,
            link: `https://twitter.com/${handle}/status/${tweet.id_str}`,
            time: new Date(tweet.created_at).toLocaleString()
        }));
        return {
            statusCode: 200,
            body: JSON.stringify(posts)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch tweets" })
        };
    }
};
