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

One way to represent what we've done here is by using a truth table to describe our inputs and outputs. For instance, our *not* function can be represented by this simple table

|input | output|
|------|-------|
|1     | 0     |
|0     | 1     |

where 1 and 0 stand for *TRUE* and *FALSE*, respectively. 

The Boolean *AND* operator can be represented by the following table:

|x |y |output|
|--|--|--|
|0 |0 |0 |
|0 |1 |0 |
|1 |0 |0 |
|1 |1 |1 |

And the Boolean *OR* operator like so:

|x |y |output|
|--|--|--|
|0 |0 |0 |
|0 |1 |1 |
|1 |0 |1 |
|1 |1 |1 |

Just as with *NOT*, both *AND* and *OR* can be modeled using our basic conditional. Michaelson points out, for instance, that a review of our truth-table demonstrates that we if our first expression is *FALSE*, we will always return *FALSE*. If our first expression is *TRUE*, the output depends entirely on the value of our second expression: *TRUE* if it is *TRUE*, and *FALSE* otherwise. In other words, if our first expression is *TRUE*, we return the value of our second expression; otherwise, we return *FALSE*. Here is this result expressed in terms of our conditional:

expression1 ? expression2 : FALSE

Translating this into JavaScript, we need our conditional to store our second expression and *FALSE*, and then apply the returned function to our first expression to get our result:

    function and(x) {
        return function(y) {
            return conditional(y)(FALSE)(x);
        }
    }

If you try this in your console, you'll find that the output matches the truth-table above, e.g.,

    and(TRUE)(FALSE) => FALSE

and 

    and(TRUE)(TRUE) => TRUE

Michaelson models *OR* in a similar manner. Here, we always return *TRUE* if our first expression is *TRUE*, and we return the value of our second expression otherwise:

expression1 ? TRUE : expression2

In this case, our conditional will store *TRUE* and our second expression and then apply the resulting function to our first expression:

    function or(x) {
        return function(y) {
            return conditional(TRUE)(y)(x);
        }
    }

Thus, 

    or(TRUE)(FALSE) => TRUE

and so on.

Departing Michaelson's text for a moment, I'll point out that we could have generated our *OR* function differently. Since we already have *AND* and *NOT*, we could have constructed a *NAND* (i.e., "not and") function like this:

    function nand(x) {
        return function(y) {
            return not(and(x)(y))
        }
    }

*NAND* has the following truth-table, which has an output column that is an upside-down version of that found in the *OR* table:

|x |y |output|
|--|--|--|
|0 |0 |1 |
|0 |1 |1 |
|1 |0 |1 |
|1 |1 |0 |

To generate the *OR* truth-table output from this, we need to reverse the inputs. Our JavaScript function would look like this:

    function or2(x) {
        return function(y) {
            return nand(not(x))(not(y));
        }
    }

In fact, we could recreate all of our Boolean functions using the *NAND* function if we were so inclined.

That's it for our brief tour of Boolean functions as expressed through our minimalist version of the lambda calculus. Next time, we'll tackle numbers!

[part1]: {% post_url 2014-04-12-Javascript_and_the_Lambda_Calculus_pt1 %}
[amazon]: http://amzn.com/0486478831



