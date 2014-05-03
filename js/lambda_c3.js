
/**
 * Return function: cond(expr1)(expr2)
 */

function conditional(expr1) {
	return function(expr2) {
		return function(cond) {
			return cond(expr1)(expr2);
		}
	}
}

function TRUE(first) { 
	return function(second) { 
		return first; 
	}; 
}

function FALSE(first) {
	return function(second) {
		return second;
	}
}

function not(x) {
	return conditional(FALSE)(TRUE)(x);
}