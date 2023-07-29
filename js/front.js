if ($.cookie("theme_csspath")) {
    $('link#theme-stylesheet').attr("href", $.cookie("theme_csspath"));
}
$(function() {
    animations();
    sliders();
    fullScreenContainer();
    utils();
    sliding();
    parallax();
});
$(window).load(function() {
    windowWidth = $(window).width();
    $(this).alignElementsSameHeight();
    masonry();
});
$(window).resize(function() {
    newWindowWidth = $(window).width();
    if (windowWidth !== newWindowWidth) {
        setTimeout(function() {
            $(this).alignElementsSameHeight();
            fullScreenContainer();
            waypointsRefresh();
        }, 205);
        windowWidth = newWindowWidth;
    }
});


function animations() {
    if (Modernizr.csstransitions) {
        delayTime = 0;
        $('[data-animate]').css({
            opacity: '0'
        });
        $('[data-animate]').waypoint(function(direction) {
            delayTime += 150;
            $(this).delay(delayTime).queue(function(next) {
                $(this).toggleClass('animated');
                $(this).toggleClass($(this).data('animate'));
                delayTime = 0;
                next();
            });
        }, {
            offset: '95%',
            triggerOnce: true
        });
        $('[data-animate-hover]').hover(function() {
            $(this).css({
                opacity: 1
            });
            $(this).addClass('animated');
            $(this).removeClass($(this).data('animate'));
            $(this).addClass($(this).data('animate-hover'));
        }, function() {
            $(this).removeClass('animated');
            $(this).removeClass($(this).data('animate-hover'));
        });
    }
}

function sliding() {
    $('.scrollTo, #navigation a').click(function(event) {
        event.preventDefault();
        var full_url = this.href;
        var parts = full_url.split("#");
        var trgt = parts[1];
        $('body').scrollTo($('#' + trgt), 800, {
            offset: -80
        });
    });
}

function sliders() {
    if ($('.owl-carousel').length) {
        $(".customers").owlCarousel({
            items: 6,
            itemsDesktopSmall: [990, 4],
            itemsTablet: [768, 2],
            itemsMobile: [480, 1]
        });
        $(".testimonials").owlCarousel({
            items: 4,
            itemsDesktopSmall: [1170, 3],
            itemsTablet: [970, 2],
            itemsMobile: [750, 1]
        });
    }
}

function parallax() {
    $('.text-parallax').parallax("50%", 0.1);
}

function masonry() {
    $('#references-masonry').css({
        visibility: 'visible',
        position: 'relative'
    });
    $('#references-masonry').masonry({
        isAnimated: true,
        animationOptions: {
            duration: 2000,
            easing: 'horizontal',
            queue: true
        },
        gutter: 0
    });
    scrollSpyRefresh();
    waypointsRefresh();
}
$('#filter a').click(function(e) {
    e.preventDefault();
    $('#filter li').removeClass('active');
    $(this).parent('li').addClass('active');
    var categoryToFilter = $(this).attr('data-filter');
    $('.reference-item').each(function() {
        if ($(this).data('category') === categoryToFilter || categoryToFilter === 'all') {
            $(this).removeClass('hidden');
        } else {
            $(this).addClass('hidden');
        }
    });
    if ($('#detail').hasClass('open')) {
        closeReference();
    } else {
        $('#references-masonry').masonry('reloadItems').masonry('layout');
    }
    scrollSpyRefresh();
    waypointsRefresh();
});
$('.reference-item').click(function(e) {
    e.preventDefault();
    var element = $(this);
    var title = element.find('.reference-title').text();
    var description = element.find('.reference-description').html();
    images = element.find('.reference-description').data('images').split(',');
    if (images.length > 0) {
        slider = '';
        for (var i = 0; i < images.length; ++i) {
            slider = slider + '<div class="item"><img src=' + images[i] + ' alt="" class="img-responsive"></div>';
        }
    } else {
        slider = '';
    }
    $('#detail-title').text(title);
    $('#detail-content').html(description);
    $('#detail-slider').html(slider);
    openReference();
});

function openReference() {
    $('#detail').addClass('open');
    $('#references-masonry').animate({
        opacity: 0
    }, 300);
    $('#detail').animate({
        opacity: 1
    }, 300);
    setTimeout(function() {
        $('#detail').slideDown();
        $('#references-masonry').slideUp();
        if ($('#detail-slider').html() !== '') {
            $('#detail-slider').owlCarousel({
                slideSpeed: 300,
                paginationSpeed: 400,
                autoPlay: true,
                stopOnHover: true,
                singleItem: true,
                afterInit: ''
            });
        }
    }, 300);
    setTimeout(function() {
        $('body').scrollTo($('#detail'), 1000, {
            offset: -80
        });
    }, 500);
}

function closeReference() {
    $('#detail').removeClass('open');
    $('#detail').animate({
        'opacity': 0
    }, 300);
    setTimeout(function() {
        $('#detail').slideUp();
        $('#detail-slider').data('owlCarousel').destroy();
        $('#references-masonry').slideDown().animate({
            'opacity': 1
        }, 300).masonry('reloadItems').masonry();
    }, 300);
    setTimeout(function() {
        $('body').scrollTo($('#filter'), 1000, {
            offset: -110
        });
    }, 500);
    setTimeout(function() {
        $('#references-masonry').masonry('reloadItems').masonry();
    }, 800);
}
$('#detail .close').click(function() {
    closeReference(true);
})

function fullScreenContainer() {
    var screenWidth = $(window).width() + "px";
    var screenHeight = '';
    if ($(window).height() > 500) {
        screenHeight = $(window).height() + "px";
    } else {
        screenHeight = "500px";
    }
    $("#intro, #intro .item").css({
        width: screenWidth,
        height: screenHeight
    });
}

function utils() {
    $('[data-toggle="tooltip"]').tooltip();
    $('.external').on('click', function(e) {
        e.preventDefault();
        window.open($(this).attr("href"));
    });
}
$.fn.alignElementsSameHeight = function() {
    $('.same-height-row').each(function() {
        var maxHeight = 0;
        var children = $(this).find('.same-height');
        children.height('auto');
        if ($(window).width() > 768) {
            children.each(function() {
                if ($(this).innerHeight() > maxHeight) {
                    maxHeight = $(this).innerHeight();
                }
            });
            children.innerHeight(maxHeight);
        }
        maxHeight = 0;
        children = $(this).find('.same-height-always');
        children.height('auto');
        children.each(function() {
            if ($(this).height() > maxHeight) {
                maxHeight = $(this).innerHeight();
            }
        });
        children.innerHeight(maxHeight);
    });
}

function scrollSpyRefresh() {
    setTimeout(function() {
        $('body').scrollspy('refresh');
    }, 1000);
}

function waypointsRefresh() {
    setTimeout(function() {
        $.waypoints('refresh');
    }, 1000);
}
document.querySelector("#nav-toggle").addEventListener("click", function() {
    this.classList.toggle("active");
});
