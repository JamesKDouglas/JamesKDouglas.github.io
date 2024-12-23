
Here are some obvious ideas for further improvement that came up. If these are accepted a bit more they should be made into github issues then eventually become part of a changelog.

1. Improve resolution by performing parallel analysis: 

The fundamental resolution limitation comes from the fact that low frequencies need a fairly long amount of time to analyse. How can we tell there is a 1Hz signal present if we don't listen for longer than a second? Getting good resolution in the frequency domain for low frequency sound means that higher frequency areas are more spread out in the time domain than they have to be. We don't need high resolution in the frequency domain for high frequency sounds, in fact with a logarithmic display we throw most of the high frequency data out and never show it.

So an ideal spectrogram actually varies its resolution in the time and frequency domain across the width of the screen. Spectroid does this and it looks great.

FrequenSee could do that by just making multiple spectrograms in parallel then sewing together properly.

That is, split the incoming signal into about 4 parallel streams. Each stream has a different number of bins, from a large nunber to a small number. Perform fft analysis on each of them separately using different fftSizes (which is both the number of bins and the number of samples collected for fft analysis).

Then combine the produced arrays, which list frequency and intensity, into one array. That is, take roughly one quarter of the list from each analysis. This would allow some frequencies to be analysed more slowly than others. Frequency areas that are produced slowly should just repeat as they are attached to the data produced more quickly. 

2. Show axis labels. 

Right now I just use a tone generator to examine the axis so I do have an idea of where the frequencies are but it's not that convenient.

The vertical shows time but the sweep means it isn't a normal axis. Just give an indication of how long a whole screen sweep takes. 

For the horizontal axis maybe a cursor or recent maximum peak frequencies? To minimize the use of screen space I would like to try using mouse gestures for control - to turn on and off the axis. Scroll up to turn on the axis and down to turn them off?

For additional output information, like the number of seconds a sweep takes, put overlays on the right side. The high frequency areas are often quiet so there is more useable space there.

3. Better color.

On my phone the color is flat. I have no idea why the color isn't the same as on a regular screen but it obviously lacks the bright highlights.

4. Capture and share.

This is a big topic but basically the idea is to add utility by allowing people to capture samples. That could be front end only like: holding down a button, will capture sound an the image being drawn, then upon release The image and sound get saved in a zip on your computer. Or, imagine being able to draw a box around a piece of the spectrogram and having that saved. The browser will have to ask permission to write to the file system.

Or, it could involve more of a back end to make a web 2 app. That means login and user agreements. But it also means data sharing, database building and machine learning. People could share their sounds and spectrograms with each other much more easily, and the data could be in a searchable collection of sounds. 


