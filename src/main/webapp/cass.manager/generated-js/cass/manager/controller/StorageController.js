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
 *  Manages the storage object of the browser whether it be the session or 
 *  local storage, and provides methods for retrieving values.
 *  
 *  Also holds a list of recently viewed object ids for different classes
 *  for a specific computer in the browsers storage, this can be used
 *  to precache objects for use or to display the recently viewed objects 
 *  
 *  @module cass.manager
 *  @class SessionController
 *  @constructor
 *  
 *  @author devlin.junker@eduworks.com
 */
var StorageController = function() {
    if (localStorage != null) 
        this.storageSystem = localStorage;
     else if (sessionStorage != null) 
        this.storageSystem = sessionStorage;
    var recent = this.storageSystem["cass.recent"];
    if (recent != null && recent != "") {
        try {
            this.recent = JSON.parse(recent);
        }catch (e) {
            this.recent = {};
        }
    } else {
        this.recent = {};
    }
};
StorageController = stjs.extend(StorageController, null, [], function(constructor, prototype) {
    prototype.storageSystem = null;
    prototype.MAX_RECENT = 3;
    prototype.recent = null;
    prototype.getStoredValue = function(key) {
        return this.storageSystem[key];
    };
    prototype.setStoredValue = function(key, val) {
        this.storageSystem[key] = val;
    };
    prototype.getRecent = function(type) {
        var list = this.recent[type];
        if (list == null) {
            list = [];
            this.recent[type] = list;
            this.storageSystem["cass.recent"] = JSON.stringify(this.recent);
        }
        return list;
    };
    prototype.addRecent = function(type, id) {
        var list = this.recent[type];
        if (list == null) {
            list = [id];
        } else if (list.indexOf(id) == -1) {
            if (list.length < this.MAX_RECENT) {
                list.push(id);
            } else {
                list.shift();
                list.push(id);
            }
        }
        this.recent[type] = list;
        this.storageSystem["cass.recent"] = JSON.stringify(this.recent);
    };
    prototype.removeRecent = function(type, id) {
        if (id == null || id == undefined || id == "") {
            return;
        }
        var list = this.recent[type];
        if (list == null) {
            return;
        } else if (list.indexOf(id) == -1) {
            delete (list)[Integer.toString(list.indexOf(id))];
            this.recent[type] = list;
            this.storageSystem["cass.recent"] = JSON.stringify(this.recent);
        }
    };
}, {storageSystem: "Storage", recent: {name: "Map", arguments: [null, {name: "Array", arguments: [null]}]}}, {});
