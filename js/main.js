var resumeY, projectsY,
    anchors = document.querySelectorAll('h2 > a'),
    nav = document.querySelector('.navlist'),
    anchorsPos = {},
    sections = document.querySelectorAll('.content > div'),
    screenHeight = window.screen.availHeight,
    headerHeight = document.querySelector('.header').offsetHeight || null,
    contentHeight = screenHeight - headerHeight;
if (anchors) {
	var i = 0;
	while (i < sections.length) {
		if (sections[i].offsetHeight < contentHeight) {
			sections[i].style.height = contentHeight + 'px';
		}
		i++;
	}
	i = 0;
	while (i < anchors.length) {
		var name = anchors[i].name,
		    pos = getElYPos(anchors[i]);
		anchorsPos[name] = pos;
		i++;
	}
	

	nav.onclick = function (e) {
		var e = e || window.event,
		    target = e.target || e.srcElement;
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
		smoothScroll(anchorsPos[target.innerText]);
	};
}
function getElYPos(el) {
	var y = 0;
	while (el != null) {
		y += el.offsetTop;
		el = el.offsetParent;
	}
	return y;
}
function smoothScroll(pos) {
	window.scrollTo(0, pos-headerHeight);
}

