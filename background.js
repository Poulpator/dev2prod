
function getTempo(corres){
    prod2dev = {}
    dev2prod = {}
    all_correspondance = {}

    for (let i = 0; i < corres.length; i++) {
        const element = corres[i];
        
        dev2prod[element[0]] = element[1];
        prod2dev[element[1]] = element[0];
    }
    all_correspondance = {...dev2prod, ...prod2dev};

    return [prod2dev,
            dev2prod,
            all_correspondance]
}




function switchBetweenDevAndProd(tab){
    var url = new URL(tab.url)
    var hostname = url.hostname;
    

    browser.storage.local.get("correspondance").then((res)=>{

        //optimisation: caculer quand ajout dans les options
        corres = res["correspondance"]
        // prod2dev = {}
        // dev2prod = {}
        // all_correspondance = {}

        // for (let i = 0; i < corres.length; i++) {
        //     const element = corres[i];
            
        //     dev2prod[element[0]] = element[1];
        //     prod2dev[element[1]] = element[0];
        // }
        // all_correspondance = {...dev2prod, ...prod2dev};

        var tmp = getTempo(corres);
        prod2dev = tmp[0];
        dev2prod = tmp[1];
        all_correspondance = tmp[2];
        
        if(hostname in all_correspondance === false){
            browser.runtime.openOptionsPage();
            return;
        }
    


        browser.tabs.update({url: "https://"+ all_correspondance[hostname] + url.pathname})
    })


}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    var url = new URL(tab.url)
    var hostname = url.hostname;

    browser.storage.local.get("correspondance").then((res)=>{
        corres = res["correspondance"]
        var tmp = getTempo(corres);
        prod2dev = tmp[0];
        dev2prod = tmp[1];
        all_correspondance = tmp[2];
        var icon
        if(hostname in dev2prod){
            icon = "icons/west.png";
        }
        else if(hostname in prod2dev) {
            icon = "icons/east.png";
        }
        else{
            icon = "icons/border-48.png";
        }
        browser.browserAction.setIcon({path: icon})
    })
});

browser.browserAction.onClicked.addListener((tab) => {
    switchBetweenDevAndProd(tab);
  });

