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
 *  Stub for the AddFieldModal
 *  
 *  @module cass.manager
 *  @author devlin.junker@eduworks.com
 *  @class AddOwnerModal
 *  @extends EcModal
 *  @constructor
 */
var AddOwnerModal = /**
 *  @constructor
 *  @param {Object} field
 *  @param {String} objectContainerId
 */
function(field, objectContainerId) {
    EcModal.call(this);
    this.field = field;
    this.objectContainerId = objectContainerId;
};
AddOwnerModal = stjs.extend(AddOwnerModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.field = null;
    prototype.objectContainerId = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/addOwner.html";
    };
}, {field: "Object"}, {});