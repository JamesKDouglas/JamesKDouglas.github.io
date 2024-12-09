// Thank you to the CS50 Duck, who helped to write this.       
function getData() {
    let config = {
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false
        }
      };            
// All we can really do is downsample. I want to chart with a logarithmic axis
// So the scale still goes from 0 to 20 000 hz (well. 16.5kHz is all I can hear)
//But we discard samples in the high frequency. And the low frequency samples get spread out. We can see them more clearly but you can't get more data. There is no downsampling in the very lower end but as we go up in frequency, it takes place more. That is, more samples are discarded.
//Suppose we want about 4000 pixels in the line. 
//We need to generate a map that discards some of the samples but keeps 400 of them.
// What is discarded will be more common in the higher frequency end.
// Suppose we pass in data from an fft with 32 000 buckets. 
// That's 16000 data points. 
//How can we choose which indices of the 16 000 we want to keep?
//Choose 4 000 indeex values.
//y is the input. x is the output. For indexes.
//x = logy*
//
    function makeLogMap(){
        let finalRes = 4096;//approx
        let arr = [];
        let exp =1.165;//This comes from originalres. I just chose it experimentally. The point is to generate an array of final resolution size using an exponent.
        
        for (let i=0;i<finalRes;i++){
            arr[i] = Math.round(i**exp);
        }
        return arr;
    }
    let logArr = makeLogMap();

    navigator.mediaDevices.getUserMedia( config )
        .then(stream => {
            const audioContext = new AudioContext();
            // console.log(audioContext.sampleRate);
            const source = audioContext.createMediaStreamSource(stream);

            const analyser = audioContext.createAnalyser();
            //The resizing works ok but it is based on initial load. If the window is small upon initial load the image will be cropped.
            analyser.fftSize = 32768;

            source.connect(analyser);
            
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Float32Array(bufferLength);

            const canvas = document.getElementById('myCanvas');
            const offScreenCanvas = document.createElement('canvas');
            //Initial height and width is here, then resizing is just with css
            let WIDTH = window.innerWidth;
            let HEIGHT = window.innerHeight;

            canvas.width = WIDTH;
            canvas.height = HEIGHT;
            offScreenCanvas.width = WIDTH;
            offScreenCanvas.height = HEIGHT;

            const offScreenCtx = offScreenCanvas.getContext('2d');
            const canvasCtx = canvas.getContext('2d');
            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
            let yOffset = 0;
            let imageData = offScreenCtx.createImageData(WIDTH,1);

            function makeRGBArr(){
                let rgbAll = [];
                let rgb = [];
                // const colors = 250;
                let r = 255;
                let g = 255;
                let b = 255;
                
                for (let i=0;i<70;i++){
                    g = g-2;
                    rgb = [r,g,b];
                    rgbAll.push(rgb);
                }
                for (let i=1;i<=70;i++){
                    r = r-1;
                    g = g-1;
                    rgb = [r,g,b];
                    rgbAll.push(rgb);
                }
                for (let i=1;i<=20;i++){
                    r = r-2;
                    rgb = [r,g,b];
                    rgbAll.push(rgb);
                }
                for (let i=1;i<=50;i++){
                    r = r-1;
                    b = b-1;
                    rgb = [r,g,b];
                    rgbAll.push(rgb);
                }
                for (let i=1;i<=40;i++){
                    b = b-4;
                    r = r-2;
                    g = g-1;
                    rgb = [r,g,b];
                    rgbAll.push(rgb);
                }
                return rgbAll;
            }
            let wakeLock = null;

            async function requestWakeLock() {
                try {
                    wakeLock = await navigator.wakeLock.request('screen');
                } catch (err) {
                    console.error(`${err.name}, ${err.message}`);
                }
            }
            
            function releaseWakeLock() {
                if (wakeLock !== null) {
                    wakeLock.release();
                    wakeLock = null;
                }
            }

            let rgbAll = makeRGBArr().reverse();
            function drawSpectrogram() {

                //right now the scale isn't logarithmic and I could change that. That was one of the original specifications, but honestly I like it how it is. 
                //There is a notch at 13000hz, but (the inspiration for this) spectroid has that too. It just isn't as obvious because of the scale.
                requestWakeLock();
                requestAnimationFrame(drawSpectrogram);
                analyser.getFloatFrequencyData(dataArray);
                let min = -140;
                let max = 0;    
                let counter = 0;
                let line = [];
                let pix = [];
                if (yOffset>10){
                    for (let i = 0; i < bufferLength; i++) {
                        let intensity = Math.round((dataArray[i] - min) / (max - min) * 249);
                        if (intensity<0){
                            intensity = 0;
                        }
                        
                        // 4 values per pixel

//So right now the line goes straight into this 1D array with rgba in series.
//But I want to downsample.
//an easy way to do that would be to have an array of pixels and discard ones i don't want.
//For that I would like a 2D array of [rgba]

                        //Generate heat map 1 pixel at a time
                        let rgb = rgbAll[intensity];

                        let pix = [rgb[0],rgb[1],rgb[2],255];
                        line.push(pix);
                    }
                    let newLine = [];
                    //downsample
                    for (let i=0;i<4096;i++){
                        newLine[i] = line[logArr[i]];
                    }

                    for (let i=0;i<newLine.length-1;i++){
                        let index = i * 4;
                        imageData.data[index] = newLine[i][0];     // Red
                        imageData.data[index + 1] = newLine[i][1]; // Green
                        imageData.data[index + 2] = newLine[i][2]; // Blue
                        imageData.data[index + 3] = 255;       // Alpha                        
                    }
                        
                    offScreenCtx.putImageData(imageData, 0, yOffset);
                    line = [];
                }
                else {
                    //This just paints the scale at the top.
                    for (let i = 0; i < bufferLength; i++) {
                        let intensity = Math.round((i/bufferLength)*249);
                        let index = i * 4;
                        let rgb = rgbAll[intensity];
                        // if(yOffset == 1){
                        //     console.log(intensity);
                        //     console.log(rgb);
                        // }
                        imageData.data[index] = rgb[0];     // Red
                        imageData.data[index + 1] = rgb[1]; // Green
                        imageData.data[index + 2] = rgb[2]; // Blue
                        imageData.data[index + 3] = 255;       // Alpha
                    }
                    offScreenCtx.putImageData(imageData, 0, yOffset);
                }
                yOffset = (yOffset + 1) % HEIGHT;
                canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
                canvasCtx.drawImage(offScreenCanvas, 0, 0);
            }
            drawSpectrogram();
            releaseWakeLock();
            
        })
        .catch(err => {
            console.error('Error accessing the microphone:', err);
        });
}
getData();