/**
 * Created by YosefF on 8/7/2018.
 */
let malam_inject_hours = function () {
    chrome.storage.sync.get('eHarmonyJson', function(data) {
        let json = data;
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(
                tabs[0].id,
                { file: "inject.js" },
                function() {
                    chrome.tabs.executeScript(
                        tabs[0].id,
                        {
                            code: 'var insertHours = ' + JSON.stringify(json) + ';\n' +
                            'processInsertHours(insertHours.eHarmonyJson);\n'
                        });
                });
        });
    });
};
