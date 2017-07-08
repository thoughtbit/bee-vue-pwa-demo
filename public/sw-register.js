/* global navigator, document */

// In production, we register a service worker to serve assets from local cache.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on the "N+1" visit to a page, since previously
// cached resources are updated in the background.

// To learn more about the benefits of this model, read https://goo.gl/KwvDNy.
// This link also includes instructions on opting out of this behavior.

/* eslint-disable */
var isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        var installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the old content will have been purged and
              // the fresh content will have been added to the cache.
              // It's the perfect time to display a "New content is
              // available; please refresh." message in your web app.
              console.log('New content is available; please refresh.');
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('Content is cached for offline use.');
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

/**
 * service-worker.js 更新时 'sw.update' 的信息监听和页面重载部分，也是在次方法里完成。
 */
function registerUpdateSW(swUrl) {
  /**
   * 处理 service worker 更新
   */
  var handlerUpdateMessage = (e) => {
    var metas = document.getElementsByTagName('meta');

    /* eslint-disable */
    for (let i = 0, len = metas.length; i < len; i++) {
      let meta = metas[i];
      if (meta.name === 'theme-color') {
        meta.content = '#000';
      }
    }

    var dom = document.createElement('div');

    dom.innerHTML = `
      <style>
        .app-refresh {background:#000;color:#fff;height:52px;line-height:52px;opacity:1;position:fixed;left:0;right:0;z-index:10001;padding:0 18px;animation: app-refresh-animation 1s;}
        .app-refresh-wrap{display:flex;}
        .app-refresh-wrap span{display:inline-block;flex:1;font-size:15px;}
        .app-refresh-wrap button{color:#fff;outline:none;font-size:15px;}
        @keyframes app-refresh-animation{from {height: 0;opacity: 0}to {height: 52px;opacity: 1;}}
        @-webkit-keyframes app-refresh-animation{from {height: 0;opacity: 0}to {height: 52px;opacity: 1;}}
        @-o-keyframes app-refresh-animation{from {height: 0;opacity: 0}to {height: 52px;opacity: 1;}}
        @-moz-keyframes app-refresh-animation{from {height: 0;opacity: 0}to {height: 52px;opacity: 1;}}
      </style>
      <div class="app-refresh" id="app-refresh">
        <div class="app-refresh-wrap">
          <span>已更新最新版本</span>
          <button type="button" onclick="location.reload()">点击刷新</button>
        </div>
      </div>
    `;

    document.body.appendChild(dom);
  };

  navigator.serviceWorker.register(swUrl);
  navigator.serviceWorker.addEventListener('message', (e) => {
    // received the update message from sw
    if (e.data === 'sw.update') {
      handlerUpdateMessage(e);
    }
  });
}

function checkValidServiceWorker(swUrl) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl)
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      if (
        response.status === 404 ||
        response.headers.get('content-type').indexOf('javascript') === -1
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl);
        // 缓存及时更新的方案
        registerUpdateSW(swUrl);
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    });
}

function register() {

  if ('serviceWorker' in navigator) {
    // The URL varructor is available in all browsers that support SW.
    if (new URL("", window.location).origin !== window.location.origin){
      return;
    }
    window.addEventListener('load', () => {
      var swUrl = '/service-worker.js';
      if (!isLocalhost) {
        // Is not local host. Just register service worker
        registerValidSW(swUrl);
      } else {
        // This is running on localhost. Lets check if a service worker still exists or not.
        checkValidServiceWorker(swUrl);
      }
    });
  }
}

function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}

// Run.

register();
