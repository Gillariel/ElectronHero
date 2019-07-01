const {net, ClientRequest} = require('electron')

const Query = {
    name: "", artist: "", album: "", genre: "", charter: "",
    tier_band: "gt0", tier_guitar: "gt0", tier_bass: "gt0", tier_rhythm: "gt0", tier_drums: "gt0", tier_vocals: "gt0", tier_keys: "gt0", tier_guitargh1: "gt0", tier_bassgh1: "gt0",
    diff_guitar: 8, diff_bass: 8, diff_ryythm: 8, diff_drums: 8, diff_vocals: 8, diff_keys: 8, diff_guitargh1: 8, diff_bassgh1: 8,
    hasForced: false, hasOpen: false, hasTap: false, hasSections: false, hasStarPower: false, hasSoloSections: false, hasStems: false, hasVideo: false
}

const handleResponse = res => {
    if(res.statusCode >= 200 && res.statusCode <= 299){
        return { data: res, complete: true }
    } else if(res.statusCode >= 300 && res.statusCode <= 399){
        console.log("Redirection happen: " + res.statusMessage)
        return { complete: false } 
    } else if(res.statusCode >= 400 && res.statusCode <= 499){
        console.log("Client Error: " + res.statusMessage)
        return { complete: false }  
    } else if(res.statusCode >= 500 && res.statusCode <= 599){
        console.log("Server Error: " + res.statusMessage)
        return { complete: false }
    } else {
        console.log("unknown response code ?? : " + res.statusMessage)
        return { complete: false }
    }
}

const METHODS = {
    GET: "GET",
    POST: "POST"
}
const CHORUS = {
    protocol: "https:",
    hostname: "chorus.fightthe.pw",
    host: "chorus.fightthe.pw:443",
    port: 443,
    path: "/api/"
}

exports.GetLatest = (cb) => {
    const reqInfo = {
        method: METHODS.GET,
        protocol: CHORUS.protocol,
        hostname: CHORUS.hostname,
        host: CHORUS.host,
        port: CHORUS.port,
        path: `${CHORUS.path}latest`
    }
    const req = net.request(reqInfo);
    req.on('response', res => {
        let dataCheck = handleResponse(res);
        if(dataCheck)
            cb(dataCheck.data)
        else 
            cb([]); 
    });
    req.on('error', err => { console.log(err.message) });
    req.on('login', ( authInfo, cb) => {
        console.log("need to provided auth");
        cb("MyUsername", "myPassword");
    });
    req.end();
    progress = req.getUploadProgress();
}

exports.Count = () => {
    const reqInfo = {
        method: METHODS.GET,
        protocol: CHORUS.protocol,
        hostname: CHORUS.hostname,
        host: CHORUS.host,
        port: CHORUS.port,
        path: `${CHORUS.path}count`
    }
    const req = new net.request(reqInfo);
    req.on('response', res => {
        let dataCheck = handleResponse(res);
        if(dataCheck)
            cb(dataCheck.data)
        else 
            cb([]) 
    });
    req.on('error', err => { console.log(err.message) });
    req.on('login', ( authInfo, cb) => {
        console.log("need to provided auth");
        cb("MyUsername", "myPassword");
    });
    progress = req.getUploadProgress();
}

exports.GetRandom = () => {
    const reqInfo = {
        method: METHODS.GET,
        protocol: CHORUS.protocol,
        hostname: CHORUS.hostname,
        host: CHORUS.host,
        port: CHORUS.port,
        path: `${CHORUS.path}random`
    }
    const req = new ClientRequest(reqInfo);
    req.on('response', res => {
        let dataCheck = handleResponse(res);
        if(dataCheck)
            return dataCheck.data
        else 
            return [] 
    });
    req.on('error', err => { console.log(err.message) });
    req.on('login', ( authInfo, cb) => {
        console.log("need to provided auth");
        cb("MyUsername", "myPassword");
    });
    progress = req.getUploadProgress();
}

/**
 * 
 * @param {Query} Query 
 * @description name="some name": Song name
                artist="some artist": Artist/band name
                album="some album": Album name
                genre="some genre": Song genre
                charter="some charter": Charter name (as documented in their song.ini/notes.chart)
                tier_band, tier_guitar, tier_bass, tier_rhythm, tier_drums, tier_vocals, tier_keys, tier_guitarghl, tier_bassghl: Difficulty tier as defined in song.ini by the diff_* entries (number from 0 to 6, usually). For instance, tier_guitar=lt3 will look for tiers that are less than 3, tier_guitar=gt3 will look for tiers higher than 3.
                diff_guitar, diff_bass, diff_rhythm, diff_drums, diff_vocals, diff_keys, diff_guitarghl, diff_bassghl: Which difficulty parts (easy, medium, hard, expert) are available. It is a 4-wide bitmap (1 bit per difficulty part): 1 is easy, 2 is medium, 4 is hard, 8 is expert. Add numbers together to make multi-part queries.
                hasForced, hasOpen, hasTap, hasSections, hasStarPower, hasSoloSections, hasStems, hasVideo: self explanatory, 0 to query for absence, 1 to query for presence.
 */
const QueryBuilder = (Query) => {
    const query = "";
    query += Object.keys(Query).map(queryKey => {
        /*if(queryKey.includes("tier")) {
            // gretare, less etc process
        } else if (queryKey.includes("diff")) {
            /*var indexOf = query.indexOf(queryKey);
            indexOf > -1
                ?
                :*/
            /*return `${queryKey}="${Query.queryKey}"` 
        } else*/ if(queryKey.includes("has")){
            return `${queryKey}="${Query.queryKey ? 1 : 0}"`
        } else
            return `${queryKey}="${Query.queryKey}"`
    })
    return query;
} 

exports.GetByQuery = (query) => {
    const reqInfo = {
        method: METHODS.GET,
        protocol: CHORUS.protocol,
        hostname: CHORUS.hostname,
        host: CHORUS.host,
        port: CHORUS.port,
        path: `${CHORUS.path}search/?${QueryBuilder(query)}`
    }
    const req = new ClientRequest(reqInfo);
    req.on('response', res => {
        let dataCheck = handleResponse(res);
        if(dataCheck)
            return dataCheck.data
        else 
            return [] 
    });
    req.on('error', err => { console.log(err.message) });
    req.on('login', ( authInfo, cb) => {
        console.log("need to provided auth");
        cb("MyUsername", "myPassword");
    });
    progress = req.getUploadProgress();
}