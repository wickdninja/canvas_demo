//wrap logic in IIFE
(function() {
    'use-strict';
    var img1, img2, fileInput, reader, data, img, isTall, quality = 0.8;
    //NOTE: Assumes the photo was taken in landscape, or rotates the photo to landscape if not.
    window.onload = function() {
        img1 = document.getElementById('img1');
        img2 = document.getElementById('img2');
        fileInput = document.querySelector('input[type=file]');
        reader = new FileReader();
        reader.onloadend = imageLoaded

        fileInput.onchange = function() {
            var file = document.querySelector('input[type=file]').files[0];
            if (file) {
                reader.readAsDataURL(file);
            } else {
                img1.src = '';
            }
        };

    };

    function imageLoaded() {
        data = reader.result;
        img1.onload = getOrientation
        img1.src = data;
    }
    // Resize the image
    function resizeImage() {
        var width = 0,
            height = 0,
            target = 1600,
            ratio = 1,
            newDataUri = null;

        ratio = (img.width / target);
        width = (img.width / ratio);
        height = (img.height / ratio);
        var bin = atob(this.split(',')[1]);
        var exif = EXIF.readFromBinaryFile(new BinaryFile(bin));
        console.log(exif);
        alert(exif.Orientation);
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            if (isTall) {
                newDataUri = rotateBase64Image(this, width, height);
            } else {
                newDataUri = imageToDataUri(this, width, height, quality);
            }
        } else {
            newDataUri = imageToDataUri(this, width, height, quality);
        }
        img2.src = newDataUri;
    }

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
    /*
     * Rotates the image 90 degrees on iOS devices.
     * (This should only apply if the photo is in portrait mode)
     */
    function rotateBase64Image(image, width, height) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext("2d");
        canvas.width = height;
        canvas.height = width;
        ctx.translate(height, 0);
        ctx.rotate(90 * Math.PI / 180);
        ctx.drawImage(image, 0, 0, width, height);
        return canvas.toDataURL('image/jpeg', quality);
    }

    function getOrientation() {
        isTall = isPortrait(img1);
        img = new Image();
        img.onload = resizeImage;
        img.src = data;
    }

    function isPortrait(img) {
        var w = img.naturalWidth || img.width,
            h = img.naturalHeight || img.height;
        return (h > w);
    }

}());


