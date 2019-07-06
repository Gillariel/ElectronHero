const {net, ClientRequest} = require('electron')
const axios = require('axios').default

const Query = {
    name: "", artist: "", album: "", genre: "", charter: "",
    tier_band: "gt0", tier_guitar: "gt0", tier_bass: "gt0", tier_rhythm: "gt0", tier_drums: "gt0", tier_vocals: "gt0", tier_keys: "gt0", tier_guitargh1: "gt0", tier_bassgh1: "gt0",
    diff_guitar: 8, diff_bass: 8, diff_ryythm: 8, diff_drums: 8, diff_vocals: 8, diff_keys: 8, diff_guitargh1: 8, diff_bassgh1: 8,
    hasForced: false, hasOpen: false, hasTap: false, hasSections: false, hasStarPower: false, hasSoloSections: false, hasStems: false, hasVideo: false
}

const handleResponse = res => {
    if(res.status >= 200 && res.status <= 299){
        return { data: res.data, complete: true }
    } else if(res.status >= 300 && res.status <= 399){
        return { data: "Redirection happen: " + res.statusText, complete: false } 
    } else if(res.status >= 400 && res.status <= 499){
        return { data: "Client Error: " + res.statusText, complete: false }  
    } else if(res.status >= 500 && res.status <= 599){
        return { data: "Server Error: " + res.statusText, complete: false }
    } else {
        return { data: "unknown response code ?? : " + res.statusText, complete: false }
    }
}

const METHODS = {
    GET: "GET",
    POST: "POST"
}
const CHORUS = "https://chorus.fightthe.pw/api/"

exports.GetLatest = (cb) => {
    axios.get(`${CHORUS}latest`)
    .then((res) => {
        cb(handleResponse(res))
    })
    .catch(err => { console.log(err.message) });
}

exports.Count = (cb) => {
    axios.get(`${CHORUS}count`)
    .then((res) => {
        cb(handleResponse(res))
    })
    .catch(err => { console.log(err.message) });
}

exports.GetRandom = (cb) => {
    axios.get(`${CHORUS}random`)
    .then((res) => {
        cb(handleResponse(res))
    })
    .catch(err => { console.log(err.message) });
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
    let query = "query=";
    query += Object.keys(Query).map(queryKey => {
        const queryValue = Query[queryKey]
        /*if(queryKey.includes("tier")) {
            // gretare, less etc process
        } else if (queryKey.includes("diff")) {
            /*var indexOf = query.indexOf(queryKey);
            indexOf > -1
                ?
                :*/
            /*return `${queryKey}="${Query.queryKey}"` 
        } else*/ if(queryKey.includes("has")){
            return `${queryKey}=${queryValue ? 1 : 0}`
        } else
            return `${queryKey}=${queryValue}`
    })
    return query;
} 

exports.GetByQuery = (query, cb) => {
    const url = `${CHORUS}search/?${QueryBuilder(query)}`
    axios.get(url)
    .then((res) => {
        cb(handleResponse(res))
    })
    .catch(err => { console.log(err.message) });
}