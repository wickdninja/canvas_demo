(function() {
    'use-strict';

    window.onload = function() {
        var maxSize = 900;

        var img1 = document.getElementById('img1');
        var img2 = document.getElementById('img2');
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        var fileInput = document.querySelector('input[type=file]');

        var reader = new FileReader();
        reader.onloadend = function() {
            window.setTimeout(function() {
                var data = reader.result;
                console.log(data.length);
                img1.src = data;
                var img = new Image();
                img.src = data;
                console.log('img: ' + img.width + ' x ' + img.height);

                var width = img.width / 4;
                var height = img.height / 4;
                canvas.width = width;
                canvas.height = height;
                window.setTimeout(function() {
                    ctx.drawImage(img, 0, 0, width, height);
                    var dataUrl = canvas.toDataURL('image/jpeg');
                    img2.src = dataUrl;
                }, 1000);

            }, 100);


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
