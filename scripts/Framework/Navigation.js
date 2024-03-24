
class Navigation {

    static navElements = {};
    static navigationId = "navigation";

    init() {

    }

    static addItem(label, targetId) {
        let nav = Content.getElement(this.navigationId);
        let div = Content.makeDiv(label);
        div.classList.add("nav-element", "nav-" + label);

        if(Object.keys(this.navElements).length == 0) { 
            div.classList.add("active-nav-entry");
        }

        EventManager.addButtonClickListener(div, this.onNavItemClick, this);

        this.navElements[label] = targetId;
        nav.appendChild(div);
    }

    static switchTab(newtabid) {
        Content.getElement("active-nav-entry").classList.toggle("active-nav-entry");

        // Suche nach Label
        for(let label in this.navElements) {
            let id = this.navElements[label];
            if(id == newtabid) {
                Content.getElement("nav-" + label).classList.toggle("active-nav-entry");
            }
        }

    }

    // EVENT HANDLER

    static onNavItemClick(ev) {

        //Content.getElement("active-nav-entry").classList.toggle("active-nav-entry");
        //ev.target.classList.toggle("active-nav-entry");

        for (let i = 0; i < ev.target.classList.length; i++) {
            let name = ev.target.classList[i].split("-")[1];
            if (Navigation.navElements[name]) {
                TabManager.switchTab(Navigation.navElements[name])
            }
        }
    }
}
