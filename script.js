(function() {
    'use-strict';

    window.onload = function() {
        var img1 = document.getElementById('img1');
        var img2 = document.getElementById('img2');
        var canvas = document.getElementById('canvas');
        var fileInput = document.querySelector('input[type=file]');

        var reader = new FileReader();
        reader.onloadend = function() {
            var data = reader.result;
            img1.src = data;

            canvas.width = img1.width;
            canvas.height = img1.height;
            canvas.getContext('2d').drawImage(data, 0, 0, img1.width, img1.height);
            var dataUrl = canvas.toDataURL();

            img2.src = dataUrl;

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
