// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ['@unocss/nuxt', '@nuxt/content'],
	devtools: { enabled: true },
	compatibilityDate: '2024-04-03',
	app: {
		head: {
			link: [
				{ rel: 'stylesheet', href: '/stylesheets/scrollbar.css' },
				{ rel: 'stylesheet', href: '/stylesheets/normalize.css' }
			]
		}
	},
	content: {
		highlight: {
			theme: 'github-dark'
		}
	},
	mdc: {
		highlight: {
			langs: ['c#']
		}
	}
})