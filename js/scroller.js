var scroller = function($){

	var targetId = $('[data-scroller]').attr('data-target');
	var topOffset = $('[data-scroller]').attr('data-offset');
	
	var getVisibilty = function(element) {
		element = element[0];
		var rect = element.getBoundingClientRect();
		if (rect.top > $(window).height()) {
			return 0;
		} else if (rect.bottom < topOffset) {
			return 0;
		}
		var topVisible = rect.top >= topOffset ? rect.top : topOffset;
		var bottomVisible = rect.bottom >= $(window).height() ? $(window).height() : rect.bottom;
		var heightVisible = bottomVisible - topVisible;

		return heightVisible / ((rect.bottom - rect.top) / 100);
	};
	
	var processClick = function(event) {
		event.preventDefault();
		var element = $(this);
        var section = $(element.attr('href'))[0];
        var offset = $(element.attr('href')).offset();
        offset.top -= topOffset;
        var newOffset = offset.top < 0 ? 0 : offset.top;
        $('html, body').animate( {
        	scrollTop : newOffset
        }, function() {
			if (element.attr('href') == '#register') {
				$('#inputName').focus();
			}
		});
	};

	var updateActiveMenuItem = function() {
    	var visibility = [];  
    	var references = [];
    	$(targetId + ' .navbar-nav li > a').each(function() {
    		var reference = $(this);
    		var referenced = $(reference.attr('href'));
    		references.push(reference);
    		visibility.push(getVisibilty(referenced));
    	});
    	var mostVisibleIndex = visibility.indexOf(Math.max.apply(Math, visibility));
    	for(var i = 0; i < references.length; i++) {
    		if (mostVisibleIndex != i) {
    			references[i].parent().removeClass('active');
    		} else {
    			references[i].parent().addClass('active');
    		}
    	}
	}
	
    $('a.inner').click(processClick);    
    $(targetId + ' .navbar-nav li > a').click(processClick);
    $(window).on('DOMContentLoaded load resize scroll', updateActiveMenuItem);

};
scroller(jQuery);