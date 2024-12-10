
//Really it's the 100 to 1000 Hz band I want to show the most.
//44 000 Hz goes into 16 000 bins. 

function makeLogMap(){
    let arr = [];
    //The point of this is to decide which samples to drop.
    //i is the index of the original array. It's about 16 000 long
    //Initially, I want to keep basically all the samples. 
    //So we're turning a 16 000 entry array into 4096 entries.

    //That means generating an array of 4096 values with the values from 1 to 16 000.

    //There will be about 4 image sections of equal width.
    //The first has data from 1 to 10 hz. So that's 1000 pixels for only 4 bins.

    //There should be about the same number of entries from 0 to 10, 10 to 100 hz, 100 to 1000 and 1000 to 10 000.
    //With 44 000 frequencies and 16 000 bins that's about 2.75hz band per bin. So the first 1000 entries have data from 
    // only 4 bins. 

    //Ok imagine we want 4000 px line from 10 000 bins from 0hz to 10 000 hz. 1hz per bin.
    //That's 4 sections of 1000 px each from 0 to 10, 10 to 100, 100 to 1000 and 1000 to 10 000

    let min = Math.log10(1);//0
    let max = Math.log10(10000);
    let range = max-min;

    let imgWidth = 4000;//final line width

    let bins = 10000;

    let index = 0;
    for (let bin=1;bin<bins;bin++){
        arr[bin-1] = Math.log10(bin)/range*imgWidth;
    }
    return arr;
}
let logArr = makeLogMap();
console.dir(logArr[1],{'maxArrayLength': null});
// I can't figure this out right  now, not sure why it seems so hard