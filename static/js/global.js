
var ai = [{ url: "http://www.ubuntu.com", title:"Ubuntu" },
{ url: "http://www.ubuntukylin.com", title:"优麒麟" },
{ url: "http://cn.developer.ubuntu.com", title:"开发者站" },
{ url: "http://www.canonical.com", title:"Canonical" }];

var more = [];


if(!core){ var core = {}; }

core.setupGlobalNav = function () {
	core.deployNav(core.getNav());
	core.trackClicks();
};

core.getNav = function() {
	var begin = '<nav role="navigation" id="nav-global"><div class="nav-global-wrapper"><ul>';
	var end = '</ul></div></nav>';
	var mu = '';
	var i = 0;
	while(i < ai.length) {
		mu += '<li><a href="' + ai[i].url + '" ' + core.getActive(ai[i].url) + '>' + ai[i].title + '</a></li>';
		i++;
	}
	i = 0;
	if(more.length > 0) {
		mu += '<li class="more"><a href="#">More <span>&rsaquo;</span></a><ul>';
		while(i < more.length) { mu += '<li><a href="'+ more[i].url +'">' + more[i].title + '</a></li>'; i++; }
		mu += '</ul>';
	}
	return begin + mu + end;
};
core.deployNav = function(mu) {
	var gI = 'body';
	if(core.globalPrepend) {
		gI = core.globalPrepend;
	}
	YUI().use('node', function(Y) {
		Y.one(gI).prepend(mu);
		var ml = Y.one('#nav-global .more');
		if(ml){
			ml.on('click',function(e){
				e.stopPropagation();
				e.preventDefault();
				this.toggleClass('open');
				return false;
			});
			ml.one('span').on('click',function(e){
				e.preventDefault();
				e.stopPropagation();
			});
			ml.one('ul').on('click',function(e){ e.stopPropagation(); });
		}
		Y.one('body').on('click', function(e){
			var ml = Y.one('#nav-global .more');
			if(ml.hasClass('open')){
				ml.removeClass('open');
			}
		});
	});
};

core.getActive = function(link) {
	var fullurl = core.getURL();
	var url = fullurl.substr(0,link.length);

	if(link == 'http://www.ubuntu.com') {
		if(fullurl.substr(0,35) == 'http://www.ubuntu.com/certification' ){
			return '';
		}
	}
	return (url == link)?'class="active"':'';
};


core.getURL = function(){
	var url = document.URL;
	url = url.replace('https://developer.ubuntu.com','http://developer.ubuntu.com');
	return url;
};

core.trackClicks = function() {
	YUI().use('node', function(Y) {
		Y.all('#nav-global a').on('click',function(e) {
			e.preventDefault();
			try {
				_gaq.push(['_trackEvent', 'Global bar click', e.target.get('text'), core.getURL()]);
			} catch(err){}
			setTimeout(function() {
				document.location.href = e.target.get('href');
			}, 100);
		});
	});
};

if(!core.globalPrepend) {
	core.setupGlobalNav();
}