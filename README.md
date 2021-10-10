# Ketikin

Ketikin is a lightweight Javascript library to help you create a typewriter animation, it's inspired by <a target="_blank" href="https://github.com/alexmacarthur/typeit">TypeIt</a> which has already been there prior to this. It's sort of a reinventing the wheel thing but you can get a more compact and a way smaller library size. 🤝 


## Usage
1. Make sure you have imported ketikin library into your HTML page
```html
<script defer src="https://fachr.in/static/js/ketikin.min.js"></script>
```
2. Create a HTML tag which contains a certain text
```html
<p>Hey, it's written by Ketikin 👋</p>
```
3. Trigger animation using ketikin function
```html
<script>
    // ketikin(selector, options)
  
    ketikin("p", {
        speed: 70,
        loop: true
    })
</script>
```
4. Or, alternatively you can also override your own text
```html
<script>
    ketikin("p", {
        texts: ["Hey, it's written by Ketikin 👋", "It's an awesomeness! 😍"],
        speed: 70,
        loop: true
    })
</script>
```
5. Done 🥳🐛

## Demo
#### Visit <a target="_blank" href="https://fachr.in">my website</a> for a smoother demo. The GIF frame rate below is dropped.
![ketikin](https://user-images.githubusercontent.com/14908455/136647330-2c36de7d-cdc4-4abd-bb42-5ae418d58adf.gif)
