(function($) {

    $(document).ready(function() {

        $('form').each(function() {
            initForm($(this));
        });

        $('.form-reset a').click(function(e) {
            var curForm = $(this).parents().filter('form');
            $(this).parent().find('input').click();
            window.setTimeout(function() {
                curForm.find('.form-checkbox').removeClass('checked');
                curForm.find('.form-checkbox input:checked').parent().parent().addClass('checked');

                curForm.find('.form-radio').removeClass('checked');
                curForm.find('.form-radio input:checked').parent().parent().addClass('checked');

                curForm.find('.form-file').each(function() {
                    $(this).find('span').html($(this).find('span').data('text'));
                });

                curForm.find('.form-select select').trigger('chosen:updated');
            }, 100);
            e.preventDefault();
        });

        $('body').on('click', '.window-link', function(e) {
            $.ajax({
                type: 'POST',
                url: $(this).attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                if ($('.window').length > 0) {
                    windowClose();
                }
                windowOpen(html);
            });
            e.preventDefault();
        });

        $('.gallery-preview').each(function() {
            var curSlider = $(this);
            curSlider.data('curIndex', 0);
            curSlider.data('disableAnimation', true);

            $('.gallery-preview-prev').css({'display': 'none'});
            if ($('.gallery-preview li').length <= 7) {
                $('.gallery-preview-next').css({'display': 'none'});
            }
        });

        $('.gallery-preview-next').click(function(e) {
            var curSlider = $('.gallery-preview');

            if (curSlider.data('disableAnimation')) {
                var curIndex = curSlider.data('curIndex');
                curIndex += 7;
                $('.gallery-preview-prev').css({'display': 'block'});
                if (curIndex >= curSlider.find('li').length - 7) {
                    curIndex = curSlider.find('li').length - 7;
                    $('.gallery-preview-next').css({'display': 'none'});
                }

                curSlider.data('disableAnimation', false);
                curSlider.find('ul').animate({'left': -curIndex * curSlider.find('li:first').width()}, function() {
                    curSlider.data('curIndex', curIndex);
                    curSlider.data('disableAnimation', true);
                });
            }

            e.preventDefault();
        });

        $('.gallery-preview-prev').click(function(e) {
            var curSlider = $('.gallery-preview');

            if (curSlider.data('disableAnimation')) {
                var curIndex = curSlider.data('curIndex');
                curIndex -= 7;
                $('.gallery-preview-next').css({'display': 'block'});
                if (curIndex <= 0) {
                    curIndex = 0;
                    $('.gallery-preview-prev').css({'display': 'none'});
                }

                curSlider.data('disableAnimation', false);
                curSlider.find('ul').animate({'left': -curIndex * curSlider.find('li:first').width()}, function() {
                    curSlider.data('curIndex', curIndex);
                    curSlider.data('disableAnimation', true);
                });
            }

            e.preventDefault();
        });

        $('.gallery-preview-content li a').click(function(e) {
            var curLink = $(this);
            var curLI   = curLink.parent();
            if (!curLI.hasClass('active')) {
                $('.gallery-preview-content li.active').removeClass('active');
                curLI.addClass('active');
                $('.gallery-big img').attr('src', curLink.attr('href'));
            }
            e.preventDefault();
        });

        $('.gallery-big a').click(function(e) {
            var curGallery = $('.gallery-preview-content');
            var curIndex = curGallery.find('li').index(curGallery.find('li.active'));
            var newHTML = '<ul>';
            curGallery.find('a').each(function() {
                var curLink = $(this);
                newHTML += '<li><a href="' + curLink.data('max') + '"><img src="' + curLink.find('img').attr('src') + '" alt="" /></a></li>';
            });
            newHTML += '</ul>';
            $('.item-gallery-list').html(newHTML);
            $('.item-gallery-list li:first').addClass('active');

            $('.item-gallery-list').each(function() {
                var curSlider = $(this);
                curSlider.data('curIndex', 0);
                curSlider.data('disableAnimation', true);

                $('.item-gallery-list-prev').css({'display': 'none'});
                if ($('.item-gallery-list').width() >= curSlider.find('ul').width()) {
                    $('.item-gallery-list-next').css({'display': 'none'});
                } else {
                    $('.item-gallery-list-next').css({'display': 'block'});
                }

                $('.item-gallery-prev').css({'display': 'none'});
                if ($('.item-gallery-list li').length > 1) {
                    $('.item-gallery-next').css({'display': 'block'});
                } else {
                    $('.item-gallery-next').css({'display': 'none'});
                }
            });

            var windowWidth     = $(window).width();
            var windowHeight    = $(window).height();
            var curScrollTop    = $(window).scrollTop();
            var curScrollLeft   = $(window).scrollLeft();

            var bodyWidth = $('body').width();
            $('body').css({'height': windowHeight, 'overflow': 'hidden'});
            var scrollWidth =  $('body').width() - bodyWidth;
            $('body').css({'padding-right': scrollWidth + 'px'});
            $(window).scrollTop(0);
            $(window).scrollLeft(0);
            $('body').css({'margin-top': -curScrollTop});
            $('body').data('scrollTop', curScrollTop);
            $('body').css({'margin-left': -curScrollLeft});
            $('body').data('scrollLeft', curScrollLeft);

            $('.item-gallery-list ul li').eq(curIndex).find('a').click();
            $('.item-gallery').addClass('item-gallery-open');

            e.preventDefault();
        });

        $('.item-gallery-close').click(function(e) {
            itemGalleryClose();
            e.preventDefault();
        });

        $('body').keyup(function(e) {
            if (e.keyCode == 27) {
                itemGalleryClose();
            }
        });

        function itemGalleryClose() {
            if ($('.item-gallery-open').length > 0) {
                $('.item-gallery').removeClass('item-gallery-open');
                $('body').css({'height': '100%', 'overflow': 'visible', 'padding-right': 0, 'margin': 0});
                $(window).scrollTop($('body').data('scrollTop'));
                $(window).scrollLeft($('body').data('scrollLeft'));
            }
        }

        $('.item-gallery').on('click', '.item-gallery-list ul li a', function(e) {
            $('.item-gallery-loading').show();
            var curLink = $(this);
            var curLi   = curLink.parent();

            var curIndex = $('.item-gallery-list ul li').index(curLi);
            $('.item-gallery-load img').attr('src', curLink.attr('href'));
            $('.item-gallery-load img').load(function() {
                $('.item-gallery-big img').attr('src', curLink.attr('href'));
                $('.item-gallery-big img').width('auto');
                $('.item-gallery-big img').height('auto');
                galleryPosition();

                $('.item-gallery-loading').hide();
            });
            $('.item-gallery-list ul li.active').removeClass('active');
            curLi.addClass('active');

            e.preventDefault();
        });

        function galleryPosition() {
            var curWidth = $('.item-gallery-big').width();
            var windowHeight = $(window).height();
            var curHeight = windowHeight - ($('.item-gallery-title').outerHeight() + $('.item-gallery-list').outerHeight()) - 40;

            var imgWidth = $('.item-gallery-big img').width();
            var imgHeight = $('.item-gallery-big img').height();

            var newWidth = curWidth;
            var newHeight = imgHeight * newWidth / imgWidth;

            if (newHeight > curHeight) {
                newHeight = curHeight;
                newWidth = imgWidth * newHeight / imgHeight;
            }

            $('.item-gallery-big img').width(newWidth);
            $('.item-gallery-big img').height(newHeight);

            if ($('.item-gallery-container').outerHeight() > windowHeight - 40) {
                $('.item-gallery-container').css({'top': 20, 'margin-top': 0});
            } else {
                $('.item-gallery-container').css({'top': '50%', 'margin-top': -$('.item-gallery-container').outerHeight() / 2});
            }
        }

        $('.item-gallery-list-next').click(function(e) {
            var curStep = 7;
            var curSlider = $('.item-gallery-list');

            if (curSlider.data('disableAnimation')) {
                var curIndex = curSlider.data('curIndex');
                curIndex += curStep;
                $('.item-gallery-list-prev').css({'display': 'block'});
                if (curIndex >= curSlider.find('li').length - curStep) {
                    curIndex = curSlider.find('li').length - curStep;
                    $('.item-gallery-list-next').css({'display': 'none'});
                }

                curSlider.data('disableAnimation', false);
                curSlider.find('ul').animate({'left': -curIndex * curSlider.find('li:first').width()}, function() {
                    curSlider.data('curIndex', curIndex);
                    curSlider.data('disableAnimation', true);
                });
            }

            e.preventDefault();
        });

        $('.item-gallery-list-prev').click(function(e) {
            var curStep = 7;
            var curSlider = $('.item-gallery-list');

            if (curSlider.data('disableAnimation')) {
                var curIndex = curSlider.data('curIndex');
                curIndex -= curStep;
                $('.item-gallery-list-next').css({'display': 'block'});
                if (curIndex <= 0) {
                    curIndex = 0;
                    $('.item-gallery-list-prev').css({'display': 'none'});
                }

                curSlider.data('disableAnimation', false);
                curSlider.find('ul').animate({'left': -curIndex * curSlider.find('li:first').width()}, function() {
                    curSlider.data('curIndex', curIndex);
                    curSlider.data('disableAnimation', true);
                });
            }

            e.preventDefault();
        });

        $(window).resize(function() {
            if ($('.item-gallery-open').length > 0) {
                galleryPosition();
            }
        });

        $('.video-item a').click(function(e) {
            var newHTML = '<iframe width="960" height="720" src="' + $(this).attr('href') + '?autoplay=1" frameborder="0" allowfullscreen></iframe>';
            if ($('.window').length > 0) {
                windowClose();
            }
            windowOpen(newHTML);
            e.preventDefault();
        });

        $('.main-articles').each(function() {
            var curSlider = $(this);
            curSlider.data('curIndex', 0);
            curSlider.data('disableAnimation', true);
        });

        $('.main-articles-next').click(function(e) {
            var curSlider = $('.main-articles');

            if (curSlider.data('disableAnimation')) {
                var curIndex = curSlider.data('curIndex');
                var newIndex = curIndex + 1;
                if (newIndex > curSlider.find('li').length - 1) {
                    newIndex = 0;
                }

                curSlider.data('disableAnimation', false);
                curSlider.find('li').eq(curIndex).fadeOut(function() {
                    curSlider.find('li').eq(newIndex).fadeIn(function() {
                        curSlider.data('curIndex', newIndex);
                        curSlider.data('disableAnimation', true);
                    });
                });
            }

            e.preventDefault();
        });

        $('.main-articles-prev').click(function(e) {
            var curSlider = $('.main-articles');

            if (curSlider.data('disableAnimation')) {
                var curIndex = curSlider.data('curIndex');
                var newIndex = curIndex - 1;
                if (newIndex < 0) {
                    newIndex = curSlider.find('li').length - 1;
                }

                curSlider.data('disableAnimation', false);
                curSlider.find('li').eq(curIndex).fadeOut(function() {
                    curSlider.find('li').eq(newIndex).fadeIn(function() {
                        curSlider.data('curIndex', newIndex);
                        curSlider.data('disableAnimation', true);
                    });
                });
            }

            e.preventDefault();
        });

    });

    function initForm(curForm) {
        curForm.find('input.maskPhone').mask('+7 (999) 999-99-99');

        curForm.find('.form-select select').chosen({disable_search: true, no_results_text: 'Нет результатов'});

        curForm.find('.form-checkbox span input:checked').parent().parent().addClass('checked');
        curForm.find('.form-checkbox').click(function() {
            $(this).toggleClass('checked');
            $(this).find('input').prop('checked', $(this).hasClass('checked')).trigger('change');
        });

        curForm.find('.form-radio span input:checked').parent().parent().addClass('checked');
        curForm.find('.form-radio').click(function() {
            var curName = $(this).find('input').attr('name');
            $('.form-radio input[name="' + curName + '"]').parent().parent().removeClass('checked');
            $(this).addClass('checked');
            $(this).find('input').prop('checked', true).trigger('change');
        });

        curForm.find('.form-file').each(function() {
            $(this).find('span').data('text', $(this).find('span').html());
        });

        curForm.find('.form-file input').change(function() {
            $(this).parent().find('span').html($(this).val().replace(/.*(\/|\\)/, '')).show();
            $(this).parent().find('label.error').remove();
        });

        if (curForm.hasClass('ajaxForm')) {
            curForm.validate({
                ignore: '',
                invalidHandler: function(form, validatorcalc) {
                    validatorcalc.showErrors();
                    checkErrors();
                },
                submitHandler: function(form) {
                    $(form).append('<div class="loading"><div class="loading-text">Отправка данных</div></div>');
                    $.ajax({
                        type: 'POST',
                        url: $(form).attr('action'),
                        data: $(form).serialize(),
                        dataType: 'html',
                        cache: false
                    }).done(function(html) {
                        $(form).find('.loading').remove();
                        $(form).append(html);
                    });
                }
            });
        } else {
            curForm.validate({
                ignore: '',
                invalidHandler: function(form, validatorcalc) {
                    validatorcalc.showErrors();
                    checkErrors();
                }
            });
        }
    }

    function checkErrors() {
        $('.form-checkbox').each(function() {
            var curField = $(this);
            if (curField.find('input.error').length > 0) {
                curField.addClass('error');
            } else {
                curField.removeClass('error');
            }
        });

        $('.form-file').each(function() {
            var curField = $(this);
            if (curField.find('input.error').length > 0) {
                curField.addClass('error');
            } else {
                curField.removeClass('error');
            }
        });
    }

    function windowOpen(contentWindow) {
        var windowWidth     = $(window).width();
        var windowHeight    = $(window).height();
        var curScrollTop    = $(window).scrollTop();
        var curScrollLeft   = $(window).scrollLeft();

        var bodyWidth = $('body').width();
        $('body').css({'height': windowHeight, 'overflow': 'hidden'});
        var scrollWidth =  $('body').width() - bodyWidth;
        $('body').css({'padding-right': scrollWidth + 'px'});
        $(window).scrollTop(0);
        $(window).scrollLeft(0);
        $('body').css({'margin-top': -curScrollTop});
        $('body').data('scrollTop', curScrollTop);
        $('body').css({'margin-left': -curScrollLeft});
        $('body').data('scrollLeft', curScrollLeft);

        $('body').append('<div class="window"><div class="window-overlay"></div><div class="window-loading"></div><div class="window-container window-container-load"><div class="window-content">' + contentWindow + '<a href="#" class="window-close"></a></div></div></div>')

        if ($('.window-container img').length > 0) {
            $('.window-container img').each(function() {
                $(this).attr('src', $(this).attr('src'));
            });
            $('.window-container').data('curImg', 0);
            $('.window-container img').load(function() {
                var curImg = $('.window-container').data('curImg');
                curImg++;
                $('.window-container').data('curImg', curImg);
                if ($('.window-container img').length == curImg) {
                    $('.window-loading').remove();
                    $('.window-container').removeClass('window-container-load');
                    windowPosition();
                }
            });
        } else {
            $('.window-loading').remove();
            $('.window-container').removeClass('window-container-load');
            windowPosition();
        }

        $('.window-overlay').click(function() {
            windowClose();
        });

        $('.window-close').click(function(e) {
            windowClose();
            e.preventDefault();
        });

        $('body').bind('keyup', keyUpBody);

        $('.window form').each(function() {
            initForm($(this));
        });

    }

    function windowPosition() {
        var windowWidth     = $(window).width();
        var windowHeight    = $(window).height();

        if ($('.window-container').width() > windowWidth - 40) {
            $('.window-container').css({'left': 20, 'margin-left': 0});
            $('.window-overlay').width($('.window-container').width() + 40);
        } else {
            $('.window-container').css({'left': '50%', 'margin-left': -$('.window-container').width() / 2});
            $('.window-overlay').width('100%');
        }

        if ($('.window-container').height() > windowHeight - 40) {
            $('.window-overlay').height($('.window-container').height() + 40);
            $('.window-container').css({'top': 20, 'margin-top': 0});
        } else {
            $('.window-container').css({'top': '50%', 'margin-top': -$('.window-container').height() / 2});
            $('.window-overlay').height('100%');
        }
    }

    function keyUpBody(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    }

    function windowClose() {
        $('body').unbind('keyup', keyUpBody);
        $('.window').remove();
        $('body').css({'height': '100%', 'overflow': 'visible', 'padding-right': 0, 'margin': 0});
        $(window).scrollTop($('body').data('scrollTop'));
        $(window).scrollLeft($('body').data('scrollLeft'));
    }

    $(window).resize(function() {
        if ($('.window').length > 0) {
            var windowWidth     = $(window).width();
            var windowHeight    = $(window).height();
            var curScrollTop    = $(window).scrollTop();
            var curScrollLeft   = $(window).scrollLeft();

            $('body').css({'height': '100%', 'overflow': 'visible', 'padding-right': 0, 'margin': 0});
            var bodyWidth = $('body').width();
            $('body').css({'height': windowHeight, 'overflow': 'hidden'});
            var scrollWidth =  $('body').width() - bodyWidth;
            $('body').css({'padding-right': scrollWidth + 'px'});
            $(window).scrollTop(0);
            $(window).scrollLeft(0);
            $('body').data('scrollTop', 0);
            $('body').data('scrollLeft', 0);

            windowPosition();
        }
    });

    $(window).load(function() {
        $('.photo-back-link').each(function() {
            var curWidth = $(this).outerWidth();
            $('.photo-back-link+h1').css({'margin-left': curWidth + 10, 'margin-right': curWidth + 10});
        });
    });

    $(window).bind('load resize', function() {
        $('.detail-video').each(function() {
            var curWidth = $('.wrapper').width();
            $('.detail-video-top').css({'border-left-width': curWidth, 'margin-left': -curWidth / 2});
            $('.detail-video-bottom').css({'border-right-width': curWidth, 'margin-left': -curWidth / 2});
        });
    });

})(jQuery);