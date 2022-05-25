/** @format */

let versionCache = "pwa-v20";
let offline_url = "comming soon";
let fileCache = [
  "/javascripts/jquery-3.6.0.min.js",
  "/javascripts/sweetalert.min.js",
  "/javascripts/core/popper.min.js",
  "/javascripts/core/bootstrap.min.js",
  "/javascripts/plugins/perfect-scrollbar.min.js",
  "/javascripts/plugins/smooth-scrollbar.min.js",
  "/javascripts/datatables.min.js",
  "/javascripts/header_script.js",
  "/javascripts/socket.io.js",
  "/javascripts/socket.js",
  "/javascripts/material-dashboard.min.js?v=3.0.0",
  "https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js",
  "https://cdn.socket.io/socket.io-3.0.1.min.js",
  "https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js",
  "https://cdn.datatables.net/buttons/2.2.2/js/dataTables.buttons.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js",
  "https://cdn.datatables.net/buttons/2.2.2/js/buttons.print.min.js",
  "https://cdn.datatables.net/buttons/2.2.2/js/buttons.html5.min.js",

  // css
  "/stylesheets/material-dashboard.css?v=3.0.0",
  "/stylesheets/modals.css",
  "/stylesheets/error_style.css",
  "/stylesheets/datatables.min.css",
  "https://cdn.datatables.net/buttons/2.2.2/css/buttons.dataTables.min.css",
  "https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(versionCache);
        const total = fileCache.length;
        let installed = 0;

        await Promise.all(
          fileCache.map(async (url) => {
            let controller;

            try {
              controller = new AbortController();
              const { signal } = controller;
              const req = new Request(url, { cache: "reload" });
              const res = await fetch(req, { signal });

              if (res && res.status === 200) {
                await cache.put(req, res.clone());
                installed += 1;
              } else {
                console.info(`unable to fetch ${url} (${res.status})`);
              }
            } catch (e) {
              console.info(`unable to fetch ${url}, ${e.message}`);
              controller.abort();
            }
          })
        );

        if (installed === total) {
          console.info(
            `application successfully installed (${installed}/${total} files added in cache)`
          );
        } else {
          console.info(
            `application partially installed (${installed}/${total} files added in cache)`
          );
        }
      } catch (e) {
        console.error(`unable to install application, ${e.message}`);
      }
    })()
  );
});

self.addEventListener("activate", function (event) {
  console.log(versionCache, " Activate ...");
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return !versionCache.includes(key);
            })
            .map(function (key) {
              console.log("Remove old cache ...");
              return caches.delete(key);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch(async (error) => {
        const cache = await caches.open(versionCache);
        const cachedResponse = await cache.match(offline_url);
        return cachedResponse;
      })
  );
});

self.skipWaiting();
