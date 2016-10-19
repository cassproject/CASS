var CassManagerScreen = function() {
    EcScreen.call(this);
};
CassManagerScreen = stjs.extend(CassManagerScreen, EcScreen, [], function(constructor, prototype) {
    prototype.data = null;
    prototype.setData = function(data) {
        this.data = data;
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
    constructor.autoFill = function(scope, obj) {
        var props = (obj);
        for (var key in props) {
            CassManagerScreen.fillInnerString(scope, obj, key);
        }
        for (var key in props) {
            CassManagerScreen.fillInnerArray(scope, obj, key);
        }
    };
    constructor.fillInnerString = function(scope, dataObj, key) {
        var a = (dataObj);
        var v = a[key];
        var textTypes = "span[ec-field='" + key + "'],p[ec-field='" + key + "'],div[ec-field='" + key + "'],a[ec-field='" + key + "'],small[ec-field='" + key + "'],i[ec-field='" + key + "']";
        if ((typeof v) == "string") {
            var s = v;
            var textFieldTypes = scope.find(textTypes);
            var inputFieldTypes = scope.find("input[ec-field='" + key + "']");
            var attrFieldTypes = scope.find("[ec-attr-" + key + "]");
            textFieldTypes.text(v);
            inputFieldTypes.val(v);
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
                    CassManagerScreen.autoFill(referenceTypes, p1);
                }
            }
        }
        if ((typeof v) == "function") {
            var textFieldTypes = scope.find(textTypes);
            var inputFieldTypes = scope.find("input[ec-field='" + key + "']");
            var attrFieldTypes = scope.find("[ec-attr-" + key + "]");
            if (textFieldTypes.length + inputFieldTypes.length + attrFieldTypes.length > 0) {
                v = (v).apply(dataObj, new Array(0));
                textFieldTypes.text(v);
                inputFieldTypes.val(v);
                attrFieldTypes.attr(key, v);
                attrFieldTypes.attr(key.toLowerCase(), v);
            }
        }
    };
    constructor.fillInnerArray = function(scope, dataObj, key) {
        var props = (dataObj);
        var v = props[key];
        if (EcArray.isArray(v)) {
            var containers = scope.find("[ec-container='" + key + "']");
            for (var idx = 0; idx < containers.length; idx++) {
                var container = containers.eq(idx);
                var array = v;
                for (var i = 0; i < array.length; i++) {
                    CassManagerScreen.fillInnerArrayContainer(scope, dataObj, key, props, container, array, i);
                }
            }
        }
    };
    constructor.fillInnerArrayContainer = function(scope, dataObj, key, props, container, array, i) {
        var arrayValue = array[i];
        if (arrayValue.toLowerCase().startsWith("http")) {
            var p1 = EcRepository.getBlocking(arrayValue);
            if (CassManagerScreen.shouldFillInnerArray(props, container, p1)) {
                var newContainer = CassManagerScreen.autoAppend(container, key);
                CassManagerScreen.autoFill(newContainer, p1);
                for (var k2 in props) {
                    CassManagerScreen.fillInnerArray(newContainer, dataObj, k2);
                }
            }
        } else if (arrayValue.trim().startsWith("{")) {
            var c = CassManagerScreen.autoAppend(scope, key);
            CassManagerScreen.autoFill(c, JSON.parse(arrayValue));
        } else {
            var c = CassManagerScreen.autoAppend(scope, key);
            c.text(arrayValue);
        }
    };
    constructor.shouldFillInnerArray = function(a, container, p1) {
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
    constructor.autoRemove = function(from, template) {
        from.find("[ec-template='" + template + "']").remove();
    };
    constructor.autoAppend = function(from, template) {
        if (from.is("[ec-container='" + template + "']")) 
            return from.append((CassManagerScreen.nameToTemplate)[template]).children().last();
        return from.find("[ec-container='" + template + "']").append((CassManagerScreen.nameToTemplate)[template]).children().last();
    };
    constructor.nameToTemplate = new Object();
    constructor.autoConfigure = function(jQueryCore) {
        jQueryCore.find("[ec-template]").each(function(p1, p2) {
            CassManagerScreen.autoConfigure($(p2));
            if ((CassManagerScreen.nameToTemplate)[p2.getAttribute("ec-template")] == null) {
                (CassManagerScreen.nameToTemplate)[p2.getAttribute("ec-template")] = (p2)["outerHTML"];
                p2.parentNode.removeChild(p2);
            }
        });
    };
}, {data: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0", nameToTemplate: "Object"}, {});
