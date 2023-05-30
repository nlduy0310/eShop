const helper = {};

helper.createStarsList = (stars) => {
    let star = Math.floor(stars);
    let half = stars - star;
    let str = '<div class="ratting">';
    let i = 0;
    for (i = 0; i < star; i++)
        str += '<i class="fa fa-star"></i>';
    if (half) {
        str += '<i class="fa fa-star-half"></i>';
        i++;
    }
    for (; i < 5; i++)
        str += '<i class="fa fa-star-o"></i>'
    str += '</div>';
    return str;
}

module.exports = helper;