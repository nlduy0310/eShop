const fs = require('fs');
const { type } = require('os');
const { DatabaseError } = require('pg');

function rInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rInts(n, min, max) {
    let res = [];
    for (let i = 0; i < n; i++)
        res.push(rInt(min, max));
    return res;
}

var data = JSON.parse(fs.readFileSync('reviews.json'))
var a = []
for (let i = 0; i < 50; i++) {
    a.push({
        productId: rInt(0, 49),
        userId: rInt(0, 49)
    })
}

a = [... new Set(a)]
if (a.length == 50) {
    for (let i = 0; i < 50; i++) {
        data[i].productId = a[i].productId
        data[i].userId = a[i].userId
    }

    fs.writeFileSync('sample_data/reviews.json', JSON.stringify(data), err => {
        if (err) throw err;
        console.log('data saved');
    })
}

