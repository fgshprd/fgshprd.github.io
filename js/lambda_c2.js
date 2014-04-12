function identity(argument) {
	return argument;
}

function self_application(argument) {
	return argument(argument);
}

function apply(func) {
	return function (arg) {
		return func(arg);
	}
}

/* Usage: select_first(first)(second) */
function select_first(first) { 
	return function(second) { 
		return first; 
	}; 
}

/*
 * A multi-parameter version. I prefer the first
 * because it better approximates the style of the 
 * originals.

function select_first(first, second) { 
	return (function(second) { 
		return first; 
	})(); 
}
*/

function select_second(first) {
	return function(second) {
		return second;
	}
}

/**
 * Given a first argument, returns a function that takes a second argument
 * which, in turn, accepts function that will operate on the first two arguments as a pair.
 * Basically, this function stores two arguments for later use by a new function.
 * ---
 * Example usage:
 * make_pair(identity)(apply)(select_first) will return identity.
 * make_pair(identity)(apply)(select_second) will return apply.
 */
function make_pair(first) {
	return function(second) {
		return function(func) {
			return func(first)(second);
		}
	}
}

function cond(expression1) {
	return function(expression2) {
		return function(condition) {
			return condition(expression1)(expression2);
		}
	}
}
