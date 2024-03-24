class EventManager {
    static listeners = {};

    static addEventListener(name, target, type, callback, context) {
        if(this.listeners[name]) {
            
            throw "EventManager: There is already a Listener attached with name: " + name;
        }         

        let f = function() {
            callback.call(context, event);
        }

        let listener = { target: target, type: type, callback: f};

        target.addEventListener(type, f);

        if(name != "") this.listeners[name] = listener;
    }

    static addButtonClickListener(target, callback, context) {
        this.addEventListener("", target, "click", callback, context);
    }

    static removeEventListener(name) {
        if(!this.listeners[name]) {
            return;
        }

        let listener = this.listeners[name];
        let type = listener.type;
        let callback = listener.callback;
        let target = listener.target;

        target.removeEventListener(type, callback);

        delete this.listeners[name];
    }
}