# Vocalizer
### A super simple javascript plugin to help others say your name correctly.

**Here's how to get it working:**

1. Download and include `vocalizer.min.js` and `vocalizer.min.css` into your website. Include `vocalizer.min.js` right before the closing `</body>` tag.
2. Wrap your first name in a `span` tag like this: `<span class="vocalizer" data-source="auto">YOUR NAME</span>`.
3. That's it! You can read the backstory on this idea [here](http://atifaz.am/blog/vocalizer-help-others-pronounce-your-name-correctly.html).

The `data-source` attribute has two parameter options:
- `auto` : The audio will automatically be generated. *Note: If this doesn't work, it might mean your name doesn't exist in the database. Go [here](https://www.nameshouts.com/) and search the name to double-check. If it isn't there you'll have to use your own audio file.*
- `path/to/file` : Manually set the path to your own audio file. For example: `<span class="vocalizer" data-source="audio/name.mp3">`.

Preset audio recordings are provided by the [Nameshouts API](https://www.nameshouts.com/).

![vocalizer](http://atifaz.am/images/posts/vocalizer-show-people-how-to-pronounce-your-name/vocalizer.jpg?423)

### Questions, comments, suggestions, issues?
If so, please [file an issue](https://github.com/atifazam/vocalizer/issues).
