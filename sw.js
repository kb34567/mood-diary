var CACHE_NAME = "mood-diary-v2";
var ASSETS = [
  "./",
  "index.html",
  "manifest.json",
  "icon-192.png",
  "icon-512.png",
  "apple-touch-icon.png",
  "icon/01-worried.svg",
  "icon/02-great.svg",
  "icon/03-tired.svg",
  "icon/04-calm.svg",
  "icon/05-melancholy.svg",
  "icon/06-neutral.svg",
  "icon/07-heart-flutter.svg",
  "icon/08-good.svg",
  "icon/09-angry.svg",
  "icon/10-sulky.svg",
  "icon/11-sleepy.svg",
  "icon/12-furious.svg",
  "icon/13-dizzy.svg",
  "icon/14-dejected.svg"
];

self.addEventListener("install", function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){ return cache.addAll(ASSETS); })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

// Network-first: always try to get the latest version when online, and only
// fall back to the cached copy if the network request fails (offline).
self.addEventListener("fetch", function(event){
  if(event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request).then(function(resp){
      if(resp && resp.status === 200){
        var respClone = resp.clone();
        caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, respClone); });
      }
      return resp;
    }).catch(function(){
      return caches.match(event.request);
    })
  );
});
