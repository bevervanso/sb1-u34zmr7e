(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const a of t.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function i(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}})();document.querySelector("#app").innerHTML=`
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
`;const l=document.querySelector("#urlInput"),d=document.querySelector("#pasteBtn"),c=document.querySelector("#downloadBtn"),s=document.querySelector("#result");d.addEventListener("click",async()=>{try{const o=await navigator.clipboard.readText();l.value=o}catch(o){console.error("Failed to read clipboard:",o)}});c.addEventListener("click",async()=>{const o=l.value.trim();if(!o){s.innerHTML='<p class="error">Please enter a valid Instagram URL</p>';return}try{s.innerHTML='<p class="processing">Processing...</p>';const r=await fetch("/api/download",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:o})}),n=await r.json();r.ok?s.innerHTML=`
        <div class="success-result">
          <img src="${n.thumbnailUrl}" alt="Video thumbnail" class="thumbnail" />
          <h3>${n.title||"Instagram Video"}</h3>
          <a href="${n.downloadUrl}" 
             class="download-link" 
             download="instagram-video.mp4"
             target="_blank">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Video
          </a>
        </div>
      `:s.innerHTML=`<p class="error">${n.error}</p>`}catch(r){s.innerHTML=`<p class="error">Error: ${r.message}</p>`}});
