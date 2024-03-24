class ImageHighlighter {

    // VARIABLES 

    content = null;
    image = null;
    contentcontainer = null;
    imagewrapper = null;
    clickzoneFrame = null;
    textzoneFrames = null;
    textzoneTexts = ""
    targetframe = null;

    mousedownposition = null;
    mouseposition = null;

    div_clickzone = null;
    div_textzone = null;

    clickzonecallback = null;
    clickzonecontext = null;

    draginProgress = false;

    highlightzoneFrames = [new Rectangle()];
    
    // GETTER AND SETTER

    addCallback(callback, context) {
        this.clickzonecallback = callback;
        this.clickzonecontext = context;
    }

    removeImage() {
        this.image = null;
        this.imagewrapper.innerHTML = "";
    }

    setImage(image) {
        this.image = image || null;
        this.imagewrapper.innerHTML = "";
        if (!image) return;
        this.image.setAttribute("draggable", "false");
        this.image.classList.add("tutimage");
        this.image.style.userSelect = "none";
    }

    setClickzoneFrame(frame) {
        frame = frame || new Rectangle();
        this.clickzoneFrame = frame;
    }

    getClickzoneFrame() {
        return this.clickzoneFrame;
    }

    setTextzoneFrames(frame) {
        frame = frame || new Rectangle();
        this.textzoneFrames = frame;
    }

    getTextzoneFrames() {
        return this.textzoneFrames;
    }

    setTextzoneTexts(text) {
        this.textzoneTexts = text || [];
    }

    setHighlightzoneFrames(frames) {
        frames = frames || [];
        this.highlightzoneFrames = frames;
    }

    getHighlightzoneFrames() {
        return this.highlightzoneFrames;
    }

    // CONSTRUCTOR

    constructor(content) {
        this.content = content;
        this.content.setAttribute("draggable", "false");
        this.content.style.userSelect = "none";

        this.contentcontainer = Content.makeDiv();
        this.contentcontainer.setAttribute("draggable", "false");
        this.contentcontainer.classList.add("tutcontentcontainer", "relative");
        this.content.appendChild(this.contentcontainer);

        this.imagewrapper = Content.makeDiv();
        this.imagewrapper.setAttribute("draggable", "fale");
        this.imagewrapper.classList.add("tutimagewrapper", "relative");
        this.contentcontainer.appendChild(this.imagewrapper);
        
        EventManager.addEventListener("", window, "resize", this.onWindowResize, this);
    }

    // METHODS

    startRecordClickzone() {
        this.targetframe = this.clickzoneFrame;
        this.startRecord();
    }

    startRecordTextzone(index) {
        index = index || 0;
        if(!this.textzoneFrames[index]) {
            this.textzoneFrames[index] = new Rectangle();
        }
        this.targetframe = this.textzoneFrames[index];
        this.startRecord();
    }

    startRecordHighlightzone(index) {
        if(!this.highlightzoneFrames[index]) {
            this.highlightzoneFrames[index] = new Rectangle();
        }
        this.targetframe = this.highlightzoneFrames[index];
        this.startRecord();
    }

    startRecord() {
        EventManager.addEventListener("ImageRecordDown", this.imagewrapper, "mousedown", this.onMouseDown, this);
        EventManager.addEventListener("ImageRecordUp", this.imagewrapper, "mouseup", this.onMouseUp, this);
        Loop.addLoopCallback("ImageRecordUpdate", this.update, this);
    }

    stopRecord() {
        EventManager.removeEventListener("ImageRecordDown");
        EventManager.removeEventListener("ImageRecordUp");
        Loop.removeLoopCallback("ImageRecordUpdate");
    }

    // EVENT CALLBACKS

    onMouseDown(event) {
        this.draginProgress = true;
        this.targetframe.set(0, 0, 0, 0);
        let bounds = this.imagewrapper.getBoundingClientRect();
        this.mousedownposition = Mouse.getMousePosition().diff(new Point(bounds.x, bounds.y));
        this.draw();
    }
    onMouseUp(event) {
        this.draginProgress = false;
        this.draw();
    }

    onWindowResize(event) {
        this.draw();
    }

    // UPDATE AND DRAW
    
    update() {
        if (this.draginProgress) {
            let bounds = this.image.getBoundingClientRect();
            this.mouseposition = Mouse.getMousePosition().diff(new Point(bounds.x, bounds.y));

            if (!Content.checkBounds(this.image, Mouse.getMousePosition())) return;

            this.targetframe.x = Math.min(this.mousedownposition.x, this.mouseposition.x);
            this.targetframe.y = Math.min(this.mousedownposition.y, this.mouseposition.y);
            this.targetframe.width = Math.abs(this.mouseposition.x - this.mousedownposition.x);
            this.targetframe.height = Math.abs(this.mouseposition.y - this.mousedownposition.y);
            this.draw();
        }
    }

    draw() {
        this.imagewrapper.innerHTML = "";

        if (!this.image) return;
        this.imagewrapper.appendChild(this.image);

        if (this.clickzoneFrame.width > 0) {
            let div = this.appendNewDiv(this.clickzoneFrame);
            div.classList.add("clickzone");
            if(this.clickzonecallback) EventManager.addButtonClickListener(div, this.clickzonecallback, this.clickzonecontext);
        }

        for(let i = 0; i < this.textzoneFrames.length; i++) {
            let frame = this.textzoneFrames[i];
            if (frame.width > 0) {
                let div = this.appendNewDiv(frame);
                div.innerHTML = this.textzoneTexts[i] || "";
                div.classList.add("textzone");
            }
        }

        for(let i = 0; i < this.highlightzoneFrames.length; i++) {
            let frame = this.highlightzoneFrames[i];
            if (frame.width > 0) {
                let div = this.appendNewDiv(frame);
                div.classList.add("highlightzone");
            }
        }
    }

    appendNewDiv(frame) {
        let div = Content.makeDiv();
        div.style.left = frame.x;
        div.style.top = frame.y;
        div.style.width = frame.width;
        div.style.height = frame.height;
        this.imagewrapper.appendChild(div);
        return div;
    }

}