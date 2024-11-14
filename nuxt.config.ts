// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'@unocss/nuxt',
		'@nuxt/content',
		'@nuxt/eslint',
		'@element-plus/nuxt',
		'@nuxtjs/color-mode'
	],
	devtools: { enabled: true },
	app: {
		head: {
			link: [
				{ rel: 'stylesheet', href: '/stylesheets/scrollbar.css' },
				{ rel: 'stylesheet', href: '/stylesheets/normalize.css' },
				{ rel: 'stylesheet', href: '/stylesheets/index.css' }
			]
		}
	},
	colorMode: {
		classSuffix: '',
		classPrefix: '',
		fallback: 'dark',
		preference: 'dark'
	},
	content: {
		highlight: {
			theme: 'github-dark'
		}
	},
	mdc: {
		highlight: {
			langs: ['c#', 'typescript', 'vue']
		}
	},
	compatibilityDate: '2024-04-03',
	vite: {
		css: { preprocessorOptions: { scss: { additionalData: `@use "styles/override.scss";` } } }
	},
	elementPlus: {
		themes: ['dark'],
		defaultLocale: 'zh-cn',
		importStyle: 'scss'
	},
	eslint: {
		config: {
			stylistic: {
				indent: 'tab',
				commaDangle: 'never',
				quotes: 'single',
				semi: false,
				quoteProps: 'consistent'
			}
		}
	}
})
