import { defineConfig, presetUno, presetIcons } from 'unocss'

export default defineConfig({
	// ...UnoCSS options
	presets: [
		presetUno(),
		presetIcons({
			extraProperties: {
				'display': 'inline-block',
				'vertical-align': 'middle'
			}
		})
	]
})
