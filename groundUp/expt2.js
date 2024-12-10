function makeAlgArr(){
    let original = 16384;//exact
    let finalRes = 4096;//or so
    let arr = [];
    let exp =1.165;
    
    for (let i=0;i<finalRes;i++){
        arr[i] = Math.round(i**exp);
    }
    for (let i=4000;i<4094;i++){
        console.log(arr[i]);
    }
}
makeAlgArr();

//discarding roughly 1/4 samples in the higher end.