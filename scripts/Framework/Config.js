class Config {
    static appName = "HowTuts";
    static appVersion = "1.0";
    static contentFolder = "contents";
    static devMode = true;
    static useConsoleWrapper = false;

    static init() {
        // ***************
        // INIT FRAMEWORK
        // ***************   
        if(Config.useConsoleWrapper) {
            console = new NConsole();
        }
        
        // Logo füllen
        document.getElementsByClassName("site-logo")[0].innerHTML = Config.appName;
    
        // Footer Infos füllen
        document.getElementsByClassName("footer")[0].innerHTML = Config.appName + " | (C) 2020 | by JAck | Version " + Config.appVersion;
    
        // Loop starten
        Loop.loop();
        Mouse.init();
        Keyboard.init();
        
        // *****************
        // INIT APPLICATION
        // *****************

        let param = window.location.href.split("?")[1];
        HowTut.init(param);
    }
}

var _console = console;

// Wrapper für die Konsole um Ausgabe zu pausieren
class NConsole {
    ispaused = false;

    log(message) {
        if(!this.ispaused) {
            _console.log(message);
        }
    }
    pause () {
        this.ispaused = !this.ispaused;
    }
}

var Symbols = {
    arrow_up: "",
    arrow_down: "\u2BC6",
    arrow_left: "",
    arrow_right: "",
    copy_symbol: "",
    insert_symbol: "",
    undo_symbol: "",
    redo_symbol: "",
    load_symbol: "",
    save_symbol: "",
}

window.onload = Config.init;