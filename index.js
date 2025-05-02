// index.js
const plugin = require('tailwindcss/plugin')
const text = require('./lib/text')
const spacing = require('./lib/spacing')
const defaultOptions = {
  prefix: 'fl-',
  baseKey: 'base'
}

module.exports = plugin.withOptions(function (options) {
  options = { ...defaultOptions, ...options }

  return function ({ addBase, addUtilities, theme }) {
    const { minWidth, maxWidth } = theme('utopia')

    addBase({
      ':root': {
        '--fluid-min-width': minWidth.toString(),
        '--fluid-max-width': maxWidth.toString(),
        '--fluid-screen': '100vw',
        '--fluid-bp': `calc(
          (var(--fluid-screen) - var(--fluid-min-width) / 16 * 1rem) /
          (var(--fluid-max-width) - var(--fluid-min-width))
        )`,

        ...text.customProperties(theme, options),

      },

      [`@media (min-width: ${maxWidth}px)`]: {
        ':root': {
          '--fluid-screen': `calc(${maxWidth} * 1px)`
        }
      }
    })
    
    // Create custom font size utilities
    const { fontSize } = theme('utopia')
    const names = Object.keys(fontSize)
    const textUtilities = Object.fromEntries(
      names.map(name => {

        const lineHeightConfigValue = theme('utopia.fontSize')[name]
        
        return [
          `.text-${options.prefix}${name}`, 
          {
            'font-size': `var(--f-${name})`,
            'line-height': lineHeightConfigValue
          }
        ]
      })
    )
    addUtilities(textUtilities)
  }
}, function (options) {
  options = { ...defaultOptions, ...options }
  
  const defaultTheme = {
    utopia: {
      minWidth: 320,
      minSize: 21,
      minScale: 1.2,
      maxWidth: 1140,
      maxSize: 24,
      maxScale: 1.25,
      spacing: { ...spacing.defaults },
      fontSize: { ...text.defaults }
    }
  }

  return {
    theme: {
        ...defaultTheme,
        extend: {
            // Remove fontSize from theme as we're now using addUtilities
            spacing: theme => spacing.sizes(theme, options)
        },
    }
  }
})