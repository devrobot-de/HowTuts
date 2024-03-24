class Loop {

    static callbacks = {};

    static loop() {
        let _this = this;
        window.requestAnimationFrame(function() { Loop.loop.call(_this); });

        for(let name in this.callbacks) {
            let callback = this.callbacks[name];
            if(callback) callback();
        }
    }

    static addLoopCallback(name, callback, context) {
        if(this.callbacks[name]) {
            throw "Loop: There is already a Callback attached with name: " + name;
        }

        let ctx = context;
        let f = function() {
            callback.call(ctx);
        }

        this.callbacks[name] = f;

    }

    static removeLoopCallback(name) {
        if(!this.callbacks[name]) {
            return;
        }
        delete this.callbacks[name];
    }
}