/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
var IMG_HEIGHT = 20;
var IMG_WIDTH = 20;

var NODE_FONT = "bold 12px Arial, sans-serif";
var EDGE_FONT = "8px Arial, sans-serif";

//NOTE these are TIGHTLY bound to the NODE_FONT, IMG_HEIGHT, and IMG_WIDTH
var NODE_TEXT_X_OFFSET = 26;
var NODE_TEXT_Y_OFFSET = 26;

var FALSE_IMG_SRC = "img/falseResult.png";
var TRUE_IMG_SRC = "img/trueResult.png";
var IND_IMG_SRC = "img/indeterminateResult.png";
var UNK_IMG_SRC = "img/unknownResult.png";

var graph = new Springy.Graph();

function getFalseImgSrc() {
    return FALSE_IMG_SRC;
}

function getTrueImgSrc() {
    return TRUE_IMG_SRC;
}

function getIndeterminateImgSrc() {
    return IND_IMG_SRC;
}

function getUnknownImgSrc() {
    return UNK_IMG_SRC;
}

function getImgHeight() {
    return IMG_HEIGHT;
}

function getImgWidth() {
    return IMG_WIDTH;
}

function getNodeFont() {
    return NODE_FONT;
}

function getEdgeFont() {
    return EDGE_FONT;
}

function getNodeTextXOffset() {
    return NODE_TEXT_X_OFFSET;
}

function getNodeTextYOffset() {
    return NODE_TEXT_Y_OFFSET;
}

function getImgSrc(result) {
    if (result == "FALSE") return FALSE_IMG_SRC;
    else if (result == "TRUE") return TRUE_IMG_SRC;
    else if (result == "UNKNOWN") return UNK_IMG_SRC;
    else return IND_IMG_SRC;
}

function getNodeName(ip) {
    if (ip.type == "COMPETENCY") return ip.competency[0].name;
    else if (ip.type == "ROLLUPRULE") return ip.type;
    else if (ip.type != null) return ip.type._name.replace("RELATION_", "");
}

function displayInquiryPacketDetails(ip) {
    //change this to fill in details div
    if (ip.competency) alert(ip.type + "\n" + ip.competency.name);
    else alert(ip.type);
}

var nodes = {};

function addInquiryPacketNodes(ip, parentNode, isEquivalency, parentMass) {
    var myMass = parentMass - 1000;
    var ipNode = null;
    //    if (ip.competency != null)
    //        ipNode = nodes[ip.competency.shortId()];
    //    if (ipNode == null) {
    var nodeName = getNodeName(ip);
    if (parentNode == null)
        nodeName = "<-- " + nodeName;
    for (var i = 0; i < ip.positive.length; i++)
        nodeName = "+" + nodeName;
    for (var i = 0; i < ip.negative.length; i++)
        nodeName = "-" + nodeName;
    ipNode = graph.newNode({
        name: nodeName,
        //mass: myMass,
        ondoubleclick: function () {
            displayInquiryPacketDetails(ip);
        },
        image: {
            src: getImgSrc(ip.result),
            width: IMG_WIDTH,
            height: IMG_HEIGHT,
            alt: "test"
        }
    });
    //    }
    if (ip.competency != null)
        for (var i = 0;i < ip.competency.length;i++)
            nodes[ip.competency[i].shortId()] = ipNode;

    if (parentNode) {
        ipNode.gravity = true;
        ipNode.fixed = false;
        if (isEquivalency) {
            ipNode.gravity = false;
            ipNode.sameHeightAs = parentNode;
            graph.newEdge(ipNode, parentNode).data.color = "rgba(0,0,0,.3)";
            graph.newEdge(parentNode, ipNode).data.color = "rgba(0,0,0,.3)";
        } else graph.newEdge(parentNode, ipNode).data.color = "rgba(0,0,0,.3)";
    } else {
        ipNode.gravity = false;
        ipNode.fixed = true;
    }

    if (ip.equivalentPackets) {
        for (var x = 0; x < ip.equivalentPackets.length; x++) {
            if (nodes[ip.equivalentPackets[x].competency.shortId()] == null)
                addInquiryPacketNodes(ip.equivalentPackets[x], ipNode, true, myMass);
        }
    }
    if (ip.subPackets) {
        for (var y = 0; y < ip.subPackets.length; y++) {
            addInquiryPacketNodes(ip.subPackets[y], ipNode, false, myMass);
        }
    }
}

function buildAssertionProcessingGraph(rootInquiryPacket) {
    addInquiryPacketNodes(rootInquiryPacket, null, false, 0);
    $("#viewport").replaceWith('<canvas id="viewport" style="width:100%;height:100%;"></canvas>');
    setTimeout(function () {
        $("#viewport").attr("width", $("#viewport")[0].scrollWidth);
        $("#viewport").attr("height", Math.max($("#viewport")[0].scrollHeight, 700));
    }, 10);
    nodes = {};
    jQuery(function () {
        var springy = window.springy = jQuery('#viewport').springy({
            graph: graph,
            nodeSelected: function (node) {
                console.log('Node selected: ' + JSON.stringify(node.data));
            }
        });
    });
}
var processing = false;

function detectCompetence() {
    $("#processing").foundation('open');
    $("#detectButton").addClass("disabled");
    if (processing) return;
    processing = true;
    graph = new Springy.Graph();
    var competencyId = $("#selectedCompetency").attr("url");
    var frameworkId = $("#selectedCompetency").attr("framework");
    var target = selectedContact.pk;

    var springy = new Springy.Layout.ForceDirected(graph, 1200.0, new Springy.Vector(400.0, 400.0), 0.5);
    EcCompetency.get(
        competencyId,
        function (competency) {
            EcFramework.get(
                frameworkId,
                function (framework) {
                    var ep = new PessimisticQuadnaryAssertionProcessor();
                    ep.logFunction = function (data) {
                        console.log(data);
                    };
                    ep.repositories.push(repo);
                    var subject = new Array();
                    subject.push(target);
                    var additionalSignatures = null;
                    ep.has(
                        subject,
                        competency,
                        null,
                        framework,
                        additionalSignatures,
                        function (data) {
                            buildAssertionProcessingGraph(data);
                            $("#processing").foundation('close');
                            $("#competenceGraph").foundation('open');
                            processing = false;
                            $("#detectButton").removeClass("disabled");
                        },
                        function (data) {
                            console.log(data);
                        },
                        function (data) {
                            console.log(data);
                        }
                    );
                }
            );
        }
    );
}
