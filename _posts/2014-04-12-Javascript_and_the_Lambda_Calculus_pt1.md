---
layout: post
title: JavaScript and the Lambda Calculus, pt. 1
---

{{ page.title }}
================

I recently picked up a copy of Greg Michaelson's 1989 book *[An Introduction to Functional Programming through Lambda Calculus][amazon]* and decided to translate the functions described throughout into JavaScript. I've found that this helps me to better visualize and digest their structure and operation since I'm much better acquainted with the syntax of JavaScript than I am with that of LISP and other functional languages. JavaScript is up to the task because it treats functions as first-class citizens, meaning that functions can receive other functions as arguments and also return a new function upon completion. Functional programming, in its pure form, does not have global variables; one works only with functions, arguments passed to functions, and the values or expressions returned by functions. This means that one's functions never produce side-effects. Here are some other features of functional programming according to Michaelson:

+ Functional languages are based on nested function calls rather than assignments;
+ In functional programming, a name is associated with only one value. You can not, for instance, change the value associated with a name (i.e., set x equal to 1 and then, later, to 2);
+ There is no fixed order of evaluation in functional programming. Your functions have no global dependencies or references and so can be combined and called in any order without side-effects;

This style of programming can be implemented in JavaScript by limiting ourselves to a subset of its functionality. The goal is not to improve JavaScript as a language but to use these limits playfully so as to learn this important and powerful approach to programming.

