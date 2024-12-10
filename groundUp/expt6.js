//What I see suggested is to use the frequency and report the pixel position. That's not really what I want though.

//I want to return an array of pixel numbers. The image starts with a resolution then I want to downsample it.

// for downsampling a line logarithmically to another resolution
function mapLog(final, initial){

    //First, make a logarithmic curve
    //Then go through the curve looking at the logarithmic value.
    //Select samples by increment.

    let lc = [];//log curve with x,y values. The x value is just the index.
    let y = 0;
    for (let x=1;x<initial;x++){
        y = Math.log10(x);
        lc.push(y);
    }
    
    let range = Math.log10(initial);
    let inc = range/final;

    let pixInclude = [];
    // Now, downsample
    let counter = 0;//samples collected, not the same as samples examined. i is samples examined.
    for (let i=0;i<lc.length;i++){
        if (lc[i] >= counter*inc){
            pixInclude.push(i)
            counter++;
        }
    }

    return pixInclude;

}
let map = mapLog(4096, 16384);
// let test = Math.round(4096/Math.log10(20000));
// console.log(test);
console.dir(map,{'maxArrayLength': null});