function interceptData() {
  var xhrOverrideScript = document.createElement('script');
  xhrOverrideScript.type = 'text/javascript';
  xhrOverrideScript.innerHTML = `
  (function() {
    const { fetch: originalFetch } = window;

    window.fetch = async (...args) => {
        let [resource, config] = args;
        const response = await originalFetch(resource, config);
        if (resource.includes('api/conversations')) {
          try {
              let json = await response.clone().json();
              var items = json.items;

              var previous_items = localStorage.getItem('_conversation_history');
              try { previous_items = JSON.parse(previous_items) } catch(e){}
              if (!previous_items || !Array.isArray(previous_items)) previous_items = [];

              items.forEach(item => {
                if (!previous_items.filter(x => x.id === item.id).length) previous_items.push(item);
              });

              localStorage.setItem('_conversation_history', JSON.stringify(previous_items));
          } catch(e) { console.log(e) }
        }
        return response;
    };
  })();
  `
  document.head.prepend(xhrOverrideScript);
}
function checkForDOM() {
  if (document.body && document.head) {
    interceptData();
  } else {
    requestIdleCallback(checkForDOM);
  }
}
requestIdleCallback(checkForDOM);

chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

    }
  }, 10);

  var checkForFailedStateInterval = setInterval(() => {
    var target = document.querySelector('nav > div > div');
    if (target && target.textContent && target.textContent.includes('Unable to load history')) {
      clearInterval(checkForFailedStateInterval);

      var previous_items = localStorage.getItem('_conversation_history');
      try { previous_items = JSON.parse(previous_items) } catch(e){}
      if (!previous_items || !Array.isArray(previous_items)) previous_items = [];

      // var target = document.querySelector('nav > div > div');
      target.innerHTML = '';

      previous_items.forEach(item => {

        var button = document.createElement('a');
        button.style = 'min-width:100%'
        button.href = 'https://chat.openai.com/chat/' + item.id;
        button.className = 'flex min-w-full py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer hover:pr-4 group';
        button.innerHTML = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg><div class="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">${ item.title }<div class="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-900 group-hover:from-[#2A2B32]"></div></div>`;
        target.appendChild(button);

      });
    }
  }, 500);
});
