/**
 * Created by YosefF on 8/7/2018.
 */

/*@credits: http://oss.sheetjs.com/js-xlsx/*/
/*jshint browser:true */
/* eslint-env browser */
/* eslint no-use-before-define:0 */
/*global Uint8Array, Uint16Array, ArrayBuffer */
/*global XLSX */
var X = XLSX;
var XW = {
    /* worker message */
    msg: 'xlsx',
    /* worker scripts */
    worker: './xlsxworker.js'
};

var global_wb;

var process_wb = (function() {

    var get_format = (function() {
        var radios = document.getElementsByName( "format" );
        return function() {
            for(var i = 0; i < radios.length; ++i) if(radios[i].checked || radios.length === 1) return radios[i].value;
        };
    })();

    var to_json = function to_json(workbook) {
        console.log('to_json');
        var result = {};
        workbook.SheetNames.forEach(function(sheetName) {
            var roa = X.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
            if(roa.length) result[sheetName] = roa;
        });
        return JSON.stringify(result, 2, 2);
    };

    var to_csv = function to_csv(workbook) {
        console.log('to_csv');
        var result = [];
        workbook.SheetNames.forEach(function(sheetName) {
            var csv = X.utils.sheet_to_csv(workbook.Sheets[sheetName]);
            if(csv.length){
                result.push("SHEET: " + sheetName);
                result.push("");
                result.push(csv);
            }
        });
        return result.join("\n");
    };

    return function process_wb(wb) {
        global_wb = wb;
        var output = "";
        switch(get_format()) {
            case "json": output = to_json(wb); break;
            default: output = to_csv(wb);
        }
        if(typeof console !== 'undefined') console.log("output", new Date());

        // save result to storage and call next handler
        var hours = JSON.parse(output);
        malam_inject_hours({eHarmonyJson: hours['Page 2']});
    };
})();

var do_file = (function() {
    var rABS = typeof FileReader !== "undefined" && (FileReader.prototype||{}).readAsBinaryString;
    var domrabs = document.getElementsByName("userabs")[0];
    if(!rABS) domrabs.disabled = !(domrabs.checked = false);

    var use_worker = typeof Worker !== 'undefined';
    var domwork = document.getElementsByName("useworker")[0];
    if(!use_worker) domwork.disabled = !(domwork.checked = false);

    var xw = function xw(data, cb) {
        console.log('xw3');
        var worker = new Worker(XW.worker);
        worker.onmessage = function(e) {
            switch(e.data.t) {
                case 'ready': break;
                case 'e': console.error(e.data.d); break;
                case XW.msg: cb(JSON.parse(e.data.d)); break;
            }
        };
        worker.postMessage({d:data,b:rABS?'binary':'array'});
    };

    return function do_file(files) {
        rABS = domrabs.checked;
        use_worker = domwork.checked;
        var f = files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            if(typeof console !== 'undefined') console.log("onload", new Date(), rABS, use_worker);
            var data = e.target.result;
            if(!rABS) data = new Uint8Array(data);
            if(use_worker) xw(data, process_wb);
            else process_wb(X.read(data, {type: rABS ? 'binary' : 'array'}));
        };
        if(rABS) reader.readAsBinaryString(f);
        else reader.readAsArrayBuffer(f);
    };
})();

let xlf = document.getElementById('xlf');

function handleFile(e) { do_file(e.target.files); }
xlf.addEventListener('change', handleFile, false);
