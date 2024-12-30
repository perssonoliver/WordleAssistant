TODO: 
    - add option to reset the latest row 
    - add transition when opening help component
    - change fonts
    - add tips for valid words (most frequent letter, most common position of yellow letter etc)
    - make website adaptable for mobile devices
    - window size should have a minimum width
    - add grid-column: 1 / 3 to the top-menu instead of having an extra div for the menu border

BUGS: 
    - Uncaught TypeError: Cannot read properties of null (reading 'classList') (happens sometimes when pressing enter when whole row is not filled (might be wrong, investigate further))
    - exiting the help screen does not refocus the current box (maybe put a listener on the whole body to read a key instead of having listeners on each tile? would also remove focus issues)
    - minimizing window sometimes make background grey color when scrolling