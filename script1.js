(function() {
    async function deriveKeyFromPassword(password) {
        const encoder = new TextEncoder();
        const salt = encoder.encode(roomID)
        const baseKey = await window.crypto.subtle.importKey(
            "raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]
        );
        const derivedBits = await window.crypto.subtle.deriveBits(
            { name: "PBKDF2", salt, iterations: 600000, hash: "SHA-256" },
            baseKey, 256
        );
        return new Uint8Array(derivedBits);
    }
    async function sha256(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
const toggleStorageBtn = document.getElementById('toggleStorage');
let useLocalStorage = false; 
if (localStorage.getItem('useLocalStorage') === 'true') {
  useLocalStorage = true;
  toggleStorageBtn.textContent = 'Disable localStorage';
} else {
  toggleStorageBtn.textContent = 'Enable localStorage (less anonymity)';
}
const fileInput = document.getElementById('fileInput')
fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0]
 if (!file) return;
    if (file.size > 45000) { 
    alert("File too large! 45KB Limit :(. Sorry!");
    return;
}
  const reader = new FileReader()
  reader.onload = async () => {
    const base64Data = reader.result
    const username = document.getElementById('enterName').value || 'anon'
    const rawMessage = `${username}: [MEDIA FILE]\n${base64Data}`
    
       
    try {
      const encrypted = nostrNip44.v2.encrypt(rawMessage, sharedKeyBytes)
      await sendMessage(username, encrypted)
      
      const messageDiv = document.createElement('div')
      messageDiv.classList.add('greentext')
      messageDiv.classList.add('media')
      if (file.type.startsWith('image/')){
        messageDiv.innerHTML = `<p class='usersChat'>${username}:</p><img src='${base64Data}' style='max-width:100%;max-height:300px;'/>`
      } else if (file.type.startsWith('video/')){
        messageDiv.innerHTML = `<p class='usersChat'>${username}:</p><video controls style='max-width:100%; max-height:300px;'><source src='${base64Data}' type='${file.type}'></video>`
      } else {
        messageDiv.innerHTML `<p class='usersChat'>{username} sent file name: ${file.name} </p> `
      }
      messageHub.appendChild(messageDiv)
      messageHub.scrollTop = messageHub.scrollHeight
    } catch (err){
      alert('File failed!')
    }
    fileInput.value = ''
  }
  reader.readAsDataURL(file)
})
let activeStream = null;
document.getElementById('snap').addEventListener('click', async () => {
  document.getElementById('snapMenu').showModal()
  await startLivePreview()
})
let currentFacing = 'user'

