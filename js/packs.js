/* 
LEVEL KEY

[SPACE] = Land
$ = Block on Land
@ = Char on Land

. = Sensor
+ = Char on Sensor
* = Block on Sensor

~ = Toxic Waste
` = Block (in waste)
! = Block on Block (in waste)
^ = Char on Block (in waste)

% = Land that you can't walk on (used for tables)

: = Concrete Pole
- = Horizontal Wall
? = Vertical Wall

U, V, W = Vertical Tables
X, Y, Z = Horizontal Tables

1, 2, 3, 4, 5, 6, 7 = Barrels

A, B, C, D = Decorative green closed door (top, right, bottom, left)
H, I, J, K = Goal Door (top, right, bottom, left)

# = Emptiness
*/

var packs = {
	tut : {
		displayName : 'Tutorial',
		type : 'maze',
		author : 'Sveciaost',
		level : []
	},
	main : {
		displayName : 'Main',
		type : 'maze',
		author : 'Sveciaost',
		level : []
	},
	microban : {
		displayName : 'Microban',
		type : 'soko',
		author : 'David W. Skinner',
		level : []
	},
	masMicro : {
		displayName : 'Mas Microban',
		type : 'soko',
		author : 'David W. Skinner',
		level : []
	},
	sokEvo : {
		displayName : 'SokEvo',
		type : 'soko',
		author : 'Lee J. Haywood',
		level : []
	},
	sokHard : {
		displayName : 'SokHard',
		type : 'soko',
		author : 'Lee J. Haywood',
		level : []
	},
	sokWhole : {
		displayName : 'SokWhole',
		type : 'soko',
		author : 'Lee J. Haywood',
		level : []
	}
};

var custom;
if (!localStorage.custom){
	custom = [];
	localStorage.custom = JSON.stringify(custom);
} else {
	custom = JSON.parse(localStorage.custom);
	for (var i=0; i<custom.length; i++){
		var cond = custom[i].varName;
		packs['custom' + cond] = custom[i];
	}
}

// Tutorial Levels
packs.tut.level[0] = [
	'    #',
	'@   I',
	'    #'
];
packs.tut.level[1] = [
	'# ###',
	' $ $ ',
	'  # #',
	' @# #',
	'###J#'
];
packs.tut.level[2] = [
	'##H##',
	'     ',
	'~~~~~',
	'~~~~~',
	' $ $ ',
	'  @  '
];
packs.tut.level[3] = [
	'#H##',
	'   #',
	'#.$ ',
	'#$  ',
	'#@  '
];