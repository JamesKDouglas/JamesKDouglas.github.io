// Thank you to the CS50 Duck, who helped to write this.       
function getData() {
    let config = {
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false
        }
      };        
    function mapLog(final, initial){

        //First, make a logarithmic curve
        //Then go through the curve looking at the logarithmic value.
        //Select samples by increment.
    
        let lc = [];//log curve with x,y values. The x value is just the index.
        let y = 0;

        //ok changing the base isn't working. It seems stuck at base 10 or maybe e.
        let base = 10;

        function getBaseLog(base, num) {
            return Math.log(num) / Math.log(base);
        }
        for (let x=1;x<initial;x++){
              
            // y = getBaseLog(base, x);
            y = Math.log10(x);
            lc.push(y);
        }
        
        // let range = getBaseLog(base, initial);
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
            
            let logArr = mapLog(WIDTH, bufferLength);

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
                let min = -130;
                let max = 0;    
                let counter = 0;
                let line = [];
                let pix = [];
                
                for (let i = 0; i < bufferLength; i++) {
                    let intensity = Math.round((dataArray[i] - min) / (max - min) * 249);
                    if (intensity<0){
                        intensity = 0;
                    }
                    //Generate heat map 1 pixel at a time
                    let rgb = rgbAll[intensity];

                    let pix = [rgb[0],rgb[1],rgb[2],255];
                    line.push(pix);
                }
                let newLine = [];

                // downsample
                for (let i=0;i<WIDTH;i++){
                    newLine[i] = line[logArr[i]];
                }

                //downsampling turn off switch!
                // newLine = line;

                // assign the newly transformed data to the line
                for (let i=0;i<newLine.length-1;i++){
                    let index = i * 4;
                    imageData.data[index] = newLine[i][0];     // Red
                    imageData.data[index + 1] = newLine[i][1]; // Green
                    imageData.data[index + 2] = newLine[i][2]; // Blue
                    imageData.data[index + 3] = 255;       // Alpha                        
                }
                    
                offScreenCtx.putImageData(imageData, 0, yOffset);
                line = [];
                
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