/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

var fonts = {
    node: "bold 12px Arial"
};

var canvas = $("canvas").get(0)
var ctx = canvas.getContext("2d")

var graph = new Springy.Graph();
var nodes = {};
jQuery(function () {
    var springy = window.springy = jQuery('canvas').springy({
        graph: graph,
        nodeSelected: function (node) {
            console.log('Node selected: ' + JSON.stringify(node.data));
        }
    });
});

var canvas = jQuery('canvas')[0];

// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
    canvas.width = window.innerWidth-60;
    canvas.height = window.innerHeight-60;

}

resizeCanvas();

$(document).ready(function () {
    var springy = new Springy.Layout.ForceDirected(graph, 600.0, new Springy.Vector(400.0, 50.0), 0.5);
    var frameworkId = "http://sandbox.service.cassproject.org/data/schema.eduworks.com.cass.0.1.framework/056c2192-340b-48d4-a7f3-d3de1df06744";

    EcRepository.get(frameworkId, function (framework) {

        if (framework.competency !== undefined)
            for (var i = 0; i < framework.competency.length; i++) {
                EcRepository.get(framework.competency[i], function (competency) {
                    competency.font = fonts.node;
                    nodes[competency.shortId()] = graph.newNode(competency);
                    nodes[competency.shortId()].gravity = false;
                    nodes[competency.shortId()].fixed = true;
                    if (competency.shortId() == framework.competency[framework.competency.length - 1]) {
                        if (framework.relation !== undefined)
                            for (var i = 0; i < framework.relation.length; i++) {
                                EcRepository.get(framework.relation[i], function (relation) {
                                    if (relation.source !== undefined) {
                                        nodes[relation.source].gravity = true;
                                        nodes[relation.source].fixed = false;
                                        if (nodes[relation.source].alwaysShowText === undefined)
                                            nodes[relation.source].alwaysShowText = false;
                                        nodes[relation.target].alwaysShowText = true;
                                        graph.newEdge(nodes[relation.source], nodes[relation.target]);
                                    }
                                });
                            }
                    }
                });
            }

    });
})
