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
  "/javascripts/material-dashboard.min.js?v=3.0.0",
  "/javascripts/plugins/jquery.dataTables.min.js",
  "/javascripts/socket.io.min.js",
  
  "/stylesheets/material-dashboard.css?v=3.0.0",
  "/stylesheets/modals.css",
  "/stylesheets/error_style.css",
  "/stylesheets/datatables.min.css",
  "/stylesheets/bootstraps.min.css",
  "/stylesheets/material-dashboard.min.css",
  "/stylesheets/material-dashboard.css",
  "/stylesheets/jquery.dataTables.min.css",
  "/stylesheets/buttons.dataTables.min.css",
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