document.getElementById('swap').addEventListener('click', async () => {
    if (activeStream) {
        activeStream.getTracks().forEach(t => t.stop());
    }
    
    
    currentFacing = (currentFacing === "user") ? "environment" : "user";
    
    
    await startLivePreview();
});
async function startLivePreview(){
      const video = document.getElementById('webcam');
    const canvas = document.getElementById('viewfinder');
    const ctx = canvas.getContext('2d');
try {
     activeStream = await navigator.mediaDevices.getUserMedia({
       video: {facingMode: currentFacing},
       audio: false
     })
  video.srcObject = activeStream 
  await video.play()
  
  function updateCanvas(){
    if (activeStream && activeStream.active){
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      requestAnimationFrame(updateCanvas)
    }
  }
  updateCanvas()
} catch (err){
  alert('Camera access failed')
}

}
document.getElementById('snap2').addEventListener('click', async () => {
    const canvas = document.getElementById('viewfinder');
    const username = document.getElementById('enterName').value || 'anon';
    
  
    const base64 = canvas.toDataURL('image/jpeg', 0.3);

    // Stop camera hardware
    if (activeStream) {
        activeStream.getTracks().forEach(t => t.stop());
        activeStream = null;
    }
    
    document.getElementById('snapMenu').close();

    try {
        const encrypted = nostrNip44.v2.encrypt(`${username}: [MEDIA FILE]\n${base64}`, sharedKeyBytes);
        await sendMessage(username, encrypted);

        // Local UI update
        const messageDiv = document.createElement('div');
        messageDiv.className = 'greentext';
        messageDiv.innerHTML = `<p class='usersChat'>${username}:</p> <img src="${base64}" class="media" style="max-width:100%; border-radius:5px;" />`;
        messageHub.appendChild(messageDiv);
        messageHub.scrollTop = messageHub.scrollHeight;
    } catch (e) {
        alert("Encryption/Send failed!");
    }
});
let displayText = true
if (displayText){
  mainChat.innerHTML = `<h1 class='remove'>Hello!</h1> <br> 
  <p class='remove'>This is a completely anonymous and encrypted website to host password-protected group chats! </p> <br>
  <p class='remove'>No data-base, backend or login.</p> <br>
  <p class='remove'>Create a room and others can join by entering with the correct name and code.</p> 
  <p class='remove'>Future updates will be logged here, pls enjoy! </p> <br>
  <p class='remove'>Added media and camera functionality! 45KB limit however :( </p>
  <strong> <p class='remove'>If you would like to give feedback or report bugs, <br> go to room: bugbounty with code: bugz. I will check it out!</p> </strong>`
} 
setInterval(() => { 
  if (!displayText){
    document.querySelectorAll('.remove').forEach((r) => {
      r.remove()
    })
  }
}, 500)
document.getElementById('cancel').addEventListener('click', closeModals)
document.getElementById('cancel1').addEventListener('click', closeModals)
document.getElementById('cancel2').addEventListener('click', closeModals)
function closeModals(){
  loadModal.close()
  createModal.close()
  snapMenu.close()
}
toggleStorageBtn.addEventListener('click', () => {
  useLocalStorage = !useLocalStorage;
  localStorage.setItem('useLocalStorage', useLocalStorage);
  toggleStorageBtn.textContent = useLocalStorage ? 'Disable localStorage' : 'Enable localStorage (less anonymity)';

  if (!useLocalStorage) {
    // Clear sensitive data
    localStorage.removeItem('roomID');
    localStorage.removeItem('MASTER_HASH');
  }
});

// Save room info when creating or loading room if enabled
function saveRoomInfo() {
  if (useLocalStorage) {
    localStorage.setItem('roomID', roomID);
    localStorage.setItem('MASTER_HASH', MASTER_HASH);
    localStorage.setItem('allRooms', JSON.stringify(allRooms))
    
  }
}
const buttonDiv = document.getElementById('buttons')
const createButton = document.getElementById('create')
    let authorized = false;
