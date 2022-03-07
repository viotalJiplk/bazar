/**
 * this function remove things to cache
 * @param {Cache} cache 
 * @param {Array} toremove 
 */
async function removeFromCache(cache, toremove){
    for(let x in toremove){
        await cache.delete(toremove[x].url);
    }
}

/**
 * this function inserts things to cache
 * @param {Array} toinsert array of things to insert
 */
async function insertToCache(cache, toinsert){
    for(let x in toinsert){
        await cache.add(toinsert[x].url);
    }
}

async function getCacheKeys(){
    let cache = await caches.open("bazar-v1");
    let keys = await cache.keys();
    return keys;
}

/**
 * delete all keys from selected cache
 * @param {Cache} cache cache to delete all keys from
 */
async function cleanCache(cache){
    let keys = await cache.keys();
    for(x in keys){
        cache.delete(keys[x])
    }
}

/**
 * 
 * @param {Object} clientjson object, that represents what should be in cache (see client.json)
 * @param {Cache} cache cache to put all records in
 */
async function redownloadfull(clientjson, cache){
    await cleanCache(cache);
    for(let x in clientjson.resources){
        await cache.add(clientjson.resources[x].url);
    }
}

async function updateCache(){
    let cache = await caches.open("bazar-v1");
    
    let req = new Request("client.json");
    let json  = await fetch(req);
    let cachedjson = await cache.match(req);
    let versions = json.clone();
    json = await json.json();
    
    if(cachedjson === undefined){
        await redownloadfull(json, cache);
    }else{
        cachedjson = await cachedjson.json();
        if(json.version != cachedjson.version){
            await redownloadfull(json, cache);
        }else{
            let i = 0;
            while(i<json.resources.length & 0 < cachedjson.resources.length){
                let j = 0;
                while(j < cachedjson.resources.length){
                    if(json.resources[i].url == cachedjson.resources[j].url){
                        if(json.resources[i].version == cachedjson.resources[j].version){
                            json.resources.splice(i, 1);
                            cachedjson.resources.splice(j,1);
                        }else{
                            i+=1;
                        }
                        break;
                    }else{
                        if(j == (cachedjson.resources.length - 1)){
                            i+=1;
                        }
                        j +=1;
                    }
                }
            }
            await removeFromCache(cache, cachedjson.resources);
            await insertToCache(cache, json.resources);
        }
    }
    cache.put(req, versions);
}

self.addEventListener("install", event => {
    event.waitUntil(updateCache());
    });

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});