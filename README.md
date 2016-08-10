# Vocalizer
### A super simple javascript plugin to show people how to say your name correctly.

**Here's how to get it working:**

1. Download and and include `vocalizer.min.js` and `vocalizer.min.css` into your website. Include `vocalizer.min.js` right before the closing `</body>` tag.
2. Wrap your first name in a `span` tag like this: `<span class="vocalizer" data-source="auto">YOUR NAME</span>`.
3. That's it!

The `data-source` attribute has two parameter options:
- `auto` : The audio will automatically be generated. Note: If this doesn't work, it might mean your name doesn't exist in the database. Go [here](https://www.nameshouts.com/) to double-check.
- `path/to/file` : Manually set the path to your own audio file. For example: `<span class="vocalizer" data-source="audio/name.mp3">`.

Preset audio recordings are provided by the [Nameshouts API](https://www.nameshouts.com/).

![vocalizer](http://atifaz.am/images/posts/vocalizer-show-people-how-to-pronounce-your-name/vocalizer.jpg?423)
