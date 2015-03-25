//wrap logic in IIFE
(function() {
    'use-strict';

    //NOTE: Assumes the photo was taken in landscape, or rotates the photo to landscape if not.
    window.onload = function() {
        var img1 = document.getElementById('img1');
        var img2 = document.getElementById('img2');
        var fileInput = document.querySelector('input[type=file]');
        var reader = new FileReader();
        reader.onloadend = function() {
            var data = reader.result;
            img1.src = data;
            var img = new Image();
            img.onload = resizeImage;
            img.src = data;

            // Resize the image
            function resizeImage() {
                var width = 0,
                    height = 0,
                    quality = 0.8,
                    target = 1600,
                    ratio = 1;

                ratio = (img.width / target);
                width = (img.width / ratio);
                height = (img.height / ratio);

                var newDataUri = imageToDataUri(this, width, height, quality);
                img2.src = newDataUri;
            }
        };

        fileInput.onchange = function() {
            var file = document.querySelector('input[type=file]').files[0];
            if (file) {
                reader.readAsDataURL(file);
            } else {
                img1.src = '';
            }
        };
    };

    function imageToDataUri(img, width, height, quality) {
        // create an off-screen canvas
        var canvas = document.createElement('canvas');
        //get the context of the canvas
        var ctx = canvas.getContext('2d');
        // set its dimension to target size
        canvas.width = width;
        canvas.height = height;
        // rotate around this point
        // draw source image into the off-screen canvas:
        drawImageIOSFix(ctx, img, 0, 0, img.width, img.height, 0, 0, width, height);
        // encode image to data-uri with base64 version of compressed image
        return canvas.toDataURL('image/jpeg', quality || 0.8); // quality = [0.0, 1.0]
    }

    /**
     * Detecting vertical squash in loaded image.
     * Fixes a bug (in some iOS devices) which squashes an image vertically while drawing into canvas.
     * This function from https://github.com/stomita/ios-imagefile-megapixel
     */
    function detectVerticalSquash(img) {
        // var iw = img.naturalWidth;
        var ih = img.naturalHeight;
        var canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = ih;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var data = ctx.getImageData(0, 0, 1, ih).data;
        // search image edge pixel position in case it is squashed vertically.
        var sy = 0;
        var ey = ih;
        var py = ih;
        while (py > sy) {
            var alpha = data[(py - 1) * 4 + 3];
            if (alpha === 0) {
                ey = py;
            } else {
                sy = py;
            }
            py = (ey + sy) >> 1;
        }
        var ratio = (py / ih);
        return (ratio === 0) ? 1 : ratio;
    }

    /**
     * A replacement for context.drawImage
     * (args are for source and destination).
     */
    function drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
        var vertSquashRatio = detectVerticalSquash(img);
        ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio,
            sw * vertSquashRatio, sh * vertSquashRatio,
            dx, dy, dw, dh);
    }
}());
