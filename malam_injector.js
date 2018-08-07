/**
 * Created by YosefF on 8/7/2018.
 */
let malam_inject_hours = function () {
    chrome.storage.sync.get('eHarmonyJson', function(data) {
        let json = data;
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(
                tabs[0].id,
                {code: 'var insertHours = ' + JSON.stringify(json) + ';\n' +
                ' console.log("JSON: "); console.log(insertHours);' +
                'var processInsertHours = function(h) {\n' +
                ' var y = (new Date).getFullYear(), c = 0, r = 0, d = 0;\n' +
                ' for(var i = 0; i < h[0].length; i++) {\n' +
                '  for(var j = 1; j < h.length; j++) {\n' +
                '   if(h[0][i] === "Date") {\n' +
                '    document.getElementById("pt1:dataTable:"+(j-1)+":clockInDate::content").value=h[j][i]+"/"+y; r++;\n' +
                '    document.getElementById("pt1:dataTable:"+(j-1)+":clockOutDate::content").value=h[j][i]+"/"+y;r++;\n' +
                '   }\n' +
                '   else if(h[0][i] === "Entry") {\n' +
                '    document.getElementById("pt1:dataTable:"+(j-1)+":clockInTime::content").value=h[j][i];r++;\n' +
                '   }' +
                '   else if(h[0][i] === " Exit") {\n' +
                '    document.getElementById("pt1:dataTable:"+(j-1)+":clockOutTime::content").value=h[j][i];r++;\n' +
                '   }\n' +
                '  }\n' +
                ' } alert("Inserted "+(r/3)+" rows out of "+(h.length-1));\n' +
                '}\n' +
                'processInsertHours(insertHours.eHarmonyJson);' +
                ''});
        });
    });
};