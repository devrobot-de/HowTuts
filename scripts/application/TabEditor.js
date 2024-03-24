class TabEditor {
    static content = null;
    static sidebar = null;
    static folderpicker = null;
    static dropdown = null;
    static images = {};

    static imageHighlighter = null;
    static btn_clickzone = null;
    static btn_textzone = null;
    static btn_highlightzone = null;
    static txt_code = null;
    static txt_importcode = null;

    static editorState = "nofolder"; // nofolder | noimage | image | drawclickzone | drawtextzone | drawhighlightzone

    static sidebarElements = [];
    static stepbuttons = [];

    static tutorial = null;
    static index_highlightframe = 0;
    static index_textframe = 0;

    static init() {
        if (!Config.devMode) return;

        let container = TabManager.addTab("tab-editor", "Editor", this);
        this.sidebar = container.children[0];
        this.content = container.children[1];

        // Clear Content 
        this.content.innerHTML = "";

        // Make Image Highlighter
        this.imageHighlighter = new ImageHighlighter(this.content);

        this.tutorial = new Tutorial();

        this.drawSidebar();
        this.drawContent();

        TabManager.switchTab("tab-editor");

    }

    static drawSidebar() {
        let sidebar = this.sidebar;
        sidebar.innerHTML = "";

        this.sidebarElements.splice(0, this.sidebarElements.length);


        // Schritte-Bereich

        let div_stepbuttons = Content.makeDiv("");

        for (let i = 0; i < this.tutorial.getSteps().length; i++) {

            let f = function () {
                this.switchStep(i);
            }

            let btn_step = Content.makeButton("Schritt " + (i + 1), "Schritt " + (i + 1), f, this);
            if (i == this.tutorial.getIndex()) btn_step.classList.add("toggled");
            btn_step.style.margin = "0 10px 10px 0";
            this.sidebarElements.push(btn_step);
            this.stepbuttons.push(btn_step);


            div_stepbuttons.appendChild(btn_step);

        }

        let fnewstep = function () {
            this.tutorial.addStep();
            this.switchStep(this.tutorial.getIndex() + 1);
            this.sidebar.scroll(0, -2000);
        }

        let fremove = function () {
            this.tutorial.removeStep();
            if (this.tutorial.getSteps().length <= 0) {
                this.tutorial.addStep();
            }
            this.switchStep(0);
        }

        let btn_newstep = Content.makeButton("Neuer Schritt", "Neuen Schritt erstellen", fnewstep, this);
        this.sidebarElements.push(btn_newstep);
        this.stepbuttons.push(btn_newstep);


        let btn_removestep = Content.makeButton("Schritt entfernen", "Schritt entfernen", fremove, this);
        this.sidebarElements.push(btn_removestep);
        this.stepbuttons.push(btn_removestep);

        let stepbox = Content.makeTogglebox("Schritte", [div_stepbuttons, btn_newstep, btn_removestep]);
        sidebar.appendChild(stepbox);



        // Bildauswahl
        let txt_folder = Content.makeTextField(this.tutorial.getFolder(), "Bitte Ordner wählen");
        txt_folder.setAttribute("readonly", "");

        let folderpicker = Content.makeFolderpicker("Ordner auswählen", this.onFolderSelected, this);
        this.folderpicker = folderpicker;
        this.sidebarElements.push(folderpicker);

        let filename = this.tutorial.getFilename();
        let dropdown = Content.makeDropdown(this.tutorial.getFileList(), this.onDropdownChange, this);
        this.dropdown = dropdown;
        if (filename) {
            dropdown.setValue(filename);
        }
        this.sidebarElements.push(dropdown);


        let filebox = Content.makeContentbox("Bildauswahl", [txt_folder, folderpicker, dropdown]);
        filebox.classList.add("filebox");
        sidebar.appendChild(filebox);



        // Beschreibung des Schritts

        let txt_descriptioninput = Content.makeTextArea(this.tutorial.getDescriptionText() || "Schritt " + (this.tutorial.getIndex() + 1) + ": ", "Beschreibung", this.onDescriptionInput, this);
        txt_descriptioninput.classList.add("txt_descriptioninput");
        let descriptionbox = Content.makeContentbox("Beschreibung", [txt_descriptioninput]);
        sidebar.appendChild(descriptionbox);






        // Klick-Bereich
        let btn_clickzone = Content.makeButton("Bereich definieren", "Bereich definieren", this.onDefineClickzoneClick, this);
        let clickzonebox = Content.makeContentbox("Klick-Bereich", [btn_clickzone]);
        this.btn_clickzone = btn_clickzone;
        sidebar.appendChild(clickzonebox);
        this.sidebarElements.push(btn_clickzone);

        


        // Textfeld-Bereich
        let txt_textzonearea = Content.makeTextArea(this.tutorial.getTextzoneTexts()[this.index_textframe], "Text einfügen", this.onTextzoneInput, this);
        txt_textzonearea.classList.add("txt_descriptioninput");


        let div_textzonebuttons = Content.makeDiv("");

        for (let i = 0; i < this.tutorial.getTextzoneFrames().length; i++) {
            let fswitchframe = function () { this.index_textframe = i; this.drawSidebar(); }
            let btn_frame = Content.makeButton("Frame " + (i + 1), "", fswitchframe, this);
            if (i == this.index_textframe) {
                btn_frame.classList.add("toggled");
            }
            btn_frame.style.margin = "0 10px 10px 0";
            div_textzonebuttons.appendChild(btn_frame);
            this.sidebarElements.push(btn_frame);
        }

        let fnewtextframe = function () {
            this.tutorial.addTextzoneFrame();
            this.tutorial.addTextzoneText();
            this.index_textframe = this.tutorial.getTextzoneFrames().length - 1;

            this.drawSidebar();
            this.drawContent();
        }

        let fremovetextframe = function () {
            this.tutorial.removeTextzoneFrame(this.index_textframe);
            this.tutorial.removeTextzoneText(this.index_textframe);
            if (this.index_textframe >= this.tutorial.getTextzoneFrames().length) {
                this.index_textframe--;
            }
            if (this.index_textframe < 0) {
                this.index_textframe = 0;
                this.tutorial.addTextzoneFrame();
                this.tutorial.addTextzoneText();
            }
            this.drawSidebar();
            this.drawContent();
        }

        let btn_newtextframe = Content.makeButton("Neuer Frame", "", fnewtextframe, this);
        this.sidebarElements.push(btn_newtextframe);

        let btn_removetextframe = Content.makeButton("Frame entfernen", "", fremovetextframe, this);
        this.sidebarElements.push(btn_removetextframe);

        let btn_textzone = Content.makeButton("Bereich definieren", "Bereich definieren", this.onDefineTextzoneClick, this);
        this.sidebarElements.push(btn_textzone);

        this.btn_textzone = btn_textzone;
        let textzonebox = Content.makeContentbox("Textfeld", [txt_textzonearea, div_textzonebuttons, btn_newtextframe, btn_removetextframe, btn_textzone]);
        sidebar.appendChild(textzonebox);




        // Highlight-Bereich
        let div_highlightbuttons = Content.makeDiv("");

        for (let i = 0; i < this.tutorial.getHighlightzoneFrames().length; i++) {

            let fswitchframe = function () { this.index_highlightframe = i; this.drawSidebar(); }

            let btn_frame = Content.makeButton("Frame " + (i + 1), "", fswitchframe, this);

            if (i == this.index_highlightframe) {
                btn_frame.classList.add("toggled");
            }

            btn_frame.style.margin = "0 10px 10px 0";
            div_highlightbuttons.appendChild(btn_frame);
            this.sidebarElements.push(btn_frame);
        }

        let fnewframe = function () {
            this.tutorial.addHighlightzoneFrame();
            this.index_highlightframe = this.tutorial.getHighlightzoneFrames().length - 1;
            this.drawSidebar();
            this.drawContent();
        }

        let fremoveframe = function () {
            this.tutorial.removeHighlightzoneFrame(this.index_highlightframe);
            if (this.index_highlightframe >= this.tutorial.getHighlightzoneFrames().length) {
                this.index_highlightframe--;
            }

            if (this.index_highlightframe < 0) {
                this.index_highlightframe = 0;
                this.tutorial.addHighlightzoneFrame();
            }

            this.drawSidebar();
            this.drawContent();
        }


        let btn_newframe = Content.makeButton("Neuer Frame", "", fnewframe, this);
        this.sidebarElements.push(btn_newframe);

        let btn_removeframe = Content.makeButton("Frame entfernen", "", fremoveframe, this);
        this.sidebarElements.push(btn_removeframe);

        let btn_highlightzone = Content.makeButton("Bereich definieren", "", this.onDefineHighlightzoneClick, this);
        this.sidebarElements.push(btn_highlightzone);
        this.btn_highlightzone = btn_highlightzone;

        let highlightbox = Content.makeContentbox("Highlights", [div_highlightbuttons, btn_newframe, btn_removeframe, btn_highlightzone]);
        sidebar.appendChild(highlightbox);





        // Export-Bereich

        let fsavetutname = function (event) {
            let value = event.target.value;
            this.tutorial.setTitle(value);
        }

        let fsavecategories = function (event) {
            let value = event.target.value;
            this.tutorial.setCategories(value);
        }

        let txt_tutname = Content.makeTextField(this.tutorial.getTitle(), "Name des Tutorials", fsavetutname, this);
        let txt_tutcat = Content.makeTextField(this.tutorial.getCategories(), "Kategorien (Durch Komma getrennt)", fsavecategories, this);
        let txt_code = Content.makeTextArea("", "Bitte drücke 'Code erzeugen' um den Tutorial-Code zu generieren");
        this.txt_code = txt_code;

        let fexport = function () {

            this.txt_code.value = this.tutorial.getDataString();

        }

        let fcopy = function () {
            var element = this.txt_code;
            element.select();
            document.execCommand("copy");
            return false;
        }

        let btn_export = Content.makeButton("Code erzeugen", "Code erzeugen", fexport, this);
        let btn_exportcopy = Content.makeButton("Copy to Clipboard", "Copy to Clipboard", fcopy, this);
        let exportbox = Content.makeTogglebox("Export & Meta", [txt_tutname, txt_tutcat, txt_code, btn_export, btn_exportcopy]);
        sidebar.appendChild(exportbox);
        this.sidebarElements.push(btn_export);
        this.sidebarElements.push(btn_exportcopy);

        // Import-Bereich


        let txt_importcode = Content.makeTextArea("", "Bitte Code zum importieren einfügen.");
        this.txt_importcode = txt_importcode;

        let fimport = function () {
            let val = this.txt_importcode.value;
            if (!val) return;
            let json = JSON.parse(val);
            this.tutorial = new Tutorial(json);
            this.drawSidebar();
            this.drawContent();
        }

        let btn_import = Content.makeButton("Importieren", "", fimport, this);
        let importbox = Content.makeTogglebox("Import", [txt_importcode, btn_import]);
        sidebar.appendChild(importbox);
        this.sidebarElements.push(btn_import);



        if (this.tutorial.getFileList().length == 0) {
            this.changeState("nofolder");
        }
        else if (this.tutorial.getFilename()) {
            this.changeState("image");
        }
        else {
            this.changeState("noimage");
        }

    }

    static drawContent() {
        let filename = this.tutorial.getFilename();
        let image = this.tutorial.getImage(filename);
        this.imageHighlighter.setImage(image);
        this.imageHighlighter.setTextzoneTexts(this.tutorial.getTextzoneTexts());
        this.imageHighlighter.setClickzoneFrame(this.tutorial.getClickzoneFrame());
        this.imageHighlighter.setTextzoneFrames(this.tutorial.getTextzoneFrames());
        this.imageHighlighter.setHighlightzoneFrames(this.tutorial.getHighlightzoneFrames());
        this.imageHighlighter.draw();
    }


    static onFolderSelected(event) {
        let picker = this.folderpicker;
        let dropdown = this.dropdown;
        let files = picker.getFiles();

        if (files.length == 0) {
            return;
        };

        // Ordner speichern
        let folder = files[0].webkitRelativePath.split("/")[0];
        this.tutorial.setFolder(folder);

        // Dropdown füllen
        dropdown.clearOptions();
        this.tutorial.setFileList([]);

        // First add an empty option
        this.tutorial.getFileList().push(" ");

        for (var i = 0; i < files.length; i++) {
            let filename = files[i].name
            this.tutorial.getFileList().push(filename);
        }

        this.drawSidebar();
    }

    static onDropdownChange(event) {
        let dropdown = this.dropdown;
        let filename = dropdown.getSelctedOption();

        if (filename == "") {
            this.changeState("noimage");
            return;
        }
        else {
            this.changeState("image");
        }

        this.tutorial.setFilename(filename);
        this.drawContent();
    }

    static onDefineClickzoneClick(event) {
        if (event.target.value == "Stopp") {
            this.imageHighlighter.stopRecord();
            event.target.value = "Bereich definieren";
            this.tutorial.setClickzoneFrame(this.imageHighlighter.getClickzoneFrame());
            this.changeState("image");
        }
        else {
            this.imageHighlighter.startRecordClickzone();
            event.target.value = "Stopp";
            this.changeState("drawclickzone");
        }

    }

    static onDefineTextzoneClick(event) {
        if (event.target.value == "Stopp") {
            this.imageHighlighter.stopRecord();
            event.target.value = "Bereich definieren";
            this.tutorial.setTextzoneFrames(this.imageHighlighter.getTextzoneFrames());
            this.changeState("image");
        }
        else {
            this.imageHighlighter.startRecordTextzone(this.index_textframe);
            event.target.value = "Stopp";
            this.changeState("drawtextzone");

        }
    }

    static onDefineHighlightzoneClick(event) {
        if (event.target.value == "Stopp") {
            this.imageHighlighter.stopRecord();
            event.target.value = "Bereich definieren";
            this.tutorial.setHighlightzoneFrames(this.imageHighlighter.getHighlightzoneFrames());
            this.changeState("image");
        }
        else {
            this.imageHighlighter.startRecordHighlightzone(this.index_highlightframe);
            event.target.value = "Stopp";
            this.changeState("drawhighlightzone");
        }
    }

    static onTextzoneInput(event) {
        let input = event.target;
        let value = input.value;
        this.tutorial.setTextzoneText(this.index_textframe, value);
        this.imageHighlighter.setTextzoneTexts(this.tutorial.getTextzoneTexts());
        this.imageHighlighter.draw();
    }

    static onDescriptionInput(event) {
        let input = event.target;
        let value = input.value;
        this.tutorial.setDescriptionText(value);
    }



    static changeState(state) {
        this.editorState = state;


        // Alle aktivieren
        for (let i = 0; i < this.sidebarElements.length; i++) {
            this.sidebarElements[i].setActive(true);
        }

        // Elements
        let folderpicker = this.folderpicker;
        let dropdown = this.dropdown;
        let btn_clickzone = this.btn_clickzone;
        let btn_textzone = this.btn_textzone;
        let btn_highlightzone = this.btn_highlightzone;

        // nofolder | noimage | image | drawclickzone | drawtextzone | drawhighlightzone

        if (state == "nofolder") {
            // Alle deaktivieren
            for (let i = 0; i < this.sidebarElements.length; i++) {
                this.sidebarElements[i].setActive(false);
            }
            // Stepbuttons aktivieren
            for (let i = 0; i < this.stepbuttons.length; i++) {
                this.stepbuttons[i].setActive(true);
            }
            folderpicker.setActive(true);
            dropdown.setActive(false);
            this.imageHighlighter.removeImage();
        }
        else if (state == "noimage") {
            // Alle deaktivieren
            for (let i = 0; i < this.sidebarElements.length; i++) {
                this.sidebarElements[i].setActive(false);
            }
            // Stepbuttons aktivieren
            for (let i = 0; i < this.stepbuttons.length; i++) {
                this.stepbuttons[i].setActive(true);
            }
            folderpicker.setActive(true);
            dropdown.setActive(true);
            this.imageHighlighter.removeImage();
        }
        else if (state == "image") {
            folderpicker.setActive(true);
            dropdown.setActive(true);
            btn_clickzone.setActive(true);
            btn_textzone.setActive(true);
        }
        else if (state == "drawclickzone") {
            // Alle deaktivieren
            for (let i = 0; i < this.sidebarElements.length; i++) {
                this.sidebarElements[i].setActive(false);
            }
            btn_clickzone.setActive(true);
        }
        else if (state == "drawtextzone") {
            // Alle deaktivieren
            for (let i = 0; i < this.sidebarElements.length; i++) {
                this.sidebarElements[i].setActive(false);
            }
            btn_textzone.setActive(true);
        }
        else if (state == "drawhighlightzone") {
            // Alle deaktivieren
            for (let i = 0; i < this.sidebarElements.length; i++) {
                this.sidebarElements[i].setActive(false);
            }
            btn_highlightzone.setActive(true);
        }
    }





    static switchStep(index) {
        this.tutorial.setIndex(index);
        this.index_highlightframe = 0;
        this.index_textframe = 0;
        this.drawSidebar();
        this.drawContent();
    }

}