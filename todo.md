TODO: 
    - add option to reset the latest row 
    - add transition when opening help component
    - change fonts
    - add tips for valid words (most frequent letter, most common position of yellow letter etc)
    - window size should have a minimum width
    - create animation upon submitting word
    - fix help display for mobile devices

BUGS: 
    - Uncaught TypeError: Cannot read properties of null (reading 'classList') (happens sometimes when pressing enter when whole row is not filled (might be wrong, investigate further))
    - pressing enter too fast might not update the color in time (which reads a wrong color)
    - if error box is triggered too quickly in succession, it behaves weirdly

NOTES: 
    - inspector tools can be used to inspect CSS layouts (https://firefox-source-docs.mozilla.org/devtools-user/page_inspector/how_to/examine_grid_layouts/index.html)
    - for design inspiration: see real wordle as well as ordel (and football games)