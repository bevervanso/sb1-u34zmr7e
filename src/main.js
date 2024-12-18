import './style.css';

document.querySelector('#app').innerHTML = `
  <div class="container">
    <a href="/" class="logo">InstagramDL</a>
    
    <div class="main-content">
      <h1>Instagram Video Download</h1>
      <p>Download Video Instagram, Photo, Reels, Stories, IGTV online</p>
      
      <div class="input-group">
        <input type="text" id="urlInput" placeholder="Paste URL Instagram" />
        <button class="paste-btn" id="pasteBtn">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Paste
        </button>
        <button class="download-btn" id="downloadBtn">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
      </div>
      
      <div id="result"></div>
    </div>
  </div>
`;

// UI Elements
const urlInput = document.querySelector('#urlInput');
const pasteBtn = document.querySelector('#pasteBtn');
const downloadBtn = document.querySelector('#downloadBtn');
const result = document.querySelector('#result');

// Paste functionality
pasteBtn.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    urlInput.value = text;
  } catch (err) {
    console.error('Failed to read clipboard:', err);
  }
});

// Download functionality
downloadBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  
  if (!url) {
    result.innerHTML = '<p class="error">Please enter a valid Instagram URL</p>';
    return;
  }

  try {
    result.innerHTML = '<p class="processing">Processing...</p>';
    
    const response = await fetch('/api/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();
    
    if (response.ok) {
      result.innerHTML = `
        <div class="success-result">
          <img src="${data.thumbnailUrl}" alt="Video thumbnail" class="thumbnail" />
          <h3>${data.title || 'Instagram Video'}</h3>
          <a href="${data.downloadUrl}" 
             class="download-link" 
             download="instagram-video.mp4"
             target="_blank">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Video
          </a>
        </div>
      `;
    } else {
      result.innerHTML = `<p class="error">${data.error}</p>`;
    }
  } catch (error) {
    result.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
});