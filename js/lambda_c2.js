function identity(argument) {
	return argument;
}

function self_application(argument) {
	return argument(argument);
}

function select_first(first, second) { 
	return (function(second) { 
		return first; 
	})(); 
}