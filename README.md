This project has been archived as I have no plans to make any changes to this in the future. This tool is provided as-is and is probably out of date. Other developers are perfectly welcome to fork this repository and keep it up to date if they wish.

# DungeonQuestCalc
Calculates statistics for in-game items.

#Disclaimer:
I realise the project wasn't built with other developers in mind.
It was initially just thrown together to allow other players of the game to enjoy.
You're welcome to set up gulp tasks to do the building for you if you decide to pick this up.

#Notes
This project is designed with page load times in mind and tries to follow the principals of Google AMP (https://developers.google.com/amp/).
Please keep this in mind with the huge size of the .html file (which embeds the scripts at the bottom of the page and styles at the top of the page to reduce the number of requests)

#Building Steps
1) Minify the javascript files into 1 single file
2) Replace the scripts at the bottom of the page with the contents of the minified scripts
3) Minify the styles into 1 single file
4) Replace the styles at the top of the page with the contents of the minified styles
5) Minify the .html.
6) When deploying, rename the .min.html file to .html and use that for the entire page. You shouldn't need to deploy any additional scripts or styles unless they're hosted externally.
