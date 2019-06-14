function Validator() {
    var self = this;

    self.fail = function (element, error) {
        var $validationError = $("<div>")
            .addClass("validation")
            .hide()
            .text(error);

        element.parents(".rowContainer")
            .append($validationError)

        $validationError
            .fadeIn(300);
    }

    self.pass = function (element) {

        element.parents(".rowContainer")
            .find(".validation")
            .remove();
    }

    self.getValidators = function (element) {

        var validatorText = element.attr("data-validation");
        var validators = validatorText.split(" ");

        $(validators).each(function (validatorIndex, validator) {
            var parameterStart = validator.indexOf("[");
            var parameterEnd = validator.indexOf("]");

            if (parameterStart !== -1 && parameterEnd !== -1) {

                var validatorName = validator.substring(0, parameterStart);
                var parameterText = validator.substring(parameterStart + 1, parameterEnd);
                validators[validatorIndex] = [validatorName, parameterText.split(",")];
            } else {

                validators[validatorIndex] = [validator];
            }
        });

        return validators;
    }

    self.applyValidation = function (element, validators) {
        var isValid = true;

        self.pass(element);

        for (var validatorIndex = 0; validatorIndex < validators.length && isValid; validatorIndex++) {

            var validator = validators[validatorIndex];
            var checkFunction = self["check" + validator[0]];

            if (checkFunction != null) {
                var result = checkFunction(element, validator[1]);

                if (typeof (result[0]) !== "undefined")
                    isValid = result[0];
                else
                    isValid = result;

                if (!isValid && typeof (result[1]) !== "undefined")
                    self.fail(element, result[1]);
            } else {
                console.log("No such function as " + validator[0] + ". Skipping this one.");
            }
        }

        if (isValid)
            self.pass(element);

        return isValid;
    }

    self.validateElement = function (element) {

        var isValid = true;

        if (element.length > 1) {
            element.each(function (elementIndex, element) {
                if (!self.validateElement($(element)))
                    isValid = false;
            });
        } else {

            var validators = self.getValidators(element);
            if (!self.applyValidation(element, validators))
                isValid = false;
        }

        return isValid;
    }

    self.checkValueRange = function (element, args) {
        if (element.val() === "")
            return true;

        var minValue = args[0];
        var maxValue = args[1];
        var value = Number(element.val());

        if (value < minValue)
            return [false, "Cannot be lower than " + minValue];


        if (value > maxValue)
            return [false, "Cannot be greater than " + maxValue];

        return true;
    }

    self.checkIsNumeric = function (element, args) {

        if (element.val() === "")
            return true;

        if (!isNaN(element.val()))
            return true;

        return [false, "Must be numeric"]
    }

    self.checkRequired = function (element, args) {
        return element.val() === "" ? [false, "Must enter a value"] : true;
    }

    self.checkInteger = function (element, args) {

        if (element.val() === "")
            return true;

        return element.val().indexOf(".") === -1 ? true : [false, "Must be a whole number"];
    }

    self.addEVentHandlers = function (context) {

        context = context || $("body");

        context.on(
            "change",
            "input[data-validation],textarea[data-validation]",
            function () {

                Validator.checkValidation($(this));
            }
        );
    }
}

Validator.checkValidation = function (element) {

    element = element || $("body");

    if (!element.is("[data-validation]"))
        element = element.find("[data-validation]");

    var validator = new Validator();
    return validator.validateElement(element);
}

$(function () {
    var gearCalculator = new GearCalculator();

    var validator = new Validator();
    validator.addEVentHandlers();
});