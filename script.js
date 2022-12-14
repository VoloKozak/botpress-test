const toggleBtn = document.querySelector('.btw-button-widget');
const form = document.querySelector('form');

form.addEventListener('submit', e => {
  e.preventDefault();
  const input = e.target.elements[0];
  if (input.value) {
    initBot(input.value);
    form.reset();
    form.classList.add('hidden');
    toggleBtn.classList.remove('hidden');
  }
})


function initBot(host) {
  const config = { 
    host, 
    botId: 'mcdonalds_assistant',
    hideWidget: true,
    extraStylesheet: '/assets/modules/channel-web/mcdonalds_assistant.css'
  }
  
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
}


