var imageScale = function (width, height) {
    var MAX_WIDTH = 640; //800
    var MAX_HEIGHT = 480;//600

    // var width = parseInt(Math.min(MAX_WIDTH / width, MAX_HEIGHT / height) * width);
    // var height = parseInt(Math.min(MAX_WIDTH / width, MAX_HEIGHT / height) * height);

    if (width > height) {
        if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
        }
    } else {
        if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
        }
    }

    var area = {width: width, height: height};
    return area;
}
