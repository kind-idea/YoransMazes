YORAN.block = function (x_input, y_input, z_input) { // Base for all pieces of puzzle
	this.x = x_input;
	this.y = y_input;
	this.z = z_input;
};
YORAN.block.prototype = {
	coords: function () {
		var str = "(" + this.x + ", " + this.y + ")";
		return str;
	},
	str: function () {
		return "";
	}
};

YORAN.blocks = {};
YORAN.blocks[' '] = function (x_input, y_input, z_input) { // Empty space. Anything can pass through.
	YORAN.block.call(this, x_input, y_input, z_input);
}
YORAN.blocks[' '].prototype = Object.create(YORAN.block.prototype, {
    constructor: {
        value: YORAN.block,
    },
});
YORAN.blocks[' '].prototype.str = function () {
	return " ";
}
YORAN.blocks['#'] = function (x_input, y_input, z_input) { // Nothingness.  Blocks cannot be pushed onto this.
	YORAN.block.call(this, x_input, y_input, z_input);
}
YORAN.blocks['#'].prototype = Object.create(YORAN.block.prototype, {
    constructor: {
        value: YORAN.block,
    }
});
YORAN.blocks['#'].prototype.str = function () {
	return "#";
}
YORAN.blocks['@'] = function (x_input, y_input, z_input) { // YORAN
	YORAN.actor.call(this, x_input, y_input, z_input);
}
YORAN.blocks['@'].prototype = Object.create(YORAN.actor.prototype, {
    constructor: {
        value: YORAN.actor,
    }
});
YORAN.blocks['@'].prototype.str = function () {
	return "@";
}
YORAN.blocks['$'] = function (x_input, y_input, z_input) { // Box
	YORAN.actor.call(this, x_input, y_input, z_input);
}
YORAN.blocks['$'].prototype = Object.create(YORAN.actor.prototype, {
    constructor: {
        value: YORAN.actor,
    }
});
YORAN.blocks['$'].prototype.str = function () {
	return "$";
}
YORAN.blocks['%'] = function (x_input, y_input, z_input) { // Cement block
	YORAN.struct.call(this, x_input, y_input, z_input);
}
YORAN.blocks['%'].prototype = Object.create(YORAN.struct.prototype, {
    constructor: {
        value: YORAN.struct,
    }
});
YORAN.blocks['%'].prototype.str = function () {
	return "%";
}
YORAN.blocks['~'] = function (x_input,y_input,z_input) { // Waste
	YORAN.cont.call(this, x_input, y_input,z_input);
}
YORAN.blocks['~'].prototype = Object.create(YORAN.cont.prototype, {
    constructor: {
        value: YORAN.cont,
    }
});
YORAN.blocks['~'].prototype.str = function () {
	return "~";
}
YORAN.blocks['.'] = function (x_input,y_input) { // Sensor
	YORAN.sense.call(this, x_input, y_input);
}
YORAN.blocks['.'].prototype = Object.create(YORAN.sense.prototype, {
    constructor: {
        value: YORAN.sense,
    }
});
YORAN.blocks['.'].prototype.str = function () {
	return ".";
}


YORAN.isType = function (container, obj) {
	var prop;
	for (prop in container) {
		if (obj instanceof container[prop]) {
			return true;
		}
	}
	return false;
}