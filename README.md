# liam-portfolio

My personal portfolio site. Built because I got tired of overcomplicated frameworks and wanted something that just works.

## What's this about?

I'm a CS student who likes building things that are fast and don't break. This site is basically my way of showing off what I can do without all the bloat.

- Hit `⌘K` (or `Ctrl+K`) to open the command palette - it's actually pretty useful
- Everything's responsive because mobile exists
- Dark theme because my eyes hurt from bright screens
- No frameworks because I wanted to understand what's actually happening

## File structure (because I organized it properly this time)

```
├── src/                    # All the actual code lives here
│   ├── index.html         # The main page
│   ├── styles/            # CSS stuff
│   │   ├── styles.css     # My custom styles + Tailwind
│   │   └── output.css     # What Tailwind spits out
│   ├── js/                # JavaScript files
│   │   └── index.js       # All the interactive stuff
│   └── components/        # For when I eventually make reusable stuff
├── assets/                # Images, icons, etc.
│   ├── images/           # Pictures
│   └── icons/            # Little graphics
├── dist/                 # Built files (don't edit these)
├── build.js              # Simple script to copy files around
├── tailwind.config.js    # Tailwind settings
├── package.json          # Dependencies and scripts
└── README.md             # This thing you're reading
```

## Getting it running

You'll need Node.js (I'm using v18 but anything recent should work).

```bash
# Install the dependencies
npm install

# Start developing (watches CSS changes)
npm run dev

# Build everything for production
npm run build

# Serve the built site locally
npm run serve
```

That's it. The scripts are pretty self-explanatory.

## Making changes

Want to customize it? Here's where stuff lives:

- **Colors/theme**: Check `tailwind.config.js` - I added some custom colors that look nice
- **Styles**: `src/styles/styles.css` has my custom CSS
- **JavaScript**: `src/js/index.js` has all the interactive stuff
- **Components**: `src/components/` is empty but ready for when I need it

## Deploying

1. Run `npm run build`
2. Upload everything in the `dist/` folder to your server
3. Make sure your server serves `index.html` for all routes

## About me

I'm Liam, a CS student at USF who likes building things that work well and don't break. This site is basically my way of showing that you don't need a million dependencies to make something cool.

---

Built with HTML, Tailwind CSS, and vanilla JavaScript (and probably too much coffee).
