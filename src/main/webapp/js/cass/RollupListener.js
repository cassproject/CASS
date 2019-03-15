// Generated from Rollup.g4 by ANTLR 4.5
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