/**
 * Created by yosefF on 9/5/2018.
 */
var processInsertHours = function (data) {

    // validate eHarmony from and to dates against Malam from and to dates
    let malamFrom = getFirstOfMonth(), malamTo = getLastOfMonth();
    if(!isLaterInTheMonth(data.fromDate, malamFrom)) {
        wrongDateAlert("The date "+data.fromDate+" is invalid.");
        return false;
    }
    if(!isLaterInTheMonth(data.toDate, malamTo)) {
        wrongDateAlert("The date "+data.toDate+" is invalid.");
        return false;
    }

    let h = data.hoursJson;
    //console.log('hoursJson');
    //console.log(h);

    // parse eHarmony from and to dates
    let from = data.fromDate.split("/"), to = data.toDate.split("/");
    from = new Date(Number(from[2]), Number(from[1]) - 1, Number(from[0]));
    to   = new Date(Number(to[2]), Number(to[1]) - 1, Number(to[0]));
    //console.log('from: ' + from.toISOString());
    //console.log('to: ' + to.toISOString());

    if(from.getYear()!==to.getYear() || from.getMonth()!==to.getMonth()) {
        wrongDateAlert("Sorry! Report for 2 years or 2 months is not supported!");
        return false;
    }

    // go
    let y = from.getFullYear(), d, v, p = {}, s, msg, k, c = h[0].length * (h.length - 1);
    //console.log("C = "+c);
    for (let i = 0; i < h[0].length; i++) {
        for (let j = 1; j < h.length; j++) {
            k = "pt1:dataTable:" + (j - 1);
            if (h[0][i].trim() === "Date") {
                d = h[j][i] + "/" + y;
                v = document.getElementById(k + ":clockInDate::content");
                if (!v) {
                    wrongDateAlert("The eHarmony date " + d + " is not present on this report.");
                    return false;
                }

                // scary, but necessary patch - try to handle the case of new employee, when
                // the eHarmony begins in the middle of the month
                else if (v.value !== d && !isLaterInTheMonth(d, v.value)) {
                    wrongDateAlert("The eHarmony date " + d + " is in wrong month/year. This Malam report is for " + v.value.substr(3) + ".");
                    return false;
                }
                p[h[j][2]] = 0;
            }
            else if (h[0][i].trim() === "Entry") {
                document.getElementById(k + ":clockInTime::content").value = h[j][i];
                p[h[j][2]] += h[j][i] ? 1 : 0;
            }
            else if (h[0][i].trim() === "Exit") {
                document.getElementById(k + ":clockOutTime::content").value = h[j][i];
                p[h[j][2]] += h[j][i] ? 2 : 0;
            }
            else {
                c--;
            }
        }
    }
    msg = "DONE: inserted " + c / 3 + " rows out of " + (h.length - 1) + ".";
    s = detectProblems(p);
    if (s) {
        msg += "\n\nPROBLEMS:\n" + s;
    }
    else {
        msg += "\n\nNow please REVIEW the changes and press the SAVE button to save.";
    }
    alert(msg);
};

var detectProblems = function (prob) {
    let r = "";
    for (let d in prob) {
        if (prob.hasOwnProperty(d)) {
            if (prob[d] === 1) {
                r += "Date: " + d + " is missing Exit\n";
            }
            else if (prob[d] === 2) {
                r += "Date: " + d + " is missing Entry\n";
            }
        }
    }
    return r;
};

var wrongDateAlert = function (t) {
    alert("ERROR: " + t +
        "\n\nCANNOT PROCEED - please do:\n" +
        "   1. make sure you're trying to upload the report for the right month/year" +
        "   2. if yes, - download from eHarmony again, the date range report,\n" +
        "       that is between " + getFirstOfMonth() + " and " + getLastOfMonth() + ".\n" +
        "   3. UNDO all changes on this page (e.g. press OK and reload page).\n" +
        "   4. try to import again.");
};

var getFirstOfMonth = function () {
    return document.getElementById("pt1:dataTable:0:clockInDate::content").value;
};

var getLastOfMonth = function () {
    const e = document.getElementById("pt1:dataTable:30:clockInDate::content");
    if (e) return e.value;
    return document.getElementById("pt1:dataTable:29:clockInDate::content").value;
};

var isLaterInTheMonth = function (issueDate, correctDate) {
    //console.log('issueDate: ' + issueDate + ', correctDate: ' + correctDate);
    var s1 = issueDate.substr(2), s2 = correctDate.substr(2), s3 = issueDate.substr(0,2), s4 = correctDate.substr(0,2);
    return (s1 === s2) && (s3 >= s4);
};