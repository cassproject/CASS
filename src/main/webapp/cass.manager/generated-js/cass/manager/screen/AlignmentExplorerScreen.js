/*-
 * --BEGIN_LICENSE--
 * Competency and Skills System
 * -----
 * Copyright (C) 2015 - 2017 Eduworks Corporation and other contributing parties.
 * -----
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * --END_LICENSE--
 */

/**
 *  Created by fray on 3/23/17.
 */
var AlignmentExplorerScreen = function() {
    CassManagerScreen.call(this);
};
AlignmentExplorerScreen = stjs.extend(AlignmentExplorerScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "AlignmentExplorer";
    prototype.columns = null;
    prototype.containerId = null;
    prototype.addColumn = function() {
        var column = new AlignmentExplorerColumn();
        column.columnIndex = this.columns.length;
        var lastColumn = null;
        if (this.columns.length > 0) 
            lastColumn = this.columns[this.columns.length - 1];
        if (lastColumn != null) {
            lastColumn.right = column;
            column.left = lastColumn;
        }
        this.columns.push(column);
        this.addedColumn(column);
        var me = this;
        column.screenHook = function() {
            me.updateControls();
            me.reflow();
        };
        column.display(this.containerId);
        this.reflow();
        return column;
    };
    prototype.reflow = function() {};
    prototype.addedColumn = function(column) {
        ViewManager.showView(column, this.createColumnDiv(), function() {});
    };
    prototype.updateControls = function() {};
    prototype.createColumnDiv = function() {
        return null;
    };
    prototype.getDisplayName = function() {
        return AlignmentExplorerScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/alignmentExplorer.html";
    };
    prototype.display = function(containerId) {
        this.containerId = containerId;
        this.columns = new Array();
        this.addColumn();
        this.addColumn();
        this.addColumn();
        this.addColumn();
        this.bindControls(containerId);
    };
    prototype.bindControls = function(containerId) {};
}, {columns: {name: "Array", arguments: ["AlignmentExplorerColumn"]}, data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + AlignmentExplorerScreen.displayName)) {
            ScreenManager.startupScreen = new AlignmentExplorerScreen();
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
