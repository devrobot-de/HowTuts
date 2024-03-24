class Data {

    static saveStringAsJSonFile(data) {
        // Source: https://stackoverflow.com/questions/25590486/creating-json-file-and-storing-data-in-it-with-javascript
        // Source: https://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript
        var datastr = JSON.stringify(data);
        this.saveFile(datastr);
    }

    static saveFile(data, filename, type) {

        // Source: https://stackoverflow.com/questions/13405129/javascript-create-and-save-file
        var file = new Blob([data], { type: type });

        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}