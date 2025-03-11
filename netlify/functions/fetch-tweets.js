const fetch = require('node-fetch');

exports.handler = async (event) => {
    // Replace with your Bearer Token from developer.x.com
    const bearerToken = "AAAAAAAAAAAAAAAAAAAAAN1RzwEAAAAAzcftGFGkktMo2AR5ze2sEQWlkdo%3DHYBbEfj15kKq3MeL5krBZvZGFThUWYRVgzdhxoeGezdgHgJruJ";

    // v2 endpoint for authenticated user's tweets
    const url = "https://api.twitter.com/2/users/me/tweets?max_results=5&tweet.fields=created_at";

    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${bearerToken}`
            }
        });
        const data = await response.json();
        if (!data || data.errors) {
            throw new Error(data?.errors?.[0]?.message || "No data returned");
        }
        const posts = data.data.map(tweet => ({
            text: tweet.text,
            link: `https://twitter.com/bitkoinafrika/status/${tweet.id}`, // Your handle
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
