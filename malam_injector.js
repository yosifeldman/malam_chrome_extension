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
                'console.log("JSON: "); console.log(insertHours);\n' +
                'var processInsertHours = function(h) {\n' +
                '    var y = (new Date).getFullYear(), d, v, r;\n' +
                '    var c = h[0].length * (h.length-1);\n' +
                '    for(var i = 0; i < h[0].length; i++) {\n' +
                '        for(var j = 1; j < h.length; j++) {\n' +
                '            if(h[0][i].trim() === "Date") {\n' +
                '                d = h[j][i]+"/"+y;\n' +
                '                v = document.getElementById("pt1:dataTable:"+(j-1)+":clockInDate::content").value;\n' +
                '                if(v !== d) {\n' +
                '                    alert(' +
                '"ERROR: the eHarmony date "+h[j][i]+" (/"+y+") ' +
                'does not match the Malam date "+v+". ' +
                '\\n\\nCANNOT PROCEED - ' +
                'make sure to UNDO all changes AND check that you are trying to import the correct date range.");\n' +
                '                    return false;\n' +
                '                }\n' +
                '            }\n' +
                '            else if(h[0][i].trim() === "Entry") {\n' +
                '                document.getElementById("pt1:dataTable:"+(j-1)+":clockInTime::content").value=h[j][i];r++;\n' +
                '            }' +
                '            else if(h[0][i].trim() === "Exit") {\n' +
                '                document.getElementById("pt1:dataTable:"+(j-1)+":clockOutTime::content").value=h[j][i];r++;\n' +
                '            }\n' +
                '            else {\n' +
                '                c--;\n' +
                '            }\n' +
                '        }\n' +
                '    } alert("DONE: inserted "+c/3+" rows out of "+(h.length-1)+".' +
                '\\n\\nNow please REVIEW the changes and press the SAVE button to save.");\n' +
                '}\n' +
                'processInsertHours(insertHours.eHarmonyJson);' +
                ''});
        });
    });
};
