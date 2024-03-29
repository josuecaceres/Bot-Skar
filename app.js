var datos = [
  {
    pregunta: "¿Como te llamas?",
    respuesta: "Que te importa"
  },
  {
    pregunta: "¿Como te llamas?",
    respuesta: "Que te importa"
  },
  {
    pregunta: "¿Como te llamas?",
    respuesta: "Que te importa"
  },
  {
    pregunta: "¿Como te llamas?",
    respuesta: "Que te importa"
  },
  {
    pregunta: "¿Como te llamas?",
    respuesta: "Que te importa"
  },
  {
    pregunta: "¿Como te llamas?",
    respuesta: "Que te importa"
  },
  {
    pregunta: "¿Como te llamas?",
    respuesta: "Que te importa"
  },
  {
    pregunta: "¿Como te llamas?",
    respuesta: "Que te importa"
  },
  {
    pregunta: "¿Como te llamas?",
    respuesta: "Que te importa"
  },
]

var areaDePreguntas = document.querySelector('.sec1')
var sendChannel, 
	receiveChannel,
	chatWindow = document.querySelector('.chat-window'),
	chatWindowMessage = document.querySelector('.chat-window-message'),
	chatThread = document.querySelector('.chat-thread');


  //Random color
  const random_hex_color_code = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + n.slice(0, 6);
  }

//on load
window.addEventListener('load', function() {
  areaDePreguntas.innerHTML = ''
  datos.forEach((element, index) => {

    areaDePreguntas.innerHTML += `
      <div class="tag" style="border: .5px solid ${random_hex_color_code()};" onclick="hacerPregunta(${index})">
        <a href="#">${element.pregunta}</a>
      </div>
    `
    console.log(element)
  })
})

function hacerPregunta(index){
  console.log(datos[index])
  //pregunta del user
  var chatNewThread = document.createElement('li'),
    	chatNewMessage = document.createTextNode(datos[index].pregunta);

    // Add message to chat thread and scroll to bottom
    chatNewThread.appendChild(chatNewMessage);
    chatThread.appendChild(chatNewThread);
    chatThread.scrollTop = chatThread.scrollHeight;

  //respusta del bot
  setTimeout(function(){ 
    var chatNewThread = document.createElement('li'),
      chatNewMessage = document.createTextNode(datos[index].respuesta);

    // Add message to chat thread and scroll to bottom
    chatNewThread.appendChild(chatNewMessage);
    chatThread.appendChild(chatNewThread);
    chatThread.scrollTop = chatThread.scrollHeight;
  }, 1000);
}

// Create WebRTC connection
createConnection();

// On form submit, send message
chatWindow.onsubmit = function (e) {
	e.preventDefault();

	sendData();

	return false;
};

function createConnection () {
    var servers = null;

    if (window.mozRTCPeerConnection) {
	    window.localPeerConnection = new mozRTCPeerConnection(servers, {
	        optional: [{
	            RtpDataChannels: true
	        }]
	    });
    } else {
	    window.localPeerConnection = new webkitRTCPeerConnection(servers, {
	        optional: [{
	            RtpDataChannels: true
	        }]
	    });
    }

    try {
        // Reliable Data Channels not yet supported in Chrome
        sendChannel = localPeerConnection.createDataChannel('sendDataChannel', {
            reliable: false
        });
    } catch (e) {
    }

    localPeerConnection.onicecandidate = gotLocalCandidate;
    sendChannel.onopen = handleSendChannelStateChange;
    sendChannel.onclose = handleSendChannelStateChange;

    if (window.mozRTCPeerConnection) {
	    window.remotePeerConnection = new mozRTCPeerConnection(servers, {
	        optional: [{
	            RtpDataChannels: true
	        }]
	    });
    } else {
	    window.remotePeerConnection = new webkitRTCPeerConnection(servers, {
	        optional: [{
	            RtpDataChannels: true
	        }]
	    });
    }

    remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
    remotePeerConnection.ondatachannel = gotReceiveChannel;

    // Firefox seems to require an error callback
    localPeerConnection.createOffer(gotLocalDescription, function (err) {
    });
}

function sendData () {
    sendChannel.send(chatWindowMessage.value);
}

function gotLocalDescription (desc) {
    localPeerConnection.setLocalDescription(desc);
    remotePeerConnection.setRemoteDescription(desc);
    // Firefox seems to require an error callback
    remotePeerConnection.createAnswer(gotRemoteDescription, function (err) {
    });
}

function gotRemoteDescription (desc) {
    remotePeerConnection.setLocalDescription(desc);
    localPeerConnection.setRemoteDescription(desc);
}

function gotLocalCandidate (event) {
    if (event.candidate) {
        remotePeerConnection.addIceCandidate(event.candidate);
    }
}

function gotRemoteIceCandidate (event) {
    if (event.candidate) {
        localPeerConnection.addIceCandidate(event.candidate);
    }
}

function gotReceiveChannel (event) {
    receiveChannel = event.channel;
    receiveChannel.onmessage = handleMessage;
    receiveChannel.onopen = handleReceiveChannelStateChange;
    receiveChannel.onclose = handleReceiveChannelStateChange;
}

function handleMessage (event) {
    var chatNewThread = document.createElement('li'),
    	chatNewMessage = document.createTextNode(event.data);

    // Add message to chat thread and scroll to bottom
    chatNewThread.appendChild(chatNewMessage);
    chatThread.appendChild(chatNewThread);
    chatThread.scrollTop = chatThread.scrollHeight;

    // Clear text value
    chatWindowMessage.value = '';
}

function handleSendChannelStateChange () {
    var readyState = sendChannel.readyState;

    if (readyState == 'open') {
        chatWindowMessage.disabled = false;
        chatWindowMessage.focus();
    	chatWindowMessage.placeholder = "";
    } else {
        chatWindowMessage.disabled = true;
    }
}

function handleReceiveChannelStateChange () {
    var readyState = receiveChannel.readyState;
} 