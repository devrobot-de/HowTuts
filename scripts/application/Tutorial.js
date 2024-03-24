class Tutorial {
    title = "";
    folder = "";
    categories = "";
    steps = [];
    filelist = [];
    images = {};
    index = 0;
    arrayIndex = -1;

    constructor(data, arrayIndex) {
        this.arrayIndex = arrayIndex == undefined ? -1 : arrayIndex;
        if (data) {
            this.title = data.title || "";
            this.folder = data.folder || "";
            this.categories = data.categories || "";
            this.steps = data.steps || [this.makeStep()];
            this.filelist = data.filelist || [];
            this.index = 0;
        }
        else {
            this.title = "";
            this.folder = ""
            this.categories = "";
            this.steps = [this.makeStep()];
            this.index = 0;
        }
    }

    makeStep() {
        return { filename: "", description: "", textzoneTexts: [""], clickzoneFrame: new Rectangle(), textzoneframes: [new Rectangle()], highlightzoneframes: [new Rectangle()] };
    }

    addStep() {
        this.steps.splice(this.index + 1, 0, this.makeStep());
    }

    removeStep() {
        this.steps.splice(this.index, 1);
    }

    nextStep() {
        this.setIndex(this.index + 1);
    }

    prevStep() {
        this.setIndex(this.index - 1);
    }

    setIndex(index) {
        if (index >= this.steps.length) {
            index = this.steps.length - 1;
        }

        if (index < 0) {
            index = 0;
        }

        this.index = index;
    }

    getIndex() {
        return this.index;
    }

    getDataString() {
        let data = {};
        data.title = this.title;
        data.folder = this.folder;
        data.categories = this.categories;
        data.steps = this.steps;
        data.filelist = this.filelist;

        let datastr = JSON.stringify(data);
        return datastr;
    }

    loadImage(filename) {
        if(!filename) {
            return null;
        }

        let image = null;
        if (!this.images[filename]) {
            image = new Image();
            image.src = "contents/" + this.folder + "/" + filename;
            this.images[filename] = image;
        }
        else {
            image = this.images[filename];
        }

        return image;
    }

    preloadImages() {
        for(let i = 0; i < this.filelist.length; i++) {
            let filename = this.filelist[i];
            this.loadImage(filename);
        }
    }

    getImage(filename) {
        return this.loadImage(filename);
    }

    getSteps() {
        return this.steps;
    }

    setFileList(list) {
        this.filelist = list;
    }

    getFileList() {
        return this.filelist;
    }

    setTitle(title) {
        this.title = title;
    }

    getTitle() {
        return this.title;
    }

    setCategories(categories) {
        this.categories = "Alle Kategorien, " + categories;
    }

    getCategories() {
        return this.categories;
    }

    getCategoriesArray() {
        let arr = this.categories.split(",");
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].trim();
            if (arr[i] == "") {
                arr.splice(i, 1);
                i--;
            }
        }

        if(!arr.includes("Alle Kategorien")) {
            arr.push("Alle Kategorien");
        }

        return arr;
    }

    setFolder(folder) {
        this.folder = folder;
    }

    getFolder() {
        return this.folder;
    }

    setFilename(filename) {
        this.steps[this.index].filename = filename;
    }

    getFilename(index) {
        if (index == undefined) index = this.index;
        return this.steps[index].filename;
    }

    setDescriptionText(text) {
        this.steps[this.index].description = text;
    }

    getDescriptionText(index) {
        if (index == undefined) index = this.index;
        return this.steps[index].description;
    }

    setClickzoneFrame(frame) {
        this.steps[this.index].clickzoneFrame = frame;
    }

    getClickzoneFrame(index) {
        if (index == undefined) index = this.index;
        return this._makeCopy(this.steps[index].clickzoneFrame);
    }




    

    setTextzoneTexts(texts) {
        this.steps[this.index].textzoneTexts = texts;
    }

    setTextzoneText(index, text) {
        this.steps[this.index].textzoneTexts[index] = text;
    }

    getTextzoneTexts(index) {
        if (index == undefined) index = this.index;
        return this.steps[index].textzoneTexts;
    }

    removeTextzoneText() {
        let texts =  this.steps[this.index].textzoneTexts;
        texts.splice(texts.length -1, 1);
    }

    addTextzoneText() {
        this.steps[this.index].textzoneTexts.push("");
    }


    setTextzoneFrames(frames) {
        this.steps[this.index].textzoneframes = frames;
    }

    getTextzoneFrames(index) {
        if (index == undefined) index = this.index;
        let frames = this.steps[index].textzoneframes;
        if(!frames) return;
        let copies = [];
        for(let i = 0; i < frames.length; i++) {
            copies[i] = this._makeCopy(frames[i]);
        }
        return copies || [];
    }

    removeTextzoneFrame(index) {
        frames =  this.steps[this.index].textzoneframes;
        frames.splice(index, 1);
    }

    addTextzoneFrame() {
        this.steps[this.index].textzoneframes.push(new Rectangle());
    }





    setHighlightzoneFrames(frames) {
        this.steps[this.index].highlightzoneframes = frames;
    }

    getHighlightzoneFrames(index) {
        if (index == undefined) index = this.index;
        let frames = this.steps[index].highlightzoneframes;

        if(!frames) return [];

        let copies = [];
        for(let i = 0; i < frames.length; i++) {
            copies[i] = this._makeCopy(frames[i]);
        }

        return copies || [];
    }
    
    removeHighlightzoneFrame(index) {
        frames =  this.steps[this.index].highlightzoneframes;
        frames.splice(index, 1);
    }

    addHighlightzoneFrame() {
        this.steps[this.index].highlightzoneframes.push(new Rectangle());
    }

    _makeCopy(original) {
        let copy = new Rectangle();
        copy.setCopy(original);
        return copy;
    }


}