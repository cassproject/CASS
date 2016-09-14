// Generated from Rollup.g4 by ANTLR 4.5
// jshint ignore: start
var antlr4 = require('antlr4/index');


var serializedATN = ["\3\u0430\ud6d1\u8206\uad2d\u4417\uaef1\u8d80\uaadd",
    "\2\fY\b\1\4\2\t\2\4\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4",
    "\t\t\t\4\n\t\n\4\13\t\13\3\2\6\2\31\n\2\r\2\16\2\32\3\2\3\2\6\2\37\n",
    "\2\r\2\16\2 \5\2#\n\2\3\3\3\3\3\3\3\3\3\3\3\3\3\3\3\3\3\3\5\3.\n\3\3",
    "\4\3\4\3\4\3\4\3\4\5\4\65\n\4\3\5\3\5\3\6\3\6\3\6\3\6\3\6\3\6\3\6\5",
    "\6@\n\6\3\7\6\7C\n\7\r\7\16\7D\3\b\6\bH\n\b\r\b\16\bI\3\t\3\t\3\n\3",
    "\n\3\13\3\13\3\13\3\13\3\13\3\13\6\13V\n\13\r\13\16\13W\2\2\f\3\3\5",
    "\4\7\5\t\6\13\7\r\b\17\t\21\n\23\13\25\f\3\2\7\5\2,-//\61\61\4\2<<>",
    "@\5\2\13\f\17\17\"\"\5\2\60\60C\\c|\3\2\"\"c\2\3\3\2\2\2\2\5\3\2\2\2",
    "\2\7\3\2\2\2\2\t\3\2\2\2\2\13\3\2\2\2\2\r\3\2\2\2\2\17\3\2\2\2\2\21",
    "\3\2\2\2\2\23\3\2\2\2\2\25\3\2\2\2\3\30\3\2\2\2\5-\3\2\2\2\7\64\3\2",
    "\2\2\t\66\3\2\2\2\13?\3\2\2\2\rB\3\2\2\2\17G\3\2\2\2\21K\3\2\2\2\23",
    "M\3\2\2\2\25O\3\2\2\2\27\31\4\62;\2\30\27\3\2\2\2\31\32\3\2\2\2\32\30",
    "\3\2\2\2\32\33\3\2\2\2\33\"\3\2\2\2\34\36\7\60\2\2\35\37\4\62;\2\36",
    "\35\3\2\2\2\37 \3\2\2\2 \36\3\2\2\2 !\3\2\2\2!#\3\2\2\2\"\34\3\2\2\2",
    "\"#\3\2\2\2#\4\3\2\2\2$%\7v\2\2%&\7t\2\2&\'\7w\2\2\'.\7g\2\2()\7h\2",
    "\2)*\7c\2\2*+\7n\2\2+,\7u\2\2,.\7g\2\2-$\3\2\2\2-(\3\2\2\2.\6\3\2\2",
    "\2/\60\7C\2\2\60\61\7P\2\2\61\65\7F\2\2\62\63\7Q\2\2\63\65\7T\2\2\64",
    "/\3\2\2\2\64\62\3\2\2\2\65\b\3\2\2\2\66\67\t\2\2\2\67\n\3\2\2\28@\t",
    "\3\2\29:\7>\2\2:@\7?\2\2;<\7@\2\2<@\7?\2\2=>\7#\2\2>@\7?\2\2?8\3\2\2",
    "\2?9\3\2\2\2?;\3\2\2\2?=\3\2\2\2@\f\3\2\2\2AC\t\4\2\2BA\3\2\2\2CD\3",
    "\2\2\2DB\3\2\2\2DE\3\2\2\2E\16\3\2\2\2FH\t\5\2\2GF\3\2\2\2HI\3\2\2\2",
    "IG\3\2\2\2IJ\3\2\2\2J\20\3\2\2\2KL\7]\2\2L\22\3\2\2\2MN\7_\2\2N\24\3",
    "\2\2\2OP\7j\2\2PQ\7v\2\2QR\7v\2\2RS\7r\2\2SU\3\2\2\2TV\n\6\2\2UT\3\2",
    "\2\2VW\3\2\2\2WU\3\2\2\2WX\3\2\2\2X\26\3\2\2\2\f\2\32 \"-\64?DIW\2"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

function RollupLexer(input) {
	antlr4.Lexer.call(this, input);
    this._interp = new antlr4.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.PredictionContextCache());
    return this;
}

RollupLexer.prototype = Object.create(antlr4.Lexer.prototype);
RollupLexer.prototype.constructor = RollupLexer;

RollupLexer.EOF = antlr4.Token.EOF;
RollupLexer.NUMBER = 1;
RollupLexer.BOOLEAN = 2;
RollupLexer.LOGICAL_OPERATOR = 3;
RollupLexer.MATH_OPERATOR = 4;
RollupLexer.QUANTATIVE_OPERATOR = 5;
RollupLexer.WS = 6;
RollupLexer.KEY = 7;
RollupLexer.LEFT_BRACE = 8;
RollupLexer.RIGHT_BRACE = 9;
RollupLexer.VALUE = 10;


RollupLexer.modeNames = [ "DEFAULT_MODE" ];

RollupLexer.literalNames = [ 'null', 'null', 'null', 'null', 'null', 'null', 
                             'null', 'null', "'['", "']'" ];

RollupLexer.symbolicNames = [ 'null', "NUMBER", "BOOLEAN", "LOGICAL_OPERATOR", 
                              "MATH_OPERATOR", "QUANTATIVE_OPERATOR", "WS", 
                              "KEY", "LEFT_BRACE", "RIGHT_BRACE", "VALUE" ];

RollupLexer.ruleNames = [ "NUMBER", "BOOLEAN", "LOGICAL_OPERATOR", "MATH_OPERATOR", 
                          "QUANTATIVE_OPERATOR", "WS", "KEY", "LEFT_BRACE", 
                          "RIGHT_BRACE", "VALUE" ];

RollupLexer.grammarFileName = "Rollup.g4";



exports.RollupLexer = RollupLexer;

