// In production, we register a service worker to serve assets from local cache.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on the "N+1" visit to a page, since previously
// cached resources are updated in the background.

// To learn more about the benefits of this model, read https://goo.gl/KwvDNy.
// This link also includes instructions on opting out of this behavior.

const isLocalhost = Boolean(
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
        const installingWorker = registration.installing;
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
  // 重载相关代码
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      // 主页面监听 message 事件
      registration.onmessage = (e) => {
        // console.log(e.target.state);
        // service-worker.js 如果更新成功会 postMessage 给页面，内容为 'sw.update'
        // 开发者这自定义处理函数，也可以使用默认提供的用户提示，引导用户刷新
        /* eslint-disable prefer-const */
        if (e.data === 'sw.update') {
          let metas = document.head.getElementsByTagName('meta');
          /* eslint-disable no-plusplus */
          for (let i = 0, len = metas.length; i < len; i++) {
            let meta = metas[i];
            if (meta.name === 'theme-color') {
              meta.content = '#000';
            }
          }

          let dom = document.createElement('div');

          dom.innerHTML = `
          <style>
            .app-refresh{background:#000;height:0;line-height:52px;overflow:hidden;position:fixed;top:0;left:0;right:0;z-index:10001;padding:0 18px;transition:all .3s ease;-webkit-transition:all .3s ease;-moz-transition:all .3s ease;-o-transition:all .3s ease;}
            .app-refresh-wrap{display:flex;color:#fff;font-size:15px;}
            .app-refresh-wrap label{flex:1;}
            .app-refresh-show{height:52px;}
          </style>
          <div class="app-refresh" id="app-refresh">
            <div class="app-refresh-wrap" onclick="location.reload()">
              <label>已更新最新版本</label>
              <span>点击刷新</span>
            </div>
          </div>
          `;

          document.body.appendChild(dom);
          /* eslint-disable no-return-assign */
          setTimeout(() => document.getElementById('app-refresh').className += ' app-refresh-show', 16);
        }
      };
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

export default function register() {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebookincubator/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = '/service-worker.js';

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

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}
