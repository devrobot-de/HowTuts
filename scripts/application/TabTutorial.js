class TabTutorial {

    static content = null;
    static sidebar = null;

    static imageHighlighter = null;
    static tutorial = null;

    static init() {

        // Tab registrieren
        let container = TabManager.addTab("tab-tutorial", "Tutorial", this);
        this.sidebar = container.children[0];
        this.content = container.children[1];
        this.content.innerHTML = "";

        
        // Init
        this.tutorial = new Tutorial(null);
        this.imageHighlighter = new ImageHighlighter(this.content);
        this.imageHighlighter.addCallback(function(){  this.switchStep(this.tutorial.getIndex() + 1); }, this);

        this.drawSidebar();
        this.drawContent();
    }

    static awake() {
        Keyboard.addKeyDownListener("tut_arrowleft", ["arrowleft"], this.onKeyDown, this);
        Keyboard.addKeyDownListener("tut_arrowright", ["arrowright"], this.onKeyDown, this);
    }

    static sleep() {
        Keyboard.removeKeyDownListener("tut_arrowleft");
        Keyboard.removeKeyDownListener("tut_arrowright");
    }

    static startTutorial(tutorial) {
        this.tutorial = tutorial;
        this.tutorial.preloadImages();
        TabManager.switchTab("tab-tutorial");
        this.drawSidebar();
        this.drawContent();
    }

    static drawSidebar() {
        let sidebar = this.sidebar;
        sidebar.innerHTML = "";
        let index = this.tutorial.getIndex();
        
        // Titel und Beschreibung
        let div_description = Content.makeDiv((this.tutorial.getDescriptionText() || "Bitte ein Tutorial in der 'Übersicht' auswählen."));
        let box_description = Content.makeContentbox(this.tutorial.getTitle() || "Kein Tutorial aktiv", [div_description]);
        box_description.style.fontSize = "20px";
        sidebar.appendChild(box_description);

        // Schritt-Nav-Buttons
        let btn_home = Content.makeButton("Zum Anfang", "Zum Anfang", function() { this.switchStep(0)}, this);
        let btn_prev = Content.makeButton("Zurück", "Schritt vorher", function() { this.switchStep(index - 1)}, this);
        let btn_next = Content.makeButton("Weiter", "Nächster Schritt", function() { this.switchStep(index + 1)}, this);
        let div_navbuttons1 = Content.makeDiv("", [btn_home, btn_prev, btn_next]);
        div_navbuttons1.classList.add("row", "center")

        let div_navbuttons2 = Content.makeDiv("");
        for (let i = 0; i < this.tutorial.getSteps().length; i++) {
            let f = function () {
                this.switchStep(i);
            }
            let btn_step = Content.makeButton("Schritt " + (i + 1), "Schritt " + (i + 1), f, this);
            if(i == index) btn_step.classList.add("toggled");
            btn_step.style.margin = "0 10px 10px 0";

            div_navbuttons2.appendChild(btn_step);
        }

        let box_stepnav1 = Content.makeContentbox("Navigation", [div_navbuttons1]);
        let box_stepnav2 = Content.makeTogglebox("Schritte", [div_navbuttons2]);

        sidebar.appendChild(box_stepnav1);
        sidebar.appendChild(box_stepnav2);

    }

    static drawContent() {
        let filename = this.tutorial.getFilename();
        let image = this.tutorial.getImage(filename);
        if(image) {
            this.imageHighlighter.setImage(image);
        }
        

        this.imageHighlighter.setTextzoneTexts(this.tutorial.getTextzoneTexts());
        this.imageHighlighter.setClickzoneFrame(this.tutorial.getClickzoneFrame());
        this.imageHighlighter.setTextzoneFrames(this.tutorial.getTextzoneFrames());
        this.imageHighlighter.setHighlightzoneFrames(this.tutorial.getHighlightzoneFrames());
        this.imageHighlighter.draw();
    }


    static switchStep(i) {
        this.tutorial.setIndex(i);
        this.drawSidebar();
        this.drawContent();
    }




    // EVENT HANDLER


    static onImageLoad() {
        if (AssetLoader.totalRequests - AssetLoader.finishedRequests == 0) {
            this.updateStep();
        }
    }

    static onbuttonclick(event) {
        if (event.target.id == "btn_home") {



            if (Keyboard.areKeysDown(["control", "shift"])) {
                console.log("C");
            }
            else if (Keyboard.isKeyDown("control")) {
                console.log("B");
            }
            else {
                console.log("A");
            }

            this.stepHome();
        }
        else if (event.target.id == "btn_prev") {
            this.prevStep();
        }
        else if (event.target.id == "btn_next" || event.target.id == "btn_next2") {
            this.nextStep();
        }
    }

    static onKeyDown(name) {
        if (name == "tut_arrowleft") {
            this.switchStep(this.tutorial.getIndex() - 1);
        }
        else if (name == "tut_arrowright") {
            this.switchStep(this.tutorial.getIndex() + 1);
        }
    }
}