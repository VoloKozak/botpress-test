const toggleBtn = document.querySelector('.btw-button-widget');
const form = document.querySelector('form');
const instructions = document.querySelector('.instructions');

form.addEventListener('submit', e => {
  e.preventDefault();
  const input = e.target.elements[0];
  if (input.value && isURL(input.value)) {
    initBot(input.value);
    form.reset();
    instructions.classList.add('hidden');
    toggleBtn.classList.remove('hidden');
  } else {
    console.log('invalid')
    alert('Please enter valid host URL!')
  }
})


function initBot(host) {

  const script = document.createElement('script');
  script.setAttribute( 'src', `${host}/assets/modules/channel-web/inject.js` );
  document.head.appendChild(script);

  const config = { 
    host, 
    botId: 'mcdonalds_assistant',
    hideWidget: true,
    showPoweredBy: false,
    botName: "McDonald's Virtual Assistant",
    extraStylesheet: '/assets/modules/channel-web/mcdonalds_assistant.css',
  }
  
  setTimeout(() => {
    window.botpressWebChat.init(config);
  
    window.addEventListener('message', function(event) {
    //Identifies when the bot bubble is clicked and the sends 'proactive-trigger' event
    if (event.data.name === 'webchatOpened' || (event.data.payload?.type === 'session_reset')) {
        window.botpressWebChat.sendEvent({
        type: 'proactive-trigger',
        channel: 'web',
        payload: {
            text: 'Hi'
        }
        })
    }
    if (event.type === 'message' && event.data.payload?.payload === 'SURE') {
      navigator.geolocation.getCurrentPosition(onSuccessLocationRetrieve, onErrorLocationRetrieve)
    }
  })
  
  function onSuccessLocationRetrieve(location) {
    const { latitude, longitude } = location.coords
    const coords = {latitude, longitude};
    const successEvent = {
      type: 'location-retrieve',
      channel: 'web',
      payload: {coords, locationError: undefined}
    };
    window.botpressWebChat.sendEvent(successEvent)
    return
  }
  
  function onErrorLocationRetrieve(error) {
    const errorEvent = {
      type: 'location-retrieve',
      channel: 'web',
      payload: {coords: undefined, locationError: 'There was some issue getting your location.'}
    };
    window.botpressWebChat.sendEvent(errorEvent)
    return
  }
  
  toggleBtn.addEventListener("click", function () {
    window.botpressWebChat.sendEvent({ type: "show" })
  })
  }, 500)
}



document.addEventListener('click', (e) => {
  const el = e.target
  if (el.tagName === 'BUTTON' && el.hasAttribute('data-step')) {
    const stepImg = el.getAttribute('data-step')
    const image = document.querySelector(`.${stepImg}`);
    if (image.classList.contains('hidden')) {
      image.classList.remove('hidden')
    } else {
      image.classList.add('hidden')
    }
  }
}

)

export default function isURL(str) {
  const urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
  const url = new RegExp(urlRegex, 'i');
  return str.length < 2083 && url.test(str);
}


