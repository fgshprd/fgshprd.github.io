---
layout: post
title: Character escaping and JavaScript URLs
---

{{ page.title }}
================

In my previous post I provided an example that uses a JavaScript URL to demonstrate a quirk of iOS7. That issue is not confined to JavaScript HREFs -- regular links as well as onclick handlers are affected, too. Here's a little annoyance that is restricted to JavaScript HREFs -- something I came across while working on a calendar component. It turns out that browsers sometimes treat strings differently depending on whether they are processed via a JavaScript HREF or in a more typical handler. For instance (and this may be the only instance), if you try to use JavaScript to open a URL containing the character code "%27", which encodes a single quotation mark, it will fail if used inside a JavaScript HREF, and succeed if inside an onclick handler.

In other words, this works:

    onclick="window.open('http://test.com/test.html?test=%27hello', 'blank'); return false;"

And this doesn't:

    href="javascript: window.open('http://test.com/test.html?test=%27hello', 'blank'); void(0);"

In the latter case, Chrome displays the following error message:

    "Uncaught SyntaxError: Unexpected identifier"

Here are some cases:

<ul>
	<li><a href="javascript: window.open('http://test.com/test.html?test=%27hello', 'blank')">Link using a JavaScript Href </a></li>
	<li><a href="#" onclick="window.open('http://test.com/test.html?test=%27hello', 'blank'); return false;">Link using an onclick handler</a></li>
</ul>

This is particularly inconvenient if you need to pass user-provided URLs to your script. It's yet another reason to avoid JavaScript HREFs in your code.



