
    function TabSwitcher() {
        var self = this;
        this.$tabs = $("li[data-tab]");
        this.$tabButtons = $("li[data-activates-tab]");

        self.addEventHandlers = function () {

            self.$tabButtons.on("click", function () {
                var $relatedButton = $(this);
                var relatedTabId = $relatedButton.attr("data-activates-tab");
                var $relatedTab = self.$tabs.filter("[data-tab='" + relatedTabId + "']");

                self.$tabs.hide();
                $relatedTab.fadeIn(300);

                self.$tabButtons.removeClass("active");

                $relatedButton.addClass("active");
            });
        }

        self.initialise = function () {

            self.addEventHandlers();
            self.$tabButtons.first().trigger("click");
        }
    }


    $(function () {

        var tabSwitcher = new TabSwitcher();
        tabSwitcher.initialise();
    });