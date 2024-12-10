//What I see suggested is to use the frequency and report the pixel position, like this

function mapLog(pixels, bins, freqIn){
    let pixelNum = 0;
    let img = [];
    let pix = [];
    let freq = 0;

    let freqInc = freqIn/bins; //usually 44100 hz sampling reporting up to 20 000 hz. 16384 bins. So 1.22hz per bin

    let range = Math.log10(20000);//up to 20 000 hz

    for (let bin=1;bin<bins;bin++){
        freq = freqInc*bin;

        pixelNum = Math.round(Math.log10(freq) * (pixels/range));//log10(10) retuns 1, log10(100) returns 2 of course.
        pix = [pixelNum, freq];

        //Here we generate an "image" with pixel [position, frequency]. 16384 entries.
        img.push(pix);
        
    }
    return img;
    
}
let map = mapLog(4096, 16384, 20000);
let test = Math.round(4096/Math.log10(20000));
// console.log(test);
console.dir(map,{'maxArrayLength': null});
