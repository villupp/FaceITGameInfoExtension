var options = (function() {
    return {
        debugEnabled: false,
    }
})();

tick();

function tick() {
    setTimeout(function() {
        getMatchInfo();
        tick();
    }, 500); 
}

function getMatchInfo() {
    if (window.location.href.indexOf("/room") == -1) return;

    var ipEls = $('.mt-md > span');
    if (ipEls.length > 0) {
        var infoTxt = "Match ready!\n-------------------\n";

        /* Region and map */
        var countryTxt = $('.vote-result__image:eq(0)').attr('alt');
        var mapTxt = $('.vote-result__image:eq(1)').attr('alt');

        switch (countryTxt.toLowerCase()) {
            case "sweden":
                countryTxt = ":flag_se:";
                break;
            case "netherlands":
                countryTxt = ":flag_nl:";
                break;
            case "great britain":
            case "england":
            case "united kingdom":
            case "uk":
            case "gb":
                countryTxt = ":flag_gb:";
                break;
            case "germany":
                countryTxt = ":flag_de:";
                break;
            case "france":
                countryTxt = ":flag_fr:";
                break;
            default:
                break;
        }
 
        /* IP */
        var connectTxt = ipEls.first().text();

        chrome.storage.sync.get(['lastMatchId'], function(returnStorageItem) {
            var url = window.location.href;
            var matchId = url.substring(url.lastIndexOf("/") + 1, url.length);

            if (returnStorageItem.lastMatchId != matchId) {
                sendMessageToBgPage(infoTxt + countryTxt + " | " + mapTxt + "```" + connectTxt + "```");
                var localStorageItem = {};
                localStorageItem['lastMatchId'] = matchId;
                chrome.storage.sync.set(localStorageItem, function() { 
                    writeLog("Succesfully set local storage item");
                });
            }
        });
    }
}

function sendMessageToBgPage(message) {
    chrome.runtime.sendMessage({'message': message}, function(response) {
        writeLog("Succesfully sent message to bg page");
    });
}

function writeLog(message) {
    if (options.debugEnabled)
        console.log("FMI CS: " + message);
}
