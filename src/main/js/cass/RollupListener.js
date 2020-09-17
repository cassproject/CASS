/*-
 * --BEGIN_LICENSE--
 * Competency and Skills System
 * -----
 * Copyright (C) 2015 - 2020 Eduworks Corporation and other contributing parties.
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
// Generated from Rollup.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by RollupParser.
function RollupListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

RollupListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
RollupListener.prototype.constructor = RollupListener;

// Enter a parse tree produced by RollupParser#s.
RollupListener.prototype.enterS = function(ctx) {
};

// Exit a parse tree produced by RollupParser#s.
RollupListener.prototype.exitS = function(ctx) {
};


// Enter a parse tree produced by RollupParser#token.
RollupListener.prototype.enterToken = function(ctx) {
};

// Exit a parse tree produced by RollupParser#token.
RollupListener.prototype.exitToken = function(ctx) {
};


// Enter a parse tree produced by RollupParser#query.
RollupListener.prototype.enterQuery = function(ctx) {
};

// Exit a parse tree produced by RollupParser#query.
RollupListener.prototype.exitQuery = function(ctx) {
};


// Enter a parse tree produced by RollupParser#innerquery.
RollupListener.prototype.enterInnerquery = function(ctx) {
};

// Exit a parse tree produced by RollupParser#innerquery.
RollupListener.prototype.exitInnerquery = function(ctx) {
};


// Enter a parse tree produced by RollupParser#logical_or_math_operator.
RollupListener.prototype.enterLogical_or_math_operator = function(ctx) {
};

// Exit a parse tree produced by RollupParser#logical_or_math_operator.
RollupListener.prototype.exitLogical_or_math_operator = function(ctx) {
};



exports.RollupListener = RollupListener;
