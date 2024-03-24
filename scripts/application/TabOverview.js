class TabOverview {

    static selectedCategory = "Alle Kategorien";

    static init() {
        // Tab registrieren
        let container = TabManager.addTab("tab-overview", "Übersicht", this);

        this.sidebar = container.children[0];
        this.content = container.children[1];

        this.drawSidebar();
        this.drawContent();
    }

    static drawSidebar() {
        let sidebar = this.sidebar;
        sidebar.innerHTML = "";

        let categories = SourceData.getCategories();
        let list_cats = Content.makeClickList(categories , function(event){ 
            this.selectedCategory = event.target.innerHTML; 
            this.drawSidebar(); 
            this.drawContent(); 
        }, this);
        let box_categories = Content.makeContentbox("Kategorien", [list_cats]);
        sidebar.appendChild(box_categories);

    }

    static drawContent() {
        this.content.innerHTML = "";
        let content = this.content;

        let tutorials = SourceData.getTutorials(this.selectedCategory);

        let arr_tutorials = [];
        for (let i = 0; i < tutorials.length; i++) {
            let tut = tutorials[i];

            let furl = function (event) {
                let url = window.location.href.split("?")[0];
                url += "?id=" + tut.arrayIndex;

                let element = Content.makeTextField(url);
                this.content.appendChild(element);
                element.select();
                document.execCommand("copy");
                this.content.removeChild(element);
                event.stopPropagation();
                event.preventDefault();
            }

            let f = function () {
                TabTutorial.startTutorial(tut);
            }

            let btn_url = Content.makeButton("URL kopieren", "", furl, this);
            btn_url.classList.add("item-right");
            btn_url.style.marginRight = "10px";
            let btn_tut = Content.makeButton("Tutorial starten", "", f, this);
            let div_title = Content.makeDiv(tut.getTitle());
            let div_tut = Content.makeDiv("", [div_title, btn_url, btn_tut]);
            div_tut.classList.add("row", "center");
            EventManager.addButtonClickListener(div_tut, f, this);
            arr_tutorials[i] = div_tut;
        }

        arr_tutorials.sort(function(a, b) { return a.children[0].innerHTML.localeCompare(b.children[0].innerHTML)});
        let list_tutorials = Content.makeClickList(arr_tutorials);

        let box_tutorials = Content.makeContentbox("Kategorie: " + this.selectedCategory, [list_tutorials]);
        content.appendChild(box_tutorials);

    }
}