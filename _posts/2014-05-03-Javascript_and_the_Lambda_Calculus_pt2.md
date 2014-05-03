---
layout: post
title: JavaScript and the Lambda Calculus, pt. 2
---

{{ page.title }}
================

In the [first part of this series][part1], I gave a very, very broad overview of functional programming and then showed how to translate some basic lambda functions into JavaScript (based on Greg Michaelson's examples in *[An Introduction to Functional Programming through Lambda Calculus][amazon]*). The motivating idea is that we can use these basic functions to compose more sophisticated functions that are capable of doing much of the work that we take for granted in a programming language -- work that is done for us behind-the-scenes. Since we're approaching this through functional programming, everything will be made of functions; we won't make use of any other type of construct. We are allowing ourselves to name our functions for the sake of readability; otherwise, there will be no global variables, no classes, and no object properties or method calls. All of our work will consist of function calls. The only variables allowed apart from function names are function parameters.

In this part, we'll use three of the functions we created last time to create a basic conditional expression and the NOT operator. The functions we'll use are *make_pair*, *select_first*, and *select_second*.

We're building the means to express Boolean logic, so we won't be making use of the primitives already available to us in JavaScript, e.g., the Boolean values **true** and **false**, the Boolean operators, such as **&&** (AND), **\|\|** (OR), and **!**(NOT), or conditional expressions (e.g., **if/else** statements). The first thing we need to do is define our terms. Michaelson uses the example of the conditional expression in C (which is also available in Javascript):

condition ? expression1 : expression2

This notation expresses the following operation: if the condition is true, then return expression1; otherwise, return expression2.

We've already created functions that allow us to return either the first or second argument (select_first and select_second) so we'll define TRUE as select_first and FALSE as select_second by simply copying them and giving them new names. Because **true** and **false** are reserved words in JavaScript, we'll use all-caps for our pseudo-primitives: 

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

*Make_pair* allows us to store a pair of arguments, so we'll use that to create our conditional:

    function conditional(expr1) {
        return function(expr2) {
            return function(cond) {
                return cond(expr1)(expr2);
            }
        }
    }

As you can see, this is just a copy of *make_pair* with different names for the function and its arguments.

Now we can use *TRUE* and *FALSE* with *conditional* to return a function that holds a pair of values. For instance, if we want to create a familiar looking version of a conditional expression that would evaluate to true if the condition is true, and to false if the condition is false, i.e.,

condition ? true : false

we could do this (remember, we're using variable names for readability -- they are not necessary):

    myConditional = conditional(TRUE)(FALSE);

Then, passing *TRUE* to myConditional will return *TRUE*, and passing *FALSE* will return *FALSE*:

    myConditional(TRUE) => function TRUE(first) { ... }

and so on. 

Now, to construct the logical NOT operator, we need to simply reverse our terms: passing *TRUE* should return *FALSE*, and passing *FALSE* should return *TRUE*.

    function not(x) {
        return conditional(FALSE)(TRUE)(x);
    }

*not(TRUE)* will return *FALSE* (the function -- remember, everything is a function in this arrangmenet), and *not(FALSE)* will return *TRUE*. 

Next time we'll move on to AND and OR!

[part1]: {% post_url 2014-04-12-Javascript_and_the_Lambda_Calculus_pt1 %}
[amazon]: http://amzn.com/0486478831



