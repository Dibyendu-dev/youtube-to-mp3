document.addEventListener('DOMContentLoaded', function () {
    const convertBtn = document.getElementById('convertBtn');
    const videoUrlInput = document.getElementById('videoUrl');
    const statusMsg = document.getElementById('statusMsg');
    const audioPlayer = document.getElementById('audioPlayer');

    convertBtn.addEventListener('click', async function () {
        const videoUrl = videoUrlInput.value.trim();

        if (!videoUrl) {
            statusMsg.innerText = 'Please enter a YouTube video URL';
            statusMsg.style.color = 'red';
            statusMsg.style.display = 'block';
            return;
        }

        // Send a POST request to server
        const response = await fetch('/convert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ videoUrl })
        });

        const data = await response.json();

        if (data.success) {
            statusMsg.innerText = 'Conversion successful. Click to play MP3.';
            statusMsg.style.color = 'green';
            statusMsg.style.display = 'block';
            audioPlayer.src = data.mp3Url;
            audioPlayer.style.display = 'block';
        } else {
            statusMsg.innerText = data.message || 'Error converting video to MP3';
            statusMsg.style.color = 'red';
            statusMsg.style.display = 'block';
        }
    });
});
