# tumblr

## Lazy Loading Update

I found that loading three images at a time was pretty performant, with three being the most that might display on a mobile width. Using this number as a maximum placement value, I just leveraged the scroll distance math to both update the infinite scroll and trigger the updateImageView method.

The updateImageView method will gather the next three image URL's from the preloadList array and push them into the master list, which then updates the view. I then shift those entries off of the preloadList array.

Once the preload list gets too low and/or the scroll position hits the bottom, we then fire the API call to gather more photos to refill the array.