let roomID;
let allRooms = []
let roomCount = 0
let MASTER_HASH;
let hashCheck;
const roomTextA = document.getElementById('gotoRoom')
const passwordTextA = document.getElementById('enterPass')
const enterRoom = document.getElementById('go')
enterRoom.addEventListener('click', async () => {
    const inputRoom = roomTextA.value.trim();
    const inputPass = passwordTextA.value.trim();
   if (inputRoom === '333') {
        if (inputPass === '333') {
            // Clear all messages in the chat area to wipe spam
            messageHub.innerHTML = '';
              seenEventIds.clear();
            // Proceed to join the room normally
            roomID = inputRoom;
            sharedKeyBytes = await deriveKeyFromPassword(inputPass);
            authorized = true;

            // Add the room button for UI consistency
            const button = document.createElement('button');
            button.textContent = inputRoom;
            button.dataset.roomId = inputRoom;
            button.dataset.hash = await sha256(inputPass);
            button.classList.add('button');
            document.getElementById('tittle').textContent = `>${roomID}`;
            buttonDiv.appendChild(button);

            allRooms.push({ id: inputRoom, hash: await sha256(inputPass) });
            saveRoomInfo();

            await loadApp();
            loadModal.close();
            return;  // stop further processing
        } else {
            return alert("Incorrect password for room 333!");
        }}

    if (!inputRoom || !inputPass) return alert("Enter both room and password!");
       
    displayText = false;
    roomID = inputRoom;

   
    sharedKeyBytes = await deriveKeyFromPassword(inputPass);
    
   
    const button = document.createElement('button')
    
   button.textContent = inputRoom; 
    button.dataset.roomId = inputRoom;
      button.dataset.hash = await sha256(inputPass)
     button.classList.add('button')
      document.getElementById('tittle').textContent = `>${roomID}`
     buttonDiv.appendChild(button)
    authorized = true;
    loadApp();
    const roomHash = await sha256(inputPass);
allRooms.push({ id: inputRoom, hash: roomHash }); 
    saveRoomInfo()
    document.querySelectorAll('.remove').forEach(el => el.remove());
    loadModal.close();
});
function renderRooms(){
  const savedRooms = localStorage.getItem('allRooms')
  if (savedRooms && useLocalStorage){
    allRooms = JSON.parse(savedRooms)
    allRooms.forEach(room => {
      const button = document.createElement('button')
      button.textContent = room.id
      button.classList.add('button')
      button.dataset.roomId = room.id 
      button.dataset.hash = room.hash 
      buttonDiv.appendChild(button)
    })
  }
}
renderRooms()
buttonDiv.addEventListener('click', async (event) => {
  const btn = event.target.closest('.button')
  if (!btn) return;
  
  const selectedRoom = btn.dataset.roomId
  const password = prompt(`Enter Password for ${selectedRoom}`)
  const inputHash = await sha256(password)
  if (inputHash === btn.dataset.hash){
    roomID = selectedRoom
    sharedKeyBytes = await deriveKeyFromPassword(password)
    displayText = false
    seenEventIds.clear();
    Object.values(activeSockets).forEach(socket => socket.close());
    mainChat.innerHTML = ''; 
  document.getElementById('tittle').textContent = `>${selectedRoom}`
    loadApp()
  } else {
    alert('Password Failed!')
    return
  }
})
createButton.addEventListener('click', async () => {
    let customRoom = document.getElementById('customRoom')
    let customCode = document.getElementById('customCode')
      let customRoomVal = document.getElementById('customRoom').value.trim();
    let customCodeVal = document.getElementById('customCode').value.trim();
     if (!customRoomVal || !customCodeVal) return alert("Missing info!")
      if (customRoomVal === '333' && customCodeVal === '333') {
        return alert("test room"); }
     roomCount++
     const button = document.createElement('button')
     button.textContent = `${customRoomVal}`
     button.classList.add('button')
     button.dataset.roomId = customRoomVal
     button.dataset.hash = await sha256(customCodeVal)
     buttonDiv.appendChild(button)
      const newRoom = {
        id: customRoomVal,
        hash: await sha256(customCodeVal)
    };
     allRooms.push(newRoom)
     roomID = newRoom.id
     MASTER_HASH = newRoom.hash
     sharedKeyBytes = await deriveKeyFromPassword(customCodeVal)
     authorized = true
     saveRoomInfo()
     createModal.close()
})
const createModal = document.getElementById('makeRoom')
document.getElementById('creator').addEventListener('click',  () => {
  createModal.showModal()
})
const loadModal = document.getElementById('goTo')
document.getElementById('load').addEventListener('click', () => {
  loadModal.showModal()
})

    let sharedKeyBytes, messageHub, privKey, pubKey, nostrNip44, sendMessage;
    let nextStep = false
    const seenEventIds = new Set();
    const activeSockets = {}
    async function implementNostr() {
        const tools = window.NostrTools;
         if (!window.NostrTools) {
        console.warn("NostrTools not found, retrying in 300ms...");
        await new Promise(resolve => setTimeout(resolve, 300));
        return implementNostr(); 
    }

        
        const generateSecretKey = tools.generateSecretKey
        const getPublicKey = tools.getPublicKey
        const finalize = tools.finalizeEvent
        privKey = generateSecretKey();
        pubKey = getPublicKey(privKey);
        nostrNip44 = tools.nip44; 

        const relayUrls = ['wss://relay.damus.io', 'wss://nos.lol', 'wss://relay.snort.social'];
        messageHub = document.getElementById('mainChat');

        // Logic to connect and handle messages
        const connectToRelay = (url, backoff = 1000) => {
            const socket = new WebSocket(url);
            activeSockets[url] = socket;

            socket.onopen = () => {
                console.log(`Connected to ${url}`);
                backoff = 1000; // Reset backoff on success
                socket.send(JSON.stringify(["REQ", "sub-1", { "kinds": [1], "#t": [roomID], "limit": 25 }]));
            };

            socket.onmessage = (msg) => {
                const [type, subId, event] = JSON.parse(msg.data);
                if (type === "EVENT" && !seenEventIds.has(event.id)) {
                    seenEventIds.add(event.id);
                    if (event.pubkey !== pubKey) {
                        try {
    const decrypted = nostrNip44.v2.decrypt(event.content, sharedKeyBytes);
    const messageDiv = document.createElement('div');
    messageDiv.className = 'greentext';

    if (decrypted.includes('[MEDIA FILE]\n')) {
        const [header, base64] = decrypted.split('[MEDIA FILE]\n');
        const username = header.replace(':', '').trim();

        if (base64.startsWith('data:image/')) {
            
            messageDiv.innerHTML = `<p class='usersChat'>${username}:</p> <img src="${base64}" class="media" style="max-width:100%; max-height:300px; display:block;" />`;
        } else if (base64.startsWith('data:video/')) {
            
            messageDiv.innerHTML = `<p class='usersChat'>${username}:</p> <video controls class="media" style="max-width:100%; max-height:300px; display:block;"><source src="${base64}"></video>`;
        } else {
            messageDiv.innerHTML = `<p class='usersChat'>${decrypted}</p>`;
        }
    } else { 
        
        messageDiv.innerHTML = `<p class='usersChat'>${decrypted}</p>`;
    }

    messageHub.appendChild(messageDiv);
    messageHub.scrollTop = messageHub.scrollHeight;
} catch (e) {
    console.error("Render error:", e);
}
                    }
                }
            };

            socket.onclose = () => {
                delete activeSockets[url];
                const retryDelay = Math.min(backoff * 2, 30000);
                console.warn(`Connection lost to ${url}. Reconnecting in ${retryDelay}ms`);
                setTimeout(() => connectToRelay(url, retryDelay), backoff);
            };

            socket.onerror = (err) => {
                socket.close(); // Trigger the onclose reconnection logic
            };
        };

        // Initialize connections
        relayUrls.forEach(url => connectToRelay(url));

        // Global sendMessage function that uses existing active sockets
        sendMessage = async (username, messageContent) => {
    const eventTemplate = {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['t', roomID]],
        content: messageContent,
    };
            const event = tools.finalizeEvent(eventTemplate, privKey);
            
            // Send to all currently connected relays
            Object.values(activeSockets).forEach(socket => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify(["EVENT", event]));
                }
            });
        };
    }



    const lockModal = document.getElementById('enterCode');
    const enterCode = document.getElementById('codeEnter');
    const incorrect = document.getElementById('incorrect');
