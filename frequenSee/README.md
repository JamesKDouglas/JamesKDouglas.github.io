# frequenSee Spectrogram 
#### Video Demo:  
### Live Demo https://jameskdouglas.github.io/frequenSee/
#### Description:

This is a music visualization that creates a spectrogram of microphone data (a sonogram). It is the final project for CS50, a computer science course from Harvard. 

This program makes most laptops into high resolution spectrograph machines. In particular, it was made to broadcast to a 4K screen.

To make it, I learned about streaming audio using the Web Audio API and drawing images in a browser. Achieving a high quality spectrogram meant learning more about resolution mapping and learning more about fast fourier transforms.

The program takes the sound from your microphone and uses the Web Audio API built into most browsers to perform a mathematical operation called a Fast Fourier Transform. This wizardry makes a list of all the frequencies that you hear and how loud they are. That's what you see on the screen when the app is running. 

Inspiration comes from the Spectroid app, which works well on my old Android phone but can only run on Android devices and no~t older ones. 

The goal was to create something that doesn't need to be installed or signed up for. Just use the URL. 
~
I would like this project to be useful to others in their code journey, which means that it is important to keep it simple. It is meant for display at a party so one of the main specifications is, "no mucking around necessary".

HOW TO USE:
- Go to the URL: https://jameskdouglas.github.io/groundUp/
- If you change the screen size then refresh your browser to correct the dimensions.

Download the code from the github repository and change it if you want to. Use the terminal command "http-server" to serve it to a browser locally.

The simplity is inspired by a Supreme Court Justice Oliver Holmes,

"“For the simplicity on this side of complexity, I wouldn't give you a fig. But for the simplicity on the other side of complexity, for that I would give you anything I have.”"

This is a good blog post about it,
https://www.jonkolko.com/writing/notes/simplicity-on-the-other-side-of-complexity

The computers we use now can do amazing things with only a few lines of code. Creating a spectrogram like this used to take expensive instruments. Not anymore.

--

The files are:
- style.css. This helps with layout and most importantly resizing the spectrogram. With only a few lines of CSS the resizing of the spectrogram works much better than doing the same task using Javascript. Part of this code is from the 100Devs freelance agency, which I am part of and is based in San Francisco.

- index.html. This is the one and only html file. It holds the canvas tag where the image goes as well as sewing together the css and javascript.

- spectrogram.js. This is the heart of the program. It retrieves data from the Web Audio API, requests a transform of the data and creates the images that are sent to the canvas tag in the html file. It runs only on the client. That is all that is necessary and ensures privacy.

To expand on spectrogram.js:

The program works by creating a virtual image then replacing the displayed image with the virtual one. Each audio sample is analyzed to generate a spectra of frequencies present, and that spectra becomes a line in the image. This line by line technique has no smoothing or downsampling in order to present the highest resolution. 

My goal here was to make the most of high resolution screens commonly available. A lot of other implementations of spectrogram creation downsample and crop the image. The fact of the matter is that most modern computers don't need to do that and can easily handle this computation. While reviewing other spectrogram programs, which often downsample, it struck me that much more is possible. Here, each frequency from the fast fourier transform is assigned to a single pixel and each spectra to only one line of pixels. Although the transform is not perfect, most 'smearing' or fuzz that you see is simply the sound itself.

The color scheme is an important part of this file. The makeRGBArr function generates an array of RGB values that navigates an RGB color cube. You can imagine it as following a line in the cube, and this tool was used to create it by visualizing the journey through the cube:

https://www.infinityinsight.com/product.php?id=91

The algorithm is simple to see and use for generating color schema. I wanted something that I could also use for programming addressable RGB LED lights, which I use for other fun projects. 

The web audio api does some processing by default. Earlier in the project I saw artifacts that look like reflections around 8000Hz and 16000 hz as well as interactions from things other tabs are doing. These were noise cancellation techniques that take microphone data and apply transforms meant to reduce echo and prevent the computer from transmitting its own sound to itself. The config object eliminates those artifacts but there are still 2 that appear. 

The first artifact is a triple band around 10 000 hz, which shows up as three lines in an otherwise quiet spectrogram. The second is a deadband around 13 000 hz. As far as I can tell the deadband comes from the microphone itself. I don't know where the triple band comes from. 

There is a color band drawn on the top of the image. I tried hard to use all the screen real estate for the visualization, but allowed this small band. It has two purposes: Display the color scheme/scale from 0 to -120 dB and to give you an indication of the cropping occurring when the window does not show the entire spectra.

Finally, the wakelock functions prevent the browser and screen from going to sleep even there is no user interaction. This is important because this is meant to play on a screen for a long time during an event.

--

Here are some suggestions for trying out the program as it is:

- Open Youtube and look for videos that play:
    - Bird sounds
    - Classical guitar
    - Guitar lessons 
    - Electronic music

- Go on Soundcloud and play music with vocals and notice the differences between a human voice and an instrument.  

- See/listen to the cars going past your house. Is this doppler or engine RPM?

- Turn everything off and listen to/see the noise that surrounds us.

- Compare your voice to a friend's.

- Close your eyes and dance/drum to the music. The look at the record that show your drum peaks. 

- Use a tone generator like: https://www.szynalski.com/tone-generator/. Be careful of high volume at higher frequencies.

--

If you want to play with the code, try running a local copy by using http-server and change the color algorithm by changing the size of the for loops or the step size.
