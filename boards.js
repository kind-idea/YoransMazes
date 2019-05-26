YORAN.board = function (str) { // Implements shared functions for board.
	this.level = [];
	this.yoran = undefined;
	this.conts = [];
	this.senses = {};
	this.parse(str);
}
YORAN.board.prototype = {
	update_to: function (x, y, z, old_x, old_y, old_z) {
		this.level[z][y][x] = this.level[old_z][old_y][old_x];
		this.level[old_z][old_y][old_x] = undefined;
	},
	at: function (x,y,z) {
		return this.level[z][y][x];
	},
	parse: function (str) {
    	var array = YORAN.array_handle.create_3d_array(str,'===');
    	for (var k = 0; k < array.length; k++) {
    		this.level[k] = [];
    		for (var j = 0; j < array[k].length; j++) {
    			this.level[k][j] = [];
    			for (var i = 0; i < array[k][j].length; i++) {
    				var ch = array[k][j].charAt(i);
    				this.level[k][j][i] = new YORAN.blocks[ch](i,j,k);
    			}
    		}
    	}
    },
    print: function () {
    	var str = "";
    	for (var k = 0; k < this.level.length; k++) {
    		for (var j = 0; j < this.level[k].length; j++) {
    			for (var i = 0; i < this.level[k][j].length; i++) {
    				var obj = this.level[k][j][i];
    				console.log(obj);
    				str += obj.str();
    			}
    			str += '\n';
    		}
    		str += '===\n';
    	}
    	return str;
    }
}

var board = new YORAN.board (
'\
%%%\n\
%%%\n\
%%%\n\
===\n\
   \n\
 $%\n\
   \n\
===\n\
   \n\
  @\n\
   \
'
);
YORAN.log(
	board.print()
);


// Note: simply convert a soko board to a maze board.  Then change the print functions.
/*YORAN.soko_board = function (str) { 
	YORAN.board.call(this, str);
	this.parse(str);
}
YORAN.soko_board.prototype = Object.create(YORAN.board.prototype, {
	constructor: {
        value: YORAN.board,
    },
    parse: function (str) {
    	var array = YORAN.array_handle.string_to_array(str);
		this.level[0] = [];
		this.level[1] = [];
		for (var j = 0; j < array.length; j++) {
			this.level[0][j] = [];
			this.level[1][j] = [];
			for (var i = 0; i < array[j].length; i++) {
				var str = array[j].charAt(i);
				var objs = this.char_to_objs(str,i,j);
				this.level[0][j][i] = objs.bottom;
				this.level[1][j][i] = objs.top;
				YORAN.log(objs.sense);
				if (YORAN.isType(YORAN.actors.yoran, this.level[1][j][i])) { // If this is yoran, set yoran.
					this.yoran = level[1][j][i];
				}
			}
		}
    },
    char_to_objs: function (str, x, y) {
		var top,
			bottom,
			sense,
			cont;
		if (str === "#") {
			bottom = undefined;
		}
		else if (str === " " || str === "$" || str === "@" || str === "." || str === "+" || str === "*") {
			bottom = new YORAN.structs.floor(x,y,0);
		}
		else if (str === "." || str === "+" || str === "*") {
			sense = new YORAN.senses.goal_square(x,y,1);
		}
		else if (str === "`" || str === "^" || str === "!") {
			bottom = new YORAN.actors.box(x,y,0);
			cont = new YORAN.conts.waste(x,y,0);
		}
		else if (str === "~") {
			bottom = new YORAN.conts.waste(x,y,0);
		}
		if (str === " " || str === "." || str === "`", str === "#") {
			top = undefined;
		}
		else if (str === "@" || str === "+" || str === "^") {
			top = new YORAN.actors.yoran(x,y,1);
		}
		else if (str === "$" || str === "!" || str === "*") {
			top = new YORAN.actors.box(x,y,1);
		}
		return {top, bottom, sense, cont};
    },
    objs_to_char: function (objs) { // Needed since the sokoban format is different than the maze.
		var above = objs.top;
		var below = objs.bottom;
		if (below === undefined) 						  { return "#"; }
		else if (below instanceof YORAN.structs.floor) {
			if (above === undefined) 					  { return " ";	}
			else if (above instanceof YORAN.actors.yoran) {	return "@";	}
			else if (above instanceof YORAN.actors.box)   {	return "$";	}
		}
		else if (below instanceof YORAN.senses.goal_square) {
			if (above === undefined) 					  {	return ".";	}
			else if (above instanceof YORAN.actors.yoran) {	return "+";	}
			else if (above instanceof YORAN.actors.box)   { return "*";	}
		}	
		else if (below instanceof YORAN.structs.box) {
			if (above === undefined) 					  {	return "`";	}
			else if (above instanceof YORAN.actors.yoran) {	return "^";	}
			else if (above instanceof YORAN.actors.box)   {	return "!";	}
		}
		else if (below instanceof YORAN.conts.waste)    {	return "~";	}
	},
	char_at: function (x,y,z) {
		var top = this.at(x,y,1);
		var bottom = this.at(x,y,0);
		return this.objs_to_char({top, bottom});
	},
	print: function() {
		var str = "";
		for (var j = 0; j < this.level[1].length; j++) {
			for (var i = 0; i < this.level[1][j].length; i++) {
				str += this.char_at(i,j);
			}
			str += "\n";
		}
		return str;
	},
}); */