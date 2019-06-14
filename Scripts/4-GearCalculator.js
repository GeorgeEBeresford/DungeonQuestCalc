
    function GearCalculator() {
        var self = this;

        self.$maxUpgrades = $("input[data-property-name='MaxUpgrades']");
        self.$maxUpgradesUpgradeCost = $("input[data-property-name='MaxUpgradesUpgradeCost']");
        self.$basePower = $("input[data-property-name='BasePower']");
        self.$currentUpgrades = $("input[data-property-name='CurrentUpgrades']")
        self.$currentUpgradesUpgradeCost = $("input[data-property-name='CurrentUpgradesUpgradeCost']")
        self.$currentPower = $("input[data-property-name='CurrentPower']")
        self.$potential = $("input[data-property-name='Potential']");
        self.$calculatedBasePower = $("input[data-property-name='CalculatedBasePower']");
        self.$upgradeCost = $("input[data-property-name='UpgradeCost']");
        self.$submitPotential = $("button[data-submit='Potential']");
        self.$submitBasePower = $("button[data-submit='BasePower']");
        self.$submitUpgradeCost = $("button[data-submit='UpgradeCost']");
        self.$potentialResults = $("table[data-results='Potential']");
        self.$upgradeCostResults = $("table[data-results='UpgradeCost']");

        self.getRow = function (result, isHeading) {
            var $row = $("<tr>")
                .addClass("resultsContainer_row");

            if (isHeading)
                $row.addClass("resultsContainer_heading");

            if (Array.isArray(result)) {
                $(result).each(function (resultElementIndex, resultElement) {
                    $row.append(
                        $("<td>")
                        .text(resultElement)
                        .addClass("resultsContainer_column")
                    );
                })
            } else if (typeof (result) === "object") {

                var resultKeys = Object.keys(result);

                $(resultKeys).each(function (keyIndex, resultKey) {
                    $row.append(
                        $("<td>")
                        .text(result[resultKey])
                        .addClass("resultsContainer_column")
                    );
                });
            } else {
                $row.append(
                    $("<td>")
                    .text(result)
                    .addClass("resultsContainer_column")
                );
            }

            return $row;
        }

        self.displayResults = function (results, headings, $resultsTable) {

            var $body = $resultsTable.children("tbody");
            var $head = $resultsTable.children("thead");

            $body.html("");
            $head.html("");

            $resultsTable.parents(".hidden").hide();

            if (results.length === 0)
                return;

            if (headings != null && headings.length > 0)
                $resultsTable.children("thead").append(self.getRow(headings, true));

            if (Array.isArray(results)) {
                $(results).each(function (resultIndex, result) {
                    $resultsTable.children("tbody").append(self.getRow(result, false))
                });
            } else {
                $resultsTable.children("tbody").append(self.getRow(result, false))
            }

            $resultsTable.parents(".hidden").fadeIn(300);
        }

        self.calculateBasePower = function (currentUpgrades, currentPower) {
            for (var upradesPurchased = currentUpgrades; upradesPurchased > 0; upradesPurchased--) {
                var cappedDecrease = currentPower - 10;
                var normalDecrease = currentPower / 1.05;

                currentPower = cappedDecrease > normalDecrease ? cappedDecrease : normalDecrease;
            }

            var roundedNumber = Math.round(currentPower);

            self.$calculatedBasePower
                .val(roundedNumber !== 0 ? roundedNumber : "0 (Impossible)")
                .parents(".hidden")
                .hide()
                .fadeIn(300);
        }

        self.calculateUpgradeCost = function (currentUpgrades, maxUpgrades) {

            var results = [];
            var lastUpgradeCost = 100
            var total = 0

            for (var upgradeLevel = 1; upgradeLevel <= maxUpgrades; upgradeLevel++) {

                var nextUpgradeCost;

                if (upgradeLevel > 1) {

                    // find what the cost should be normally
                    var normalUpgradeCost = lastUpgradeCost * 1.06 + 50;

                    // if the difference in price between the current cost and the last cost is greater than 220, cap it at 220.
                    if (normalUpgradeCost - lastUpgradeCost > 220)
                        nextUpgradeCost = lastUpgradeCost + 220
                    else
                        nextUpgradeCost = normalUpgradeCost;
                }
                // If this is our first upgrade, just leave the upgrade cost at the base price.
                else {

                    nextUpgradeCost = lastUpgradeCost;
                }

                // the user will only be interested in the prices for any upgrades they haven't purchased. ignore anything below the current upgrade level.
                if (upgradeLevel > currentUpgrades) {

                    total += nextUpgradeCost

                    results.push([
                        upgradeLevel,
                        Math.floor(nextUpgradeCost),
                        Math.floor(total)
                    ])
                }

                // Set up the last upgraded cost for the next iteration
                lastUpgradeCost = nextUpgradeCost;
            }

            var headings = [
                "Upgrades Purchased (Total)",
                "Upgrade Cost (This level)",
                "Upgrade Cost (Total so far)"
            ]

            self.$upgradeCost
                .val(!isNaN(total) ? Math.floor(total) : "∞ (Impossible)")
                .parents(".hidden")
                .hide()
                .fadeIn(300);

            self.displayResults(results, headings, self.$upgradeCostResults)
        }

        self.calculatePotential = function (maxUpgrades, basePower) {

            var results = [];

            for (var upradesPurchased = 1; upradesPurchased <= maxUpgrades; upradesPurchased++) {
                var effectiveIncrement = basePower * 0.05;

                if (effectiveIncrement > 10)
                    effectiveIncrement = 10;

                var roundedIncrement = Math.floor(effectiveIncrement);

                if (roundedIncrement < 1)
                    roundedIncrement = 1;

                basePower += roundedIncrement;

                results.push([
                    upradesPurchased,
                    roundedIncrement,
                    !isNaN(basePower) ? basePower : "∞ (Impossible)"
                ])
            }

            self.$potential
                .val(results[results.length - 1][2])
                .parents(".hidden")
                .hide()
                .fadeIn(300);

            var headings = [
                "Upgrades Purchased",
                "Added Power",
                "Calculated Power"
            ];

            self.displayResults(results, headings, self.$potentialResults);
        }

        self.addEventHandlers = function () {
            self.$submitPotential.on("click",
                function () {
                    if (!Validator.checkValidation($("[data-tab='1']")))
                        return;

                    var maxUpgrades = Number(self.$maxUpgrades.val());
                    var basePower = Number(self.$basePower.val());
                    self.calculatePotential(maxUpgrades, basePower);
                }
            );

            self.$submitBasePower.on("click",
                function () {

                    if (!Validator.checkValidation($("[data-tab='2']")))
                        return;

                    var currentUpgrades = Number(self.$currentUpgrades.val());
                    var currentPower = Number(self.$currentPower.val());
                    self.calculateBasePower(currentUpgrades, currentPower);
                }
            )

            self.$submitUpgradeCost.on("click", function () {

                if (!Validator.checkValidation($("[data-tab='3']")))
                    return;


                var currentUpgrades = Number(self.$currentUpgradesUpgradeCost.val());
                var maxUpgrades = Number(self.$maxUpgradesUpgradeCost.val());

                self.calculateUpgradeCost(currentUpgrades, maxUpgrades);
            });
        }
    }

    $(function () {
        var gearCalculator = new GearCalculator();
        gearCalculator.addEventHandlers();
    });