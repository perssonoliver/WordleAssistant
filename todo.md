TODO: 
    - add option to reset the latest row 
    - add transition when opening help component
    - change fonts
    - add tips for valid words (most frequent letter, most common position of yellow letter etc)
    - make website adaptable for mobile devices
    - window size should have a minimum width

BUGS: 
    - Uncaught TypeError: Cannot read properties of null (reading 'classList') (happens sometimes when pressing enter when whole row is not filled (might be wrong, investigate further))
    - minimizing window sometimes make background grey color when scrolling
    - after submitting a word, key listener does no longer respond until pressing the window again

NOTES: 
    - inspector tools can be used to inspect CSS layouts (https://firefox-source-docs.mozilla.org/devtools-user/page_inspector/how_to/examine_grid_layouts/index.html)