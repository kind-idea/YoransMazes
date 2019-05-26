var YORAN = {};
// Basic Functions
YORAN.log = function (input) {
	console.log(input);
};
YORAN.array_handle = {
	string_to_array: function (string) {
		var re=/\r\n|\n\r|\n|\r/g;
		var array = string.replace(re,"\n").split("\n");
		return array;
	},
	create_3d_array: function (string, delimeter) {
		var array = this.string_to_array(string);
		var new_array = [];

		var z = 0;
		new_array[z] = [];
		for (var i = 0; i < array.length; i++) {
			if (array[i] === delimeter) {
				z++;
				new_array[z] = [];
			}
			else {
				new_array[z].push(array[i]);
			}
		}
		return new_array;
	}
}