*\[Disclaimer: I am neither a computer scientist nor a mathematician, so my explanations of the material might occasionally be ill-informed. In such cases, I invoke my fundamental right to express my ignorance online. On the other hand, since this is a learning exercise, I'd definitely appreciate any corrections or comments!\]*

The [Lambda Calculus][sepLambda] was created by [Alonzo Church][wikipChurch] in the 1930's, during the same period that saw [Alan Turing][wikipTuring]'s work on computability via the famous notion of a [Turing Machine][sepTuringMachine]. Church and Turing are generally credited as co-creators of the theory of computability, and the Lambda Calculus and the Turing Machine were shown by Turing to be [equivalent in terms of their expressiveness][wikipLambda]. Crudely speaking, however, we can contrast the two approaches as alternative styles: the Lambda Calculus corresponding to what we refer to as functional programming, and the Turing Machine corresponding to imperative programming. I am mostly familiar with the imperative style of programming, and since JavaScript is flexible enough to express both styles, I thought it would be fun to try to translate Michaelson's examples into JavaScript.

Church devised the lambda calculus as a way to describe and analyze mathematical functions in a formal way. Insofar as a mathematical function is understood as a kind of operation or computation, the lambda calculus also provides a formal means to describe and analyze computation. Michaelson's book uses the lambda calculus to formulate a set of basic functions that can be combined and transformed to create more sophisticated and complex functions, much as basic electrical circuits can be combined to create basic logic gates, which can in turn be combined to create calculating machines and computers. The first set of functions are the following:

1. identity
2. self-application
3. function application
4. select first
5. select second

Once we have these, they can be combined to create basic Boolean values and operations, and conditional expressions.

Of course, all of these things are already built into JavaScript, so this exercise is completely superfluous; again, the point isn't to create something new so much as to learn the fundamentals of a different style of programming -- one that is intimately related to the foundations of computer science and mathematics. I think it will be interesting to see how, armed with only function statements and the rules by which arguments are applied to functions, we can build some of the features we take for granted in our everyday programming.

One last note before getting to the functions: I mentioned above that functional programming, in its pure form, admits of no global variables; we will allow one exception to this: named functions. This will be used purely as a convenience, allowing us to combine functions in a more-readable format; otherwise, we'd have to write out the functions every time we use them, which would quickly get messy. (JavaScript has anonymous functions, of course, so we *could* do without function names if we had the patience.) Our functions will never refer to one another by name except insofar as one function is passed to another via an argument. There will be no other references to the global space, and none of the references we make will be allowed to alter their referents.

**IDENTITY**

In the lambda (&#955;) calculus, the identity function takes the following form:

&#955;x.x

The '&#955;' identifies the bound variable while the period demarcates the function body. Here, the bound variable is 'x' and the body simply returns the variable. My JavaScript representation looks likes this:

    function identity(argument) {
    	return argument;
    }

Obviously, this function returns its argument without modification. For instance,

    identity(1)

will return 1.

*NOTE: If we were being strict by not allowing the use of named functions, we'd have to write this out as follows:*

    (function (argument) { return argument; })(1)

*If our argument were another anonymous function which took yet another anonymous function as its argument and so on, we'd soon tire of looking at the page.*

You might wonder what purpose such a simple and apparently inconsequential function might serve. If we're not allowing ourselves variable assignments or declarations and can only work with arguments passed to functions, then we can represent a value, such as 1 or "hello world" using the identity function, e.g., 

    identity(1)

or

    identity("hello world")

This allows us to pass values around without assigning any values to global variables. At least that's my take on it (I don't think Michaelson spells this out).

**SELF-APPLICATION**

&#955;s.(s s)

Here we have bound variable s, and a function body that is a function application (marked by the set of parentheses) that applies s to itself. Here's the JavaScript equivalent:

    function self_application(argument) {
        return argument(argument);
    }

To demonstrate this function, Michaelson applies it to the identity function above. Passing identity to self-application ought to return identity, since we'd be applying identity to itself, and identity returns its argument unmodified. Sure enough, 

    self_application(identity)

returns

    function identity(argument) {
    	return argument;
    }

**FUNCTION APPLICATION**

&#955;func.&#955;arg.(func arg)

Our bound variable is func, and our function body is another function, &#955;arg.(func arg), with bound variable arg and a function application for its body. This function accepts a function as an argument and returns a new function that will apply the function (func) passed to the first function to a given argument (arg).

Here's where things start to get interesting. In JavaScript, we might be tempted to create a function that accepts two arguments:

    function apply(func, arg) { ... }

But this would go against the spirit of the exercise. To represent a function with multiple arguments in the lambda calculus, we must [curry][wikipCurry] it. In other words, our functions will accept one argument; to work with more than one argument, we must chain our functions together by having them return new functions that can accept new arguments. We would pass our first argument to our first function, get a new function in return that will accept our second argument, and so on.

In the example above, we would do this:

((&#955;func.&#955;arg.(func arg) first) second)

First, we apply our function to *first*, producing this:

(&#955;arg.(first arg) second)

which is then reduced to this:

(first second)

which applies our second argument to our first, which was expected to be a function (as designated by its name, *func*). Our JavaScript will look like this:

    function apply(func) {
	    return function (arg) {
		    return func(arg);
	    }
    }

To use it, we would write this:

    apply(func)(arg)

 which first evaluates

    apply(func)

 and then applies the returned function to *arg*.

 **SELECT FIRST**

 &#955;first.&#955;second.first

This function's operation is self-explanatory: it returns the first of two arguments. You apply it to your first argument, and then apply the returned function to your second argument, getting your first argument back as a result. Here's the JavaScript:

    function select_first(first) { 
	    return function(second) { 
		    return first; 
	    }; 
    }

For example, this

    select_first(1)(2)

should return *1*. 

 **SELECT SECOND**

&#955;first.&#955;second.second

This is the same as above, except it returns the second argument. Javascript:

    function select_second(first) {
	    return function(second) {
		    return second;
	    }
    }

Michaelson points out the the inner function of *select_second* is essentially our identity function. We're effectively throwing our first argument away and returning *identity*. Of course, since we're not allowing global references, we don't have access to our definition of identity inside this function and thus have to write it out (i.e., we can't simply return a reference to identity).

**MAKE PAIR**

&#955;first.&#955;second.&#955;func((func first) second)

This is the final function for this part of the series. This time, we're working with three arguments, one of which will be a function (the other two can also be functions, of course). The idea is to pass two arguments and then do something with them using the third. The first application passes in the first argument, the second passes the second, returning a new function. This new function can be applied to another function (argument three), returning the result of the application of the function argument to either of the first two arguments. It's a bit like our *apply* function, but with an additional *arg* to work with.

To illustrate this function, Michaelson uses *identity* as the first argument, *apply* as the second argument, and *select_first* as the third argument, i.e., the argument that will be *func* in the definition above. If *first* above is *identity*, and *second* is *apply*, then applying *select_first* to the returned function 

&#955;func.((func first) second) 

should produce *identity* (the first argument); that is,

(&#955;func.((func identity) apply) select_first)

will become 

((select_first identity) apply)

which evaluates to *identity*.

Here's the JavaScript:

    function make_pair(first) {
	    return function(second) {
		    return function(func) {
			    return func(first)(second);
		    }
	    }
    }

Michaelson's example would look like this:

    make_pair(identity)(apply)(select_first)

which will return

    function identity(argument) {
    	return argument;
    }

On the other hand, this

    make_pair(identity)(apply)(select_second)

will return this

    function apply(func) {
	    return function (arg) {
		    return func(arg);
	    }
    }

Either of these returned functions could then be invoked with new arguments.

Next time:

We'll use *make_pair*, *select_first*, and *select_second* to build a conditional expression (if/else) as well as some basic Boolean operations (AND, OR, NOT).

[amazon]: http://amzn.com/0486478831
[sepLambda]: http://plato.stanford.edu/entries/lambda-calculus/
[sepTuringMachine]: http://plato.stanford.edu/entries/turing-machine/
[wikipLambda]: http://en.wikipedia.org/wiki/Lambda_calculus
[wikipChurch]: http://en.wikipedia.org/wiki/Alonzo_Church
[wikipTuring]: http://en.wikipedia.org/wiki/Alan_Turing
[wikipCurry]: http://en.wikipedia.org/wiki/Currying



