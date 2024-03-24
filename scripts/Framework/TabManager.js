class TabManager {
    static tabs = {};

    static addTab(name, label, tabController) {
        let tabContainer = this.getElement("tabs");

        let sidebar_id = "sidebar_" + name;
        let content_id = "content_" + name;

        let sidebarDiv = Content.makeDiv("Sidebar: " + label);
        sidebarDiv.classList.add("sidebar", sidebar_id);
        let contentDiv = Content.makeDiv("Content: " + label);
        contentDiv.classList.add("content", content_id);
        let tabDiv = Content.makeDiv("", [sidebarDiv, contentDiv]);
        tabDiv.classList.add(name, "row", "invisible");

        // content-wrapper row
        if(Object.keys(this.tabs).length == 0) { 
            tabDiv.classList.remove("invisible");
        }

        this.tabs[name] = { tabDiv: tabDiv, controller: tabController };
        Navigation.addItem(label, name);
        tabContainer.appendChild(tabDiv);

        return tabDiv;
    }

    static switchTab(name) {
        for(let _name in this.tabs) {
            let tabDiv = this.tabs[_name].tabDiv;
            let controller = this.tabs[_name].controller;
            if(!tabDiv.classList.contains("invisible")) {
                tabDiv.classList.add("invisible");
                if(controller.sleep) {
                    controller.sleep();
                }
            }
        }

        this.tabs[name].tabDiv.classList.remove("invisible");
        let controller = this.tabs[name].controller;
        if(controller.awake) {
            controller.awake();
        }
        

        Navigation.switchTab(name);

    }

    // HELPER

    static getElement(name) {
        let element = document.getElementsByClassName(name)[0];
        if (element) {
            return element;
        }
        else {
            throw "No element found with name: " + name;
        }
    }
}