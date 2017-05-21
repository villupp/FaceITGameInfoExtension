var options = (function () {
    return {
        debugEnabled: false,
        svcUrl: 'http://:/api/sendMessage',
        channelId: "",
        authHeader: ''
    }
})();

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        var message = request.message;

        if (message == null || message == "") return;

        var bodyObj = {};
        bodyObj.channelID = options.channelId;
        bodyObj.message = message;

        $.ajax({
            url: options.svcUrl,
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': options.authHeader
            },
            data: JSON.stringify(bodyObj),
            success: function (result) {
                writeLog("Succesfully sent: " + JSON.stringify(result));
            },
            error: function (err) {
                writeLog('Error: ' + JSON.stringify(err));
            }
        });
    }
);

function writeLog(message) {
    if (options.debugEnabled)
        console.log("FMI BG page: " + message);
}
