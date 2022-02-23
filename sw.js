const cache = {
    "version": "1.0",
    "cache": [
        "css/account.css",
        "css/search.css",
        "css/sell.css",
        "include/content.css",
        "include/footer,css",
        "include/footer.html",
        "include/nav.css",
        "include/nav.html",
        "js/account.js",
        "js/ajax.js",
        "js/css.js",
        "js/init.js",
        "js/insert.js",
        "js/login.js",
        "js/records.js",
        "js/search.js",
        "js/signup.js",
        "account.html",
        "index.html",
        "law.html",
        "login.html",
        "search.html",
        "sell.html",
        "signup.html",
        "template.js",
        "favicon.svg"
    ]
}  
//all css file should be added

function caching(in_json){
    // Open a cache of resources.
    caches.open("bazar-v1").then(cache => {
        return cache.addAll(in_json.cache);
    });
}
 

self.addEventListener("install", event => {
    event.waitUntil(caching(cache));
    });

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});