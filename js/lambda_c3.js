
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

/**
 * and(x)(y):
 * if x is true, should return y
 * if x is false, should return false;
 * so, the conditional should store y and false:
 * condition ? y : false
 */

function and(x) {
	return function(y) {
		return conditional(y)(FALSE)(x);
	}
}

function or(x) {
	return function(y) {
		return conditional(TRUE)(y)(x);
	}
}

function nand(x) {
	return function(y) {
		return not(and(x)(y))
	}
}

function not2(x) {
	return nand(x)(TRUE);
}

function or2(x) {
	return function(y) {
		return nand(not(x))(not(y));
	}
}

