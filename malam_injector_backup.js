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
                'var processInsertHours = function(h) {\n' +
                '    var y = (new Date).getFullYear(), d, v, r, p={}, s, msg;\n' +
                '    var c = h[0].length * (h.length-1);\n' +
                '    for (var i = 0; i < h[0].length; i++) {\n' +
                '        for (var j = 1; j < h.length; j++) {\n' +
                '            if (h[0][i].trim() === "Date") {\n' +
                '                d = h[j][i]+"/"+y;\n' +
                '                v = document.getElementById("pt1:dataTable:"+(j-1)+":clockInDate::content").value;\n' +
                '                if (v !== d) {\n' +
                '                   alert(' +
                '"ERROR: the eHarmony date "+d+" does not match the Malam date "+v+". ' +
                '\\n\\nCANNOT PROCEED - ' +
                'make sure to UNDO all changes (e.g. reload page), THEN choose the same date range that you are trying to import.");\n' +
                '                   return false;\n' +
                '                }\n' +
                '                p[h[j][2]] = 0;\n' +
                '            }\n' +
                '            else if (h[0][i].trim() === "Entry") {\n' +
                '                document.getElementById("pt1:dataTable:"+(j-1)+":clockInTime::content").value=h[j][i];r++;\n' +
                '                p[h[j][2]] += h[j][i] ? 1 : 0;\n' +
                '            }' +
                '            else if (h[0][i].trim() === "Exit") {\n' +
                '                document.getElementById("pt1:dataTable:"+(j-1)+":clockOutTime::content").value=h[j][i];r++;\n' +
                '                p[h[j][2]] += h[j][i] ? 2 : 0;\n' +
                '            }\n' +
                '            else {\n' +
                '                c--;\n' +
                '            }\n' +
                '        }\n' +
                '    }\n' +
                '    msg = "DONE: inserted "+c/3+" rows out of "+(h.length-1)+".";\n' +
                '    s = detectProblems(p);\n' +
                '    if (s) {\n' +
                '        msg += "\\n\\nPROBLEMS:\\n"+s;\n' +
                '    }\n' +
                '    else {\n' +
                '        msg += "\\n\\nNow please REVIEW the changes and press the SAVE button to save.";\n' +
                '    }\n' +
                '    alert(msg);\n' +
                '};\n' +
                '\n' +
                'var detectProblems = function(prob) {\n' +
                '   var r="";' +
                '   for (var d in prob) {\n' +
                '       if (prob[d] === 1) {\n' +
                '           r += "Date: "+d+" is missing Exit\\n";\n' +
                '       }\n' +
                '       else if (prob[d] === 2) {\n' +
                '           r += "Date: "+d+" is missing Entry\\n";\n' +
                '       }\n' +
                '   }\n' +
                '   return r;\n' +
                '};\n' +
                '\n' +
                'processInsertHours(insertHours.eHarmonyJson);' +
                ''});
        });
    });
};
