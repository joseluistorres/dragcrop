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
 */
 
(function($) {

	$.fn.dragCrop = function(options){
	  
		// default configuration properties
		var defaults = {
			image_id: 'xlaopegj0ka',
			src_image: '',
			image_width: 800,
			image_height: 600,
			view_port_width: 208,
			view_port_height: 255,
			ratio: 1,
			form_id: 'frm_id_123456'
		}; 
			
		var options = $.extend(defaults, options); 
		
	   this.each(function() {
			var x = 0; 
		    var y = 0;
			max_left_image = options.image_width - options.view_port_width;
		    max_top_image = options.image_height - options.view_port_height;
		
			$(this).css('position', 'relative');
 			// create the element
			$('<div class="cropper_view_port">').appendTo($(this));
			$('<input type="button">').attr('id', 'crop_' + options.image_id).appendTo($('div.cropper_view_port'));
			crop_input = $('input#crop_' + options.image_id);
			crop_input.css('background', "url('" + options.src_image + "')");
			crop_input.css('background-size', '100%');
			crop_input.css('width', options.image_width + 'px');
			crop_input.css('height', options.image_height + 'px'); 
			crop_input.css('position', 'absolute');
			left_position = - (options.image_width - options.view_port_width)/2;
			top_position = - (options.image_height - options.view_port_height)/2; 
			crop_input.css('left', left_position + 'px'); 
			crop_input.css('top', top_position + 'px'); 
			crop_input.css('cursor', 'move');
			
			
			// cropper_view_port
			$('div.cropper_view_port').css('position', 'relative');
			$('div.cropper_view_port').css('width', options.view_port_width + 'px');
			$('div.cropper_view_port').css('height', options.view_port_height + 'px');
			$('div.cropper_view_port').css('z-index', '310');
			$('div.cropper_view_port').css('overflow', 'hidden');
			
			// create buttons zoom in and out
			save_cropt_container = 'save_crop_container_' + options.image_id;
			
			$('<div id="' + save_cropt_container + '">').appendTo($(this));
			$('<div id="zoom_in_' + options.image_id + '" title="Zoom In">').appendTo($('div#' + save_cropt_container));
			$('<div id="zoom_out_' + options.image_id + '" title="Zoom Out">').appendTo($('div#' + save_cropt_container));
			$('div#' + save_cropt_container).css('position', 'absolute');
			$('div#' + save_cropt_container).css('z-index', '370');
			$('div#' + save_cropt_container).css('top', '160px');
			$('div#' + save_cropt_container).css('left', '10px');
			$('div#' + save_cropt_container).css('width', '185px');
			$('div#' + save_cropt_container).css('height', '50px');
			$('div#' + save_cropt_container).css('background-color', '#FFF');
			$('div#' + save_cropt_container).css('border', '1px solid #F96500');
			zoom_in = $('div#zoom_in_' + options.image_id);
			zoom_out = $('div#zoom_out_' + options.image_id);
			
			zoom_in.css('width','20px');
			zoom_in.css('height','20px');
			zoom_in.css('background', 'url(images/zoom_buttons.png) no-repeat left top');
			zoom_in.css('position', 'relative');
			zoom_in.css('left', '22px');
			zoom_in.css('top', '15px');
			zoom_in.css('cursor', 'pointer');
			
			zoom_out.css('width','20px');
			zoom_out.css('height','20px');
			zoom_out.css('background', 'url(images/zoom_buttons.png) no-repeat -20px 0px');
			zoom_out.css('position', 'relative');
			zoom_out.css('left', '47px');
			zoom_out.css('top', '-5px');
			zoom_out.css('cursor', 'pointer');

			// enable zoom in
			zoom_in.live('click', function(e){
		        original_width = 1569;
		        crop = crop_input;
		        width = crop.width();
		        height = crop.height();
		        percentage_to_reduce = (100)/parseInt(width);
		        reduce_amount = parseInt(parseInt(height) * percentage_to_reduce);
		        crop.css('width', (parseInt(width) + 100) + 'px');
		        crop.css('height', (parseInt(height) + reduce_amount - 9) + 'px');
		        ratio = original_width/crop.width();

		        max_left_image = crop.width() - 208;
		        max_top_image = crop.height() - 255;
		        crop.css('image-rendering','-moz-crisp-edges');
		        crop.css('image-rendering','auto');
		        crop.css('left', parseFloat(crop.css("left")) + 1);
		        crop.css('left', parseFloat(crop.css("left")) - 1);


		    });
		
			zoom_out.live('click', function(e){
		        original_width = 1569;
		        crop = crop_input;
		        width = crop.width();
		        height = crop.height();
		        percentage_to_reduce = (100)/parseInt(width);
		        reduce_amount = parseInt(parseInt(height) * percentage_to_reduce);

		        if ((parseInt(width) - 100)>=options.view_port_width && (parseInt(height) - reduce_amount - 9)>=options.view_port_height){
		            crop.css('width', (parseInt(width) - 100) + 'px');
		            crop.css('height', (parseInt(height) - reduce_amount - 9) + 'px');
		            ratio = original_width/crop.width();

		            max_left_image = crop.width() - options.view_port_width;
		            max_top_image = crop.height() - options.view_port_height;
		            crop.css('image-rendering','-moz-crisp-edges');
		            crop.css('image-rendering','auto');
		            crop.css('left', '-49px');
		            crop.css('top', '-61px' );
		            
		        }

		    });
		
			//draggable
			crop_input.mousedown(function () {

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
		            var max_left = - max_left_image;

		            if (left >= min_left) left = min_left;
		            if (left <= max_left) left = max_left;
		            crop.css("left", left);

		            var top = parseFloat(crop.css("top")) + y_movement;
		            var min_top = 0;
		            var max_top =  - max_top_image;

		            if (top >= min_top) top = min_top;
		            if (top <= max_top) top = max_top;
		            crop.css("top", top);
		            //Coordinates
		            frm_str = $("form#" + options.form_id);
		            frm_str.find("input#crop_x").val(Math.round(parseFloat(crop.css("left")) * -1 * ratio ));
		            frm_str.find("input#crop_y").val(Math.round(parseFloat(crop.css("top")) * -1 * ratio ));
		            frm_str.find("input#crop_w").val(Math.round(options.view_port_width * ratio));
		            frm_str.find("input#crop_h").val(Math.round(options.view_port_height * ratio));

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
		        $(document).unbind("mousemove");

		    });
		 
	   });
	};

})(jQuery);
