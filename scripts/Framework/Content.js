class Content {

    static getElement(name) {
        let element = document.getElementsByClassName(name)[0];
        if (element) {
            return element;
        }
        else {
            throw "No element found with name: " + name;
        }
    }

    static makeElement(type, content, children, attributes) {
        let element = document.createElement(type);
        element.innerHTML = content || "";

        if (children) {
            for (let i = 0; i < children.length; i++) {
                element.appendChild(children[i]);
            }
        }

        if (attributes) {
            for (let i = 0; i < attributes.length; i++) {
                let atr = attributes[i];
                element.setAttribute(atr[0], atr[1]);
            }
        }

        return element;
    }

    static makeDiv(content, children) {
        return this.makeElement("div", content, children);
    }

    static makeH1(value) {
        return this.makeElement("h1", value);
    }

    static makeH2(value) {
        return this.makeElement("h2", value);
    }

    static makeH3(value) {
        return this.makeElement("h3", value);
    }

    static makeButton(value, tooltip, callback, context) {
        let attributes = [["type", "button"]];
        let button = this.makeElement("input", "", null, attributes);
        button.classList.add("button");
        button.value = value;
        button.title = tooltip || value;
        button.isActive = true;

        // Add Callback
        if (callback) {
            context = context || document;
            let f = function (event) { if (button.isActive) { callback.call(context, event); } }
            EventManager.addButtonClickListener(button, f, button);
        }

        button.setActive = function (state) {
            switch (state) {
                case true:
                    button.isActive = true;
                    this.classList.remove("inactive");
                    break;

                case false:
                    button.isActive = false;
                    this.classList.add("inactive");
                    break;
            }
        }

        return button;
    }


    static makeTextField(value, placeholder, callback, context) {
        value = value || "";
        placeholder = placeholder || "";
        let attributes = [["type", "text"], ["value", value], ["placeholder", placeholder]];
        let textfield = this.makeElement("input", "", null, attributes);
        textfield.classList.add("textfield");

        // Add Callback
        if (callback) {
            context = context || document;
            EventManager.addEventListener("", textfield, "input", callback, context);
        }

        return textfield;
    }


    static makeTextArea(value, placeholder, callback, context) {
        value = value || "";
        placeholder = placeholder || "";
        let attributes = [["placeholder", placeholder]];
        let textarea = this.makeElement("textarea", value, null, attributes);
        textarea.classList.add("textarea");
        
        // Add Callback
        if (callback) {
            context = context || document;
            EventManager.addEventListener("", textarea, "input", callback, context);
        }

        return textarea;
    }

    static makeFilepicker(value, callback, context) {
        let picker = this.makeElement("input", "", null, [["type", "file"]]);
        picker.classList.add("invisible");

        // Add Callback
        if (callback) {
            context = context || document;
            EventManager.addEventListener("", picker, "change", callback, context);
        }



        let label = Content.makeElement("label", value, [picker]);
        label.classList.add("button");
        label.getFiles = function () { return this.children[0].files; };
        label.isActive = true;

        // Prevent click if inactive
        let f = function (event) { if (!label.isActive) { event.preventDefault(); } }
        EventManager.addButtonClickListener(label, f, label);


        label.setActive = function (state) {
            switch (state) {
                case true:
                    label.isActive = true;
                    this.classList.remove("inactive");
                    break;

                case false:
                    label.isActive = false;
                    this.classList.add("inactive");
                    break;
            }
        }

        return label;
    }

    static makeFolderpicker(value, callback, context) {
        let pick = this.makeFilepicker(value, callback, context);
        pick.children[0].webkitdirectory = true;
        return pick;
    }

    static makeDropdown(options, callback, context) {
        options = options || [];
        let opts = [];
        for (let i = 0; i < options.length; i++) {
            opts[i] = this.makeElement("option", options[i]);
        }

        let select = this.makeElement("select", "", opts);
        let wrapper = this.makeDiv("", [select]);
        wrapper.classList.add("dropdown");
        wrapper.isActive = true;

        // Add Callback
        if (callback) {
            context = context || document;
            EventManager.addEventListener("", select, "change", callback, context);
        }

        // Prevent click if inactive
        wrapper.setActive = function (state) {
            switch (state) {
                case true:
                    select.disabled = false;
                    select.classList.remove("inactive");
                    break;

                case false:

                    select.disabled = true;
                    select.classList.add("inactive");
                    break;
            }
        }


        wrapper.setOptions = function (options) {
            this.children[0].innerHTML = "";
            options = options || [];
            let opts = [];
            for (let i = 0; i < options.length; i++) {
                this.children[0].appendChild(Content.makeElement("option", options[i]));
            }
        }

        wrapper.addOption = function (option) {
            this.children[0].appendChild(Content.makeElement("option", option));
        }

        wrapper.getOptions = function () {
            let select = this.children[0];
            return select.options;
        }

        wrapper.clearOptions = function () {
            this.children[0].innerHTML = "";
        }

        wrapper.getSelctedOption = function () {
            return this.children[0].value;
        }

        wrapper.setValue = function(value) {
            this.children[0].value = value;
        }

        return wrapper;
    }

    static makeContentbox(title, children) {
        children = children || [];

        let titlediv = this.makeDiv(title);
        titlediv.classList.add("title");
        let titlebar = this.makeDiv();
        titlebar.classList.add("titlebar", "row", "center", "left");
        let contentbox = this.makeDiv();
        contentbox.classList.add("contentbox", "col");

        titlebar.appendChild(titlediv);
        for (let i = 0; i < children.length; i++) {
            contentbox.appendChild(children[i]);
        }


        let box = this.makeDiv("");
        box.classList.add("contentbox");
        box.appendChild(titlebar);
        box.appendChild(contentbox);


        return box;
    }

    static makeTogglebox(title, children) {
        children = children || [];

        let titlediv = this.makeDiv(title);
        titlediv.classList.add("title");
        let box = this.makeDiv();
        box.classList.add("togglebox");
        let titlebar = this.makeDiv();
        titlebar.classList.add("titlebar", "closed", "row", "center", "left");
        let contentbox = this.makeDiv();
        contentbox.classList.add("invisible", "contentbox", "col");

        let toggle = function () {
            this.children[0].classList.toggle("closed");
            this.children[1].classList.toggle("invisible");

            if (button.value == "\u2BC6") { button.value = "\u2BC5" }
            else { button.value = "\u2BC6"; }

            if (button.title == "Öffnen") { button.title = "Schließen" }
            else { button.title = "Öffnen"; }

        }

        let button = this.makeButton("\u2BC6", "Öffnen");
        button.classList.add("item-right");
        EventManager.addButtonClickListener(button, toggle, box);


        titlebar.appendChild(titlediv);
        titlebar.appendChild(button);
        for (let i = 0; i < children.length; i++) {
            contentbox.appendChild(children[i]);
        }
        box.appendChild(titlebar);
        box.appendChild(contentbox);

        box.toggle = toggle;

        return box;
    }

    static makeCanvas(width, height) {
        let canvas = this.makeElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.classList.add("canvas");
        return canvas;
    }

    static makeClickList(values, callback, context) {
        values = values || [];

        let ul = Content.makeElement("ul");
        ul.classList.add("clicklist");
        ul._callback = callback || null;
        ul._context = context || null;

        let fadditem = function(value, callback, context) {
            value = value || "";
            callback = callback || this._callback;
            context = context || this._context;

            let li = null;

            if(typeof value == "string") {
                li = Content.makeElement("li", value);
            }
            else {
                li = Content.makeElement("li");
                li.appendChild(value);
            }
            
            li.classList.add("clicklist-item");

            if(callback) {
                EventManager.addButtonClickListener(li, callback, context);
            }
            
            this.appendChild(li);
        }


        for(let i = 0; i < values.length; i++) {
            fadditem.call(ul, values[i], callback, context);
        }

        ul.addItem = fadditem;

        return ul;
    }

    static CopyText(id) {

    }

    static insertText(sourceId, targetId) {

    }

    static checkBounds(element, position) {
        let bounds = element.getBoundingClientRect();
        let x = bounds.x;
        let y = bounds.y;
        let width = bounds.width;
        let height = bounds.height;

        let px = position.x;
        let py = position.y;

        if (px >= x && px <= (x + width) && py >= y && py <= (y + height)) {
            return true;
        }
        else {
            return false;
        }
    }

}