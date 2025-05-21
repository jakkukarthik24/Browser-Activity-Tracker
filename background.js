let startTime=null;
let currentDomain=null;
function getCurrentDomain(url){
    try{
        return new URL(url).hostname;
    }
    catch(err){
        return null
    }
}
async function saveTime(domain,duration){
    if(!domain || !duration) return;
    const key=new Date().toISOString().slice(0,10);
    chrome.storage.local.get([key],(result)=>{
        const data=result[key]||{};
        data[domain]=(data[domain]||0)+duration;
        chrome.storage.local.set({[key]:data});
    });
}
setInterval(updateTime, 15000);

function updateTime(){
    if(!startTime || !currentDomain) return;
    const duration=Math.floor((Date.now()-startTime)/1000);
    console.log(`Updating ${currentDomain} with ${duration}s`);
    saveTime(currentDomain,duration);
    startTime=Date.now();
}
chrome.runtime.onInstalled.addListener(() => {
  console.log("Service Worker installed!");
});

chrome.tabs.onActivated.addListener(async ({tabId})=>{
    updateTime();
    try{
        const tab =await chrome.tabs.get(tabId);
    currentDomain=getCurrentDomain(tab.url);
    if(currentDomain){
        startTime=Date.now();
    }
    }
    catch(err){
        console.error("Error getting tab info:", err);
    }
})
chrome.tabs.onUpdated.addListener((tabId,changeInfo,tab)=>{
    if(tab.active && changeInfo.status==="complete"){
        updateTime();
        currentDomain=getCurrentDomain(tab.url);
        startTime=Date.now();
    }
})
chrome.idle.onStateChanged.addListener((newstate)=>{
    if(newstate!=="active") updateTime();
})
