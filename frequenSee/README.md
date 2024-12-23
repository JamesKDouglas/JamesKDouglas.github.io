# frequenSee Spectrogram 
#### Video Demo:  https://youtu.be/vLs9gzSbqdQ
### Live Demo https://jameskdouglas.github.io/frequenSee/
#### Description:

This is a sound visualization tool that creates a spectrogram of microphone data. It is the final project for CS50, a computer science course from Harvard. 

This program makes most laptops into high resolution spectrograph machines. In particular, it was made to broadcast to a 4K screen.

To make it, I learned about streaming audio using the Web Audio API and drawing images in a browser. Achieving a high quality spectrogram meant learning more about resolution mapping and learning more about fast fourier transforms.

The program takes the sound from your microphone and uses the Web Audio API built into most browsers to perform a mathematical operation called a Fast Fourier Transform. This wizardry makes a list of all the frequencies that you hear and how loud they are. The frequency is given a position on the line of pixels drawn on the screen and the intensity is mapped to a color scheme to give the pixel a color. That's what you see on the screen when the app is running. 

Inspiration comes from the Spectroid app, which works well on my old Android phone but can only run on Android devices.

The goal was to create something that doesn't need to be installed or signed up for. Just use the URL. 

I would like this project to be useful to others in their code journey, which means that it is important to keep it simple. It is meant for display at a party so one of the main specifications is, "no mucking around necessary".

HOW TO USE:
- Go to the URL: https://jameskdouglas.github.io/frequenSee/
- If you change the screen size then refresh your browser to correct the dimensions.
- If you see anything odd, like a fuzzy spectrogram, check the input. (on a mac) that's found in Preferences>Sound>input/output. Often, connecting something like a bluetooth speaker will actually cause the audio input to switch to that device. Put it back on audio input from your laptop, which will be decent quality.

Download the code from the github repository and change it if you want to. Use the terminal command "http-server" to serve it to a browser locally.

The simplity is inspired by a Supreme Court Justice Oliver Holmes,

"“For the simplicity on this side of complexity, I wouldn't give you a fig. But for the simplicity on the other side of complexity, for that I would give you anything I have.”"

The computers we use now can do amazing things with only a few lines of code. Creating a spectrogram like this used to take expensive instruments. Not anymore!

--

The files are:
- style.css. This helps with layout and most importantly resizing the spectrogram. With only a few lines of CSS the resizing of the spectrogram works much better than doing the same task using Javascript. Part of this code is from the 100Devs freelance agency, which I am part of and is based in San Francisco.

- index.html. This is the one and only html file. It holds the canvas tag where the image goes as well as sewing together the css and javascript.

- spectrogram.js. This is the heart of the program. It retrieves data from the Web Audio API, requests a transform of the data and creates the images that are sent to the canvas tag in the html file. It runs only on the client. That is all that is necessary and ensures privacy.

The program works by creating a virtual image then replacing the displayed image with the virtual one. Each audio sample is analyzed to generate a spectra of frequencies present, and that spectra becomes a line in the image. This line by line technique has no smoothing or downsampling in the time domain in order to present the highest resolution. In order to display the low frequencies more prominently a logarithmic scale is used. That tends to push the imporant area involving human speech to the right and make things there easier to see, while discarding data in the high frequencies.

My goal here was to make the most of high resolution screens commonly available. A lot of other implementations downsample and crop the image. The fact of the matter is that most modern computers don't need to do that and can easily handle this computation. While reviewing other spectrogram programs, which often downsample, it struck me that much more is possible. 

The color scheme is an important part of this file. The makeRGBArr function generates an array of RGB values that navigates an RGB color cube. You can imagine it as following a line in the cube. This tool was used to create it by visualizing the journey through the cube:

https://www.infinityinsight.com/product.php?id=91

The algorithm is simple to see and use for generating color schema. I wanted something that I could also use for programming addressable RGB LED lights, which I use for other fun projects. One day I plan to connect the spectrogram to a string of these lights!

The web audio api does some processing by default. Earlier in the project I saw artifacts that look like reflections around 8000Hz and 16000 hz as well as interactions from things other tabs are doing. These were noise cancellation techniques that take microphone data and apply transforms meant to reduce echo and prevent the computer from transmitting its own sound to itself. The config object eliminates those artifacts but there are still 2 that appear:

The first artifact is a triple band around 10 000 hz, which shows up as three lines in an otherwise quiet spectrogram. The second is a deadband around 13 000 hz. As far as I can tell the deadband comes from the microphone itself. I don't know where the triple band comes from. 

Finally, the wakelock functions prevent the browser and screen from going to sleep even there is no user interaction. This is important because this is meant to play on a screen for a long time during an event.

--

Here are some suggestions for trying out the program as it is:

- Open Youtube and look for videos that play:
    - Bird sounds
    - Classical guitar
    - Guitar lessons 
    - Electronic music. Shout out to Miss Monique. Some of her spectrogram images are really nice with big brush-stroke like swoops.

- Go on Soundcloud and play music with vocals and notice the differences between a human voice and an instrument.  

- See/listen to the cars going past your house. Is this doppler or engine RPM?

- Turn everything off and listen to/see the noise that surrounds us.

- Compare your voice to a friend's.

- Close your eyes and dance/drum to the music. Then look at the record that shows your drum peaks. 

- Use a tone generator like: https://www.szynalski.com/tone-generator/. Be careful of high volume at higher frequencies. I literally have to turn my phone's media volume and the volume of the generator right down to 1% for it to be comfortable.

Ideas for future development:

ttps://jameskdouglas.github.io/frequenSee/plans.md