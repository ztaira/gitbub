# gitbub
Hack-A-Week 15: Fun Github visualization using d3

### Usage:
- Visit https://ztaira14.github.io/gitbub/ for hosted version
- Open gitbub.html in the browser of your choice for local version
- Optionally replace "ztaira14" in the gitbub.js file with your Github username
to see the language spread and relative sizes of your repositories

### Features:
- Fun to play with
- Cool way to break down what I've been doing recently
- Disappearing tooltip for unobtrusive access to information

### What it does:
- Gets my Github info via https://api.github.com/users/ztaira14/repos
- Uses d3 to create a force diagram of this info based on the size and language
of each repository
- Repositions and shows/hides the tooltip upon mouseenter/mouseleave events
- Enables fun way to visualize and link to each repository

### What it doesn't do:
- View private repositories
- Filter out repositories that I've forked

### Included Files:
```
- README.md..................This readme file
- d3.min.js..................d3, a cool visualization library
- gitbub.html................HTML/CSS file
- gitbub.js..................JS file, linked to by gitbub.html
- diagrams/..................Images of final result
```

### Example Output:
![alt text][outputimage]
[outputimage]: https://github.com/ztaira14/gitbub/blob/master/diagrams/gitbub.png "Repositories as of 2-1-2017"
