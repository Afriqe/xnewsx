const fetch = require('node-fetch');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

exports.handler = async (event) => {
    const handle = event.queryStringParameters.handle || "bitkoinafrika";

    const oauth = OAuth({
        consumer: { key: "gzGvFxMtHaHemR3QlRKGzTD9T", secret: "VRPprlaxCqglcqH17uprjJo7GmolX8s0KXy6genLSZCWFYUJPh" },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
            return crypto.createHmac('sha1', key).update(base_string).digest('base64');
        }
    });

    const token = {
        key: "968073041568845827-hU8Ilhq6wSlbEDTmrpI2jtr8L6rY3SE",
        secret: "qfPJAcGdQvhsCbCDo6BYttYSlH1jKxjFzG9pZdhzRSCjC"
    };

    const url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${handle}&count=5`;
    const authHeader = oauth.toHeader(oauth.authorize({ url, method: 'GET' }, token));

    try {
        const response = await fetch(url, {
            headers: { "Authorization": authHeader["Authorization"] }
        });
        const data = await response.json();
        if (!data || data.errors) {
            throw new Error(data?.errors?.[0]?.message || "No data returned");
        }
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
            body: JSON.stringify({ error: `Failed to fetch tweets: ${error.message}` })
        };
    }
};
