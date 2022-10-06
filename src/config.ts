export const SITE = {
	title: 'ERPG5 - Django',
	description: 'Your website description.',
	defaultLanguage: 'fr_BE',
};

export const OPEN_GRAPH = {
	image: {
		src: 'https://github.com/withastro/astro/blob/main/assets/social/banner.jpg?raw=true',
		alt:
			'astro logo on a starry expanse of space,' +
			' with a purple saturn-like planet floating in the right foreground',
	},
	twitter: 'astrodotbuild',
};

// This is the type of the frontmatter you put in the docs markdown files.
export type Frontmatter = {
	title: string;
	description: string;
	layout: string;
	image?: { src: string; alt: string };
	dir?: 'ltr' | 'rtl';
	ogLocale?: string;
	lang?: string;
};

export const KNOWN_LANGUAGES = {
	French: 'fr',
} as const;
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const GITHUB_EDIT_URL = `https://git.esi-bru.be/private/django-site`;

export const COMMUNITY_INVITE_URL = `https://astro.build/chat`;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
	indexName: 'XXXXXXXXXX',
	appId: 'XXXXXXXXXX',
	apiKey: 'XXXXXXXXXX',
};

export type Sidebar = Record<
	typeof KNOWN_LANGUAGE_CODES[number],
	Record<string, { text: string; link: string }[]>
>;
export const SIDEBAR: Sidebar = {
	fr: {
		'Django': [
			{ text: 'Introduction', link: 'erpg5-django/fr/django/introduction' },
			{ text: 'Ma première vue', link: 'erpg5-django/fr/django/first-view' },
			{ text: 'Mon premier modèle', link: 'erpg5-django/fr/django/first-model' },
			{ text: 'Vues et gabarits - introduction', link: 'erpg5-django/fr/django/view-templates-intro' },
			{ text: 'Héritage de gabarit', link: 'erpg5-django/fr/django/template-inheritance' },
			{ text: 'Formulaire', link: 'erpg5-django/fr/django/forms' },
			{ text: 'Vues génériques', link: 'erpg5-django/fr/django/generic-views' },
			{ text: 'Incrustation de gabarit', link: 'erpg5-django/fr/django/template-include' },
			{ text: 'Les tests', link: 'erpg5-django/fr/django/tests' },
			{ text: 'PostgreSQL', link: 'erpg5-django/fr/django/postgresql' },
			{ text: 'Amélioration des pages développeurs', link: 'erpg5-django/fr/django/developer-improvement' },
			{ text: 'Gestion des tâches', link: 'erpg5-django/fr/django/tasks-management' },
			{ text: 'Gestion des onglets actifs', link: 'erpg5-django/fr/django/tab-management'},
		],
	},
};
