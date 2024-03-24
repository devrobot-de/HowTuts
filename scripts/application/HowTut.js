class HowTut {

    static tutorials = {};

    static activeTutorial = null;

    static init(param) {
        TabOverview.init();
        TabTutorial.init();
        TabEditor.init();

        
        if(param) {
            let split = param.split("=");
            let key = split[0];
            let value = split[1];

            TabTutorial.startTutorial(SourceData.getTutorial(value));
        }
    }

    
}