/*
 * 	Drag and Crop Plugin - jQuery plugin
 * 	Dynamic tool to enable an image to be movable to crop it with a viewport
 *	written by Jose Luis Torres	
 *	http://www.vulcanik.com
 *
 *	Copyright (c) 2012 Jose Luis Torres (http://www.vulcanik.com)
 *	Licensed under the MIT License
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */ (function ($) {

    $.fn.dragCrop = function (options) {

        // default configuration properties
        var defaults = {
            image_id: 'xlaopegj0ka',
            src_image: '',
            image_width: 800,
            image_height: 600,
            view_port_width: 208,
            view_port_height: 255,
            ratio: 1,
            form_id: 'frm_id_123456',
            max_left_image: 0,
            max_top_image: 0,
            crop_input: null
        };

        var options = $.extend(defaults, options);

        this.each(function () {
            var x = 0;
            var y = 0;
            options.max_left_image = options.image_width - options.view_port_width;
            options.max_top_image = options.image_height - options.view_port_height;
            $this = $(this);
            $this.css('position', 'relative');
            // create the element
            $cropper_view_port = $('<div id="cropper_view_port_' + options.image_id + '">');
            $cropper_view_port.appendTo($this);
            $crop_input = $('<input type="button">');
            $crop_input.attr('id', 'crop_' + options.image_id).appendTo($cropper_view_port);
            options.crop_input = $crop_input;
            left_position = -(options.image_width - options.view_port_width) / 2;
            top_position = -(options.image_height - options.view_port_height) / 2;

            options.crop_input.css({
                'background': "url('" + options.src_image + "')",
                'background-size': '100%',
                'width': options.image_width,
                'height': options.image_height,
                'position': 'absolute',
                'left': left_position,
                'top': top_position,
                'cursor': 'move'
            });

            // cropper_view_port
            $cropper_view_port.css({
                'position': 'relative',
                'width': options.view_port_width,
                'height': options.view_port_height,
                'z-index': '310',
                'overflow': 'hidden'
            });

            // create buttons zoom in and out
            $save_cropt_container = $('<div id="save_crop_container_' + options.image_id + '">');
            $save_cropt_container.appendTo($this);
            $zoom_in = $('<div id="zoom_in_' + options.image_id + '" title="Zoom In">');
            $zoom_out = $('<div id="zoom_out_' + options.image_id + '" title="Zoom Out">');
            $zoom_in.appendTo($save_cropt_container);
            $zoom_out.appendTo($save_cropt_container);

            $save_cropt_container.css({
                'position': 'absolute',
                'z-index': '370',
                'top': '160px',
                'left': '10px',
                'width': '185',
                'height': '50',
                'background-color': '#FFF',
                'border': '1px solid #F96500'
            });

            $zoom_in.css({
                'width': '20',
                'height': '20',
                'background': 'url(images/zoom_buttons.png) no-repeat left top',
                'position': 'relative',
                'left': '22px',
                'top': '15px',
                'cursor': 'pointer'
            });

            $zoom_out.css({
                'width': '20',
                'height': '20',
                'background': 'url(images/zoom_buttons.png) no-repeat -20px 0px',
                'position': 'relative',
                'left': '47px',
                'top': '-5px',
                'cursor': 'pointer'
            });


            // enable zoom in
            $zoom_in.bind('click', function () {
                original_width = 1569;
                crop = options.crop_input;
                width = crop.outerWidth();
                height = crop.outerHeight();
                percentage_to_reduce = 100 / width;
                reduce_amount = height * percentage_to_reduce;
                new_width = width + 100;
                new_height = height + reduce_amount;
                crop.css({
                    'width': new_width,
                    'height': new_height,
                    'image-rendering': '-moz-crisp-edges',
                    'left': crop.css('left') + 1,
                    'left': crop.css('left') - 1
                });
                options.ratio = original_width / new_width;
                options.max_left_image = crop.width() - 208;
                options.max_top_image = crop.height() - 255;


            });

            $zoom_out.bind('click', function () {
                original_width = 1569;
                crop = options.crop_input;
                width = crop.outerWidth();
                height = crop.outerHeight();
                percentage_to_reduce = 100 / width;
                reduce_amount = height * percentage_to_reduce;
                new_width = width - 100;
                new_height = height - reduce_amount;

                if ((width - 100) >= options.view_port_width && (height - reduce_amount) >= options.view_port_height) {
                    crop.css({
                        'width': new_width,
                        'height': new_height,
                        'image-rendering': '-moz-crisp-edges',
                        'image-rendering': 'auto',
                        'left': '-49px',
                        'top': '-61px'
                    });
                    options.ratio = original_width / crop.width();
                    options.max_left_image = crop.width() - options.view_port_width;
                    options.max_top_image = crop.height() - options.view_port_height;


                }

            });

            //draggable
            options.crop_input.mousedown(function () {

                var crop = $(this);

                $(document).mousemove(function (e) {

                    var x_movement = 0;
                    var y_movement = 0;

                    if (x == e.pageX || x == 0) {
                        x = e.pageX;
                    } else {
                        x_movement = e.pageX - x;
                        x = e.pageX;
                    }

                    if (y == e.pageY || y == 0) {
                        y = e.pageY;
                    } else {
                        y_movement = e.pageY - y;
                        y = e.pageY;
                    }

                    var left = parseFloat(crop.css("left")) + x_movement;
                    var min_left = 0;
                    var max_left = -options.max_left_image;

                    if (left >= min_left) left = min_left;
                    if (left <= max_left) left = max_left;
                    crop.css("left", left);

                    var top = parseFloat(crop.css("top")) + y_movement;
                    var min_top = 0;
                    var max_top = -options.max_top_image;

                    if (top >= min_top) top = min_top;
                    if (top <= max_top) top = max_top;
                    crop.css("top", top);
                    //Coordinates
                    frm_str = $("form#" + options.form_id);
                    frm_str.find("input#crop_x").val(Math.round(parseFloat(crop.css("left")) * -1 * options.ratio));
                    frm_str.find("input#crop_y").val(Math.round(parseFloat(crop.css("top")) * -1 * options.ratio));
                    frm_str.find("input#crop_w").val(Math.round(options.view_port_width * options.ratio));
                    frm_str.find("input#crop_h").val(Math.round(options.view_port_height * options.ratio));

                    //for demo
                    $('div#show_crop_x').html('x=' + frm_str.find("input#crop_x").val());
                    $('div#show_crop_y').html('y=' + frm_str.find("input#crop_y").val());
                    $('div#show_crop_w').html('w=' + frm_str.find("input#crop_w").val());
                    $('div#show_crop_h').html('h=' + frm_str.find("input#crop_h").val());

                });

            });

            $(document).mouseup(function () {

                x = 0;
                y = 0;
                $(document).unbind('mousemove');

            });

        });
    };

})(jQuery);