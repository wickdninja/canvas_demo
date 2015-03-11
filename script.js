(function() {
    'use-strict';

    window.onload = function() {
        var img1 = document.getElementById('img1');
        var img2 = document.getElementById('img2');
        var canvas = document.getElementById('canvas');
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

                var maxSize = 900;
                var width = img1.width;
                var height = img1.height;

                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / width;
                        height = maxSize;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                window.setTimeout(function() {
                    canvas.getContext('2d').drawImage(img1, 0, 0, width, height);
                    var dataUrl = canvas.toDataURL('image/jpeg');
                    img2.src = dataUrl;
                }, 10000);

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
