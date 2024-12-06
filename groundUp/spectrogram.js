// Thank you to the CS50 Duck, who helped to write this. 
function getData() {
    let config = {
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false
        }
      };
    navigator.mediaDevices.getUserMedia( config )
        .then(stream => {
            const audioContext = new AudioContext();
            console.log(audioContext.sampleRate);
            const source = audioContext.createMediaStreamSource(stream);

            const analyser = audioContext.createAnalyser();
            //The resizing works ok but it is based on initial load. If the window is small upon initial load the image will be cropped.
            analyser.fftSize = 4096;

            source.connect(analyser);
            
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Float32Array(bufferLength);

            const canvas = document.getElementById('myCanvas');
            const offScreenCanvas = document.createElement('canvas');
            //Initial height and width is here, then resizing is just with css
            let WIDTH = window.innerWidth;
            let HEIGHT = window.innerHeight;

            //width can be handled better with CSS, either with as % or vw.
            canvas.width = WIDTH;

            //But height defines how many lines are created before starting in the top, and that's right here in js.
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

                //right now the scale isn't logarithmic and I'd like to change that. The high frequencies get a lot of space even though we can't hear them very well.
                //There is a notch at 13000hz, but spectroid has that too. It just isn't as obvious because of the scale.
                //Also it's black and white, which is also nice but not as psychedelic as the blue to pink. What color space even is that? Viridis magma? I may simply map 240 colors in an array but I still need to make that somehow.
                //I could see a curve going through the lefthand rectangular photo here, https://en.wikipedia.org/wiki/HSL_and_HSV#/media/File:Hsl-hsv_models.svg
                //Or from the white then following near the edge towards the pink corner, swooping towards the blue and up towards black corner
                https://www.infinityinsight.com/product.php?id=91
                //That is, the first part is G decreasing, second. Then R and G decrease together to make the turn, then R decreases straight for a while. Another turn where R and B decrease. Finally, blue decreases. That would take us from white through pink, into the dark blues and black. Just divide this journey into about 250 pieces. 70 20 70 20 70 comes to 250.
                //Also I would like a scale.
                requestWakeLock();
                requestAnimationFrame(drawSpectrogram);
                analyser.getFloatFrequencyData(dataArray);
                let min = -120;
                let max = 0;    
                let counter = 0;
                if (yOffset>10){
                    for (let i = 0; i < bufferLength; i++) {
                        let intensity = Math.round((dataArray[i] - min) / (max - min) * 249);
                        if (intensity<0){
                            intensity = 0;
                        }
    
                        let index = i * 4;
                        let rgb = rgbAll[intensity];
                        imageData.data[index] = rgb[0];     // Red
                        imageData.data[index + 1] = rgb[1]; // Green
                        imageData.data[index + 2] = rgb[2]; // Blue
                        imageData.data[index + 3] = 255;       // Alpha
                    }
                    offScreenCtx.putImageData(imageData, 0, yOffset);
                }
                else {
                    //This just paints the scale at the top so I can see it/work with it.
                    for (let i = 0; i < bufferLength; i++) {
                        let intensity = Math.round((i/bufferLength)*249);
                        let index = i * 4;
                        let rgb = rgbAll[intensity];
                        if(yOffset == 1){
                            console.log(intensity);
                            console.log(rgb);
                        }
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
            // let counter = 0;
            function drawWave() {
                // if (counter == 100){
                //     console.log(dataArray);
                //     counter = 0;
                // }
                // counter++;
                requestAnimationFrame(drawWave);
                analyser.getFloatTimeDomainData(dataArray);
                canvasCtx.fillStyle = "rgb(200 200 200)";
                canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
                canvasCtx.lineWidth = 2;
                canvasCtx.strokeStyle = "rgb(0 0 0)";
                canvasCtx.beginPath();
                const sliceWidth = WIDTH / bufferLength;
                let x = 0;
                for (let i = 0; i < bufferLength; i++) {
                    const v = (dataArray[i] + 1.0) / 2.0;
                    const y = v * HEIGHT;
                  
                    if (i === 0) {
                      canvasCtx.moveTo(x, y);
                    } else {
                      canvasCtx.lineTo(x, y);
                    }
                  
                    x += sliceWidth;
                  }
                canvasCtx.lineTo(WIDTH, HEIGHT / 2);
                canvasCtx.stroke();
            }
            // drawWave();

            function drawFft(){
                requestAnimationFrame(drawFft);
                analyser.getFloatTimeDomainData(dataArray);

                canvasCtx.fillStyle = "rgb(200 200 200)";
                canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

                const barWidth = (WIDTH / bufferLength) * 2.5;
                let barHeight;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    // barHeight = dataArray[i] / 2;
                    barHeight = (dataArray[i] + 1) * (HEIGHT / 2);

                    canvasCtx.fillStyle = `rgb(${barHeight + 100} 50 50)`;
                    canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);
                  
                    x += barWidth + 1;
                }
            }
            // drawFft();

            
        })
        .catch(err => {
            console.error('Error accessing the microphone:', err);
        });
}
getData();