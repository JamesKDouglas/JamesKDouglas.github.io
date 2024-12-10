
//Really it's the 100 to 200 Hz band I want to show the most.
//44 000 Hz goes into 16 000 bins. So 100 hz is in bin 275. 200Hz 550 Hz.
//Using log10 tends to dowsample those bins, discarding about 3/4 of them.
//So I'm adding a divisor of 2.

function makeLogMap(){
    let arr = [];
    //The point of this is to decide which samples to drop.
    //i is the index of the original array. It's about 16 000 long
    //Initially, I want to keep basically all the samples. 

    let min_f = Math.log(20) / Math.log(10);
    console.log(min_f);

    let max_f = Math.log(16000) / Math.log(10);
    console.log(max_f);

    let range = max_f - min_f;
    console.log(range);

    // let frequency = 10000;
    let width_px = 4096;

    // position_px = (Math.log(frequency) / Math.log(10) - min_f) / range * width_px;
    // console.log(position_px);

    //with 16000 bins it's close to 1 bin per frequency.

    for (let i=1;i<width_px;i++){
        arr[i] = Math.round((Math.log(i) / Math.log(10) - min_f) / range * width_px);
    }
    return arr;
}
let logArr = makeLogMap();
// console.dir(logArr,{'maxArrayLength': null});