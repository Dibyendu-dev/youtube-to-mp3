const express = require('express'); // Import the Express framework
const bodyParser = require('body-parser'); // Middleware to parse JSON bodies
const { exec } = require('child_process'); // For executing shell commands
const fs = require('fs'); // For file system operations
const ytdl = require('ytdl-core'); // For downloading YouTube videos
const readline = require('readline'); // For reading input from the terminal

const app = express(); // Initialize Express
const PORT = 3000; // Define the port for the server to listen on

app.use(bodyParser.json()); // Middleware to parse JSON bodies
app.use(express.static('public')); // Middleware to serve static files from the public directory

// Set up readline interface for terminal input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Prompt function to ask for YouTube video URL
function askForVideoURL() {
    rl.question('Enter YouTube video URL: ', async (videoUrl) => {
        // Validate the video URL
        if (!videoUrl || !ytdl.validateURL(videoUrl)) {
            console.log('Invalid YouTube URL. Please try again.');
            askForVideoURL(); // Ask again if URL is invalid
            return;
        }

        // Retrieve video information from YouTube
        const videoInfo = await ytdl.getInfo(videoUrl);

        // Filter for audio-only formats
        const audioFormats = ytdl.filterFormats(videoInfo.formats, 'audioonly');

        // Download the audio stream
        const audioStream = ytdl.downloadFromInfo(videoInfo, {
            filter: 'audioonly',
            quality: 'highestaudio'
        });

        // Define the file path for the MP3 file
        const filePath = `public/audio.mp3`;

        // Create a write stream to save the audio stream as an MP3 file
        const writeStream = fs.createWriteStream(filePath);

        // Pipe the audio stream to the write stream
        audioStream.pipe(writeStream);

        // Event handler for when the writing process finishes
        writeStream.on('finish', () => {
            console.log('Video conversion completed.');
            console.log(`MP3 file saved as ${filePath}`);
            rl.close(); // Close readline interface
        });
    });
}

// Endpoint to handle POST requests for video conversion
app.post('/convert', async (req, res) => {
    // This endpoint is not used for interactive input
    res.status(404).send('Not found');
});

// Start the server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    askForVideoURL(); // Start prompting for video URL after server starts
});
