for the 3 minute video

Project’s title: frequenSee
Name: James Douglas
GitHub username: JamesKDouglas
edX username: jamesthedev100
City and country; Vancouver, Canada
Date of recording: December 23, 2024

  - Introduction 
    - (me) Name, city, scientist who likes to make instruments and light visualizations that go with music. cs50. Art projects at bass coast and shambhala this summer.
  - Cut to screen capture.
    - show the spectrogram and describe it.
        - Each line on the screen is a piece of data captured (about 8000 samples of audio data). The dasta coming in is at 44 000 hz, so this takes a short while to collect.
        - That data is analyzed to generate a list of frequencies present. The list is made of "bins" that represent a small range of frequencies. My goal is to display on a 4K screen so I want about 4000 bins. Each frequency "bin" has an amplitude, which becomes a color on the screen. So it's just analyzing and analyzing, doing the same math over and over again on the incoming sound, then displaying what frequencies are present.
        - This is called a spectrogram.
        - Demo some sounds.
            - mimo swoop
            - Bird chirps
            - aphex twin spiral
        - Note ultrasonic range.
        - Note artifacts - deadband.
  - Goal was to 
    - Make something high resolution. Looking around at existing projects, a lot of them crop and downsample more than I would like. 
        - Discuss tools used to inspect the resolution "pipe": color picker, tone genrator, loupe and aphex spiral. 
        - Explain tradeoff - more frequency bins means more samples, which means lower time domain resolution.
    - Make something easy to use. People are tired of logging in. 
        - There is some management required 
            - inputs and outputs selection. 
            - Window resizing. I played around with dynamic resizing but prefer it to be more stable.
 - Thank GPT, Richard, Mom, Dad, Duck and Spectroid. Order?
