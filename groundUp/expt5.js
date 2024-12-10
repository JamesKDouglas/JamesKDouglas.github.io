//What I see suggested is to use the frequency and report the pixel position. That's not really what I want though.

//I want to return an array of bin numbers, 0 to 16383. The array is the width of the line in pixels - 4096.

function mapLog(pixels, bins, maxFreq){
    let img = [];
    let freq = 0;

    let freqInc = maxFreq/bins; //usually 44100 hz sampling reporting up to 20 000 hz. 16384 bins. So 1.22hz per bin

    let range = Math.log10(maxFreq);//up to 20 000 hz

    let bin = 0;

    for (let pixelNum=1; pixelNum<pixels; pixelNum++){
        // pixelNum = Math.round(Math.log10(freq) * (pixels/range));//log10(10) retuns 1, log10(100) returns 2 of course. We need torearrange this so I put in the pixelNum and get out the frequency
        // pixelNum/(pixels/range) = Math.log10(freq);
        freq = 10**(pixelNum/(pixels/range));

        //Now get the bin
        bin = Math.round(freq/freqInc);

        img.push(bin);
        
    }
    return img;   
}
let map = mapLog(4096, 16384, 20000);
let test = Math.round(4096/Math.log10(20000));
console.log(test);
console.dir(map,{'maxArrayLength': null});