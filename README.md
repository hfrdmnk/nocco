# Nocco

![hugo version](https://img.shields.io/badge/Hugo-0.91-09f)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)

Based on the [Pure](https://github.com/chrishannah/Pure) theme by Chris Hannah

A minimal theme for Micro.blog.

This theme was built around a few key ideas:

- HTML should be as semantic and clear as possible.
- The page should be readable without CSS or JavaScript.
- Style should be simplistic.

There is also the desire for this theme to be a good base for other themes. Because of the semantic HTML, it should be relatively easy to modify the CSS to make the theme more personalised.

## Code Style

This project makes use of the [Prettier](https://prettier.io) code formatter. This formatting will be done automatically in a GitHub Action, but most IDEs can be configured to run this locally.

There is also a second automated step which also runs as part of a GitHub Action, and that is [Super-Linter](https://github.com/github/super-linter). This runs the code through a whole host of linters, and will report any errors. Some configurations have been changed for this project, which can be found under `.github/linters`. The main change is that this project uses tabs instead of spaces.
