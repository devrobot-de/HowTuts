class Keyboard {

    static keys = {};
    static keydownListeners = {};
    static keyupListeners = {};
    static counter = 0;

    static init() {
        let _this = this;
        document.addEventListener("keydown", function (event) { _this.onKeyDown.call(_this, event); });
        document.addEventListener("keyup", function (event) { _this.onKeyUp.call(_this, event); });
    }

    static isKeyDown(key) {
        key = this.prepareKey(key);
        return this.keys[key] || false;
    }

    static areKeysDown(keys) {
        let down = true;
        for(let i = 0; i < keys.length; i++) {
            let key = keys[i].toLowerCase();
            down = down && this.isKeyDown(key);

        }
        return down;
    }


    static isKeyUp(key) {
        key = this.prepareKey(key);
        return !(this.keys[key] || false);
    }

    static areKeysUp(keys) {
        let up = true;
        for(let i = 0; i < keys.length; i++) {
            let key = keys[i].toLowerCase();
            up = up && this.isKeyUp(key);

        }
        return up;
    }

    static addKeyDownListener(name, keys, callback, context) {
        this.addKeyListener(this.keydownListeners, name, keys, callback, context);
    }

    static addKeyUpListener(name, keys, callback, context) {
        this.addKeyListener(this.keyupListeners, name, keys, callback, context);
    }

    static addKeyListener(list, name, keys, callback, context) {
        this.counter++;
        name = name || "key_listener_" + this.counter;

        if(list[name]) {
            throw "Keyboard: There is already a key Listener attached with name: " + name;
        }

        for(var i = 0; i < keys.length; i++) {
            keys[i] = keys[i].toLowerCase();
        }

        list[name] = { keys: keys, callback: callback, context: context };
    }

    static removeKeyDownListener(name) {
        this.removeKeyListener(this.keydownListeners, name);
    }
    
    static removeKeyUpListener(name) {
        this.removeKeyListener(this.keyupListeners, name);
    }
    
    static removeKeyListener(list, name) {
        if(!list[name]) {
            throw "Keyboard: There is no key Listener attached with name: " + name;
        }
        delete list[name];
    }

    // Event Listener
    static onKeyDown(event) {
        if(event.repeat) return;
        this.handleEvent(this.keydownListeners, true, event);
    }

    static onKeyUp(event) { 
        this.handleEvent(this.keyupListeners, false, event);
    }

    static handleEvent(list, state, event) {
        let key = this.prepareKey(event.key);
        this.keys[key] = state;
        let up = false; 
        if(list == this.keyupListeners) {
            up = true;
        }

        // EventListener durchlaufen
        for(let name in list) {
            let listener = list[name];

            let keys = listener.keys;
            if(keys.includes(key)) {
                if(up) {
                    if(this.areKeysUp(keys)) {
                        listener.callback.call(listener.context, name);
                        event.preventDefault();
                    }
                }
                else {
                    if(this.areKeysDown(keys)) {
                        listener.callback.call(listener.context, name);
                        event.preventDefault();
                    }
                }
            }
        }
    }

    static prepareKey(key) {
        key = key.toLowerCase();
        if(key == " ") key = "space";
        return key;
    }

    
}