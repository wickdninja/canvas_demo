(function() {
    'use-strict';

    window.onload = function() {
        var maxSize = 900;

        var img1 = document.getElementById('img1');
        var img2 = document.getElementById('img2');
        var fileInput = document.querySelector('input[type=file]');

        var reader = new FileReader();
        reader.onloadend = function() {

            var data = reader.result;
            img1.src = data;
            var img = new Image;

            img.onload = resizeImage;
            img.src = data;


            function resizeImage() {
                var newDataUri = imageToDataUri(this, 700, 350);
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




}());


function imageToDataUri(img, width, height) {
    var quality = 0.6;
    // create an off-screen canvas
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    // set its dimension to target size
    canvas.width = width;
    canvas.height = height;

    // draw source image into the off-screen canvas:
    ctx.drawImage(img, 0, 0, width, height);

    // encode image to data-uri with base64 version of compressed image
    return canvas.toDataURL('image/jpeg', quality); // quality = [0.0, 1.0]
}
