class Mouse {

    static currentState = null;

    static init() {

        this.currentState = { left: false, middle: false, right: false, position: new Point(0,0), };
        
        let _this = this;
        document.addEventListener("mousedown", function (event) { _this.onDown.call(_this, event); });
        document.addEventListener("mouseup", function (event) { _this.onUp.call(_this, event); });
        document.addEventListener("mousemove", function (event) { _this.onMove.call(_this, event); });
        document.addEventListener("contextmenu", function (event) { _this.onContextMenu.call(_this, event); });
    }

    static isButtonDown(button) {
        return this.currentState[button];
    }

    static getMousePosition() {
        return new Point(this.currentState.position.x, this.currentState.position.y);
    }

    // EVENT HANDLER
    static onMove(event) {
        this.currentState.position.x = event.clientX;
        this.currentState.position.y = event.clientY;
    }

    static onDown(event) {
        this.setButton(event.button, true);
    }

    static onUp(event) {
        this.setButton(event.button, false);
    }

    static onContextMenu(event) {
        if(!Config.devMode) {
            event.preventDefault();
        }
        
    }

    static setButton(id, value) {
        let button = "";
        switch (id) {
            case 0:
                button = "left";
                break;
            case 1:
                button = "middle";
                break;
            case 2:
                button = "right";
                break;
        }

        this.currentState[button] = value;
    }

}