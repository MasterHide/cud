const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Serve static files (frontend)
app.use(express.static('public'));

// Endpoint to fetch user data
app.get('/:uuid', async (req, res) => {
    const { uuid } = req.params; // Extract UUID from the URL path

    if (!uuid) {
        return res.status(400).send('UUID is required');
    }

    try {
        // Fetch traffic data by UUID
        const trafficResponse = await axios.get(`http://x-ui-panel-url/panel/api/inbounds/getClientTrafficsById/${uuid}`);
        const trafficData = trafficResponse.data;

        // Fetch inbound details (e.g., expiration date)
        const inboundResponse = await axios.get(`http://x-ui-panel-url/panel/api/inbounds/get/${uuid}`);
        const inboundData = inboundResponse.data;

        // Send HTML response with the data
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Usage Check Tool</title>
            </head>
            <body>
                <h1>Usage Details</h1>
                <p><strong>Upload:</strong> ${trafficData.upload} MB</p>
                <p><strong>Download:</strong> ${trafficData.download} MB</p>
                <p><strong>Expiration Date:</strong> ${inboundData.expiryDate}</p>
            </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send('Failed to fetch user data');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
