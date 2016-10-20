var CassManagerScreen = function() {
    EcScreen.call(this);
};
CassManagerScreen = stjs.extend(CassManagerScreen, EcScreen, [], function(constructor, prototype) {
    prototype.data = null;
    prototype.setData = function(data) {
        this.data = data;
    };
    prototype.autoFill = function(scope, obj) {
        var props = (obj);
        for (var key in props) {
            this.fillInnerString(scope, obj, key);
        }
        for (var key in props) {
            this.fillInnerArray(scope, obj, key);
        }
    };
    prototype.fillInnerString = function(scope, dataObj, key) {
        var a = (dataObj);
        var v = a[key];
        var textTypes = "[ec-field='" + key + "']";
        if ((typeof v) == "string") {
            var s = v;
            var textFieldTypes = scope.find(textTypes);
            var attrFieldTypes = scope.find("[ec-attr-" + key + "]");
            textFieldTypes.text(v).val(v);
            attrFieldTypes.attr(key, v);
            attrFieldTypes.attr(key.toLowerCase(), v);
            if (scope.is("[ec-field='" + key + "']")) 
                scope.text(v);
            if (scope.is("[ec-attr-" + key + "]")) {
                scope.attr(key, v);
                scope.attr(key.toLowerCase(), v);
            }
            var referenceTypes = scope.find("[ec-reference='" + key + "']");
            if (referenceTypes.length > 0) {
                if (s.startsWith("http")) {
                    var p1 = EcRepository.getBlocking(s);
                    this.autoFill(referenceTypes, p1);
                }
            }
        }
        if ((typeof v) == "function") {
            if ((v)["length"] == 0) {
                var textFieldTypes = scope.find(textTypes);
                var attrFieldTypes = scope.find("[ec-attr-" + key + "]");
                if (textFieldTypes.length + attrFieldTypes.length > 0) {
                    v = (v).apply(dataObj, new Array(0));
                    textFieldTypes.text(v).val(v);
                    attrFieldTypes.attr(key, v);
                    attrFieldTypes.attr(key.toLowerCase(), v);
                }
            }
        }
    };
    prototype.fillInnerArray = function(scope, dataObj, key) {
        var props = (dataObj);
        var v = props[key];
        if (EcArray.isArray(v)) {
            var containers = scope.find("[ec-container='" + key + "']");
            for (var idx = 0; idx < containers.length; idx++) {
                var container = containers.eq(idx);
                var array = v;
                for (var i = 0; i < array.length; i++) {
                    this.fillInnerArrayContainer(scope, dataObj, key, props, container, array, i);
                }
            }
        }
    };
    prototype.fillInnerArrayContainer = function(scope, dataObj, key, props, container, array, i) {
        var arrayValue = array[i];
        if (arrayValue.toLowerCase().startsWith("http")) {
            var p1 = EcRepository.getBlocking(arrayValue);
            if (this.shouldFillInnerArray(props, container, p1)) {
                var newContainer = null;
                newContainer = container.find("[ec-template='" + key + "'][id='" + (p1)["id"] + "']");
                if (newContainer.length == 0) 
                    newContainer = this.autoAppend(container, key);
                this.autoFill(newContainer, p1);
                for (var k2 in props) {
                    this.fillInnerArray(newContainer, dataObj, k2);
                }
            }
        } else if (arrayValue.trim().startsWith("{")) {
            var c = this.autoAppend(scope, key);
            this.autoFill(c, JSON.parse(arrayValue));
        } else {
            var c = this.autoAppend(scope, key);
            c.text(arrayValue);
        }
    };
    prototype.shouldFillInnerArray = function(a, container, p1) {
        var attributes = container[0].attributes;
        var found = false;
        var ok = false;
        for (var j = 0; j < attributes.length; j++) {
            var attr = attributes[j];
            if (attr.name.startsWith("ec-condition-")) {
                found = true;
                var parts = (attr.name.replace("ec-condition-", "")).split("-");
                var parentKey = parts[0];
                var childKey = parts[1];
                var parentValue = container.attr(parentKey);
                var childValue = (p1)[childKey];
                if ((typeof childValue) == "function") 
                    childValue = (childValue).apply(p1, new Array(0));
                if (parentValue == childValue) 
                    ok = true;
            }
        }
        if (!found) 
            return true;
        if (found && !ok) 
            return false;
        if (found && ok) 
            return true;
        return false;
    };
    prototype.autoRemove = function(from, template) {
        from.find("[ec-template='" + template + "']").remove();
    };
    prototype.autoAppend = function(from, template) {
        if (from.is("[ec-container='" + template + "']")) {
            return from.append((this.nameToTemplate)[template]).children().last();
        }
        return from.find("[ec-container='" + template + "']").append((this.nameToTemplate)[template]).children().last();
    };
    prototype.nameToTemplate = null;
    prototype.autoConfigure = function(jQueryCore) {
        if (this.nameToTemplate == null) 
            this.nameToTemplate = new Object();
        var me = this;
        jQueryCore.find("[ec-template]").each(function(p1, p2) {
            me.autoConfigure($(p2));
            if ((me.nameToTemplate)[p2.getAttribute("ec-template")] == null) {
                (me.nameToTemplate)[p2.getAttribute("ec-template")] = (p2)["outerHTML"];
                p2.parentNode.removeChild(p2);
            }
        });
    };
    constructor.reloadLoginCallback = function(o) {
        ModalManager.hideModal();
        var currentScreen = ScreenManager.getCurrentScreen();
        if (o == null) 
            currentScreen.setData(EcView.urlParameters());
         else 
            currentScreen.setData(o);
        ScreenManager.replaceScreen(currentScreen, null, null);
    };
    constructor.reloadShowLoginCallback = function() {
        CassManagerScreen.showLoginModalIfReload();
    };
    constructor.showLoginModalIfReload = function() {
        if (LoginController.getPreviouslyLoggedIn() && !LoginController.getLoggedIn()) {
            ModalManager.showModal(new LoginModal(CassManagerScreen.reloadLoginCallback, null, AppSettings.returnLoginMessage), null);
        }
    };
}, {data: "Object", nameToTemplate: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0"}, {});