let alreadyphucked = false
    async function checkCode(hashCheck) {
        const password = hashCheck;
        const encoder = new TextEncoder();
        const msgBuffer = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
if (!alreadyphucked){
        if (hashHex === MASTER_HASH) {
            loadApp()
            loadModal.close()
            alert('yay!')
        } else {
          alreadyphucked = true
          incorrect.textContent = 'Wrong Password!'}
}
    }

    async function loadApp() {
         await implementNostr();
        const preText = document.getElementById('message');
        const user = document.getElementById('enterName');

        async function handleText() {
            if (!sendMessage || !preText.value.trim()) return;
            const username = user.value || 'anon';
            const rawMessage = `${username}: ${preText.value}`;
            try {
                const encrypted = nostrNip44.v2.encrypt(rawMessage, sharedKeyBytes);
                await sendMessage(username, encrypted);
                const messageDiv = document.createElement('div');
                messageDiv.className = 'greentext';
                messageDiv.innerHTML = `<p class='usersChat'>${rawMessage}</p>`;
                messageHub.appendChild(messageDiv);
                messageHub.scrollTop = messageHub.scrollHeight;
                preText.value = '';
            } catch (err) {
                console.error("Encryption failed:", err);
            }
        }

        document.getElementById('send').addEventListener('click', handleText);
        document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && authorized) handleText(); });
    }
const colorPanel = document.getElementById('colors')
colorPanel.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON'){
    const theme = e.target.id
    if (theme === 'default'){
      document.body.removeAttribute('data-theme')
    } else {
      document.body.setAttribute('data-theme', theme)
    }
  }
})
const clearBut = document.getElementById('clear')
clearBut.addEventListener('click', () => {
  document.querySelectorAll('.greentext').forEach((greentext) => {
    greentext.remove()
  })
})
})();
