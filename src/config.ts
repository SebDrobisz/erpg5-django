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

export const GITHUB_EDIT_URL = `https://github.com/SebDrobisz/erpg5-django`;

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
		'1 - Introduction': [
			{ text: '1.1 - Introduction', link: 'erpg5-django/fr/django/introduction' },
			{ text: '1.2 - Ma première vue', link: 'erpg5-django/fr/django/first-view' },
			{ text: '1.3 - Mon premier modèle', link: 'erpg5-django/fr/django/first-model' },
			{ text: '1.4 - Vues et gabarits - introduction', link: 'erpg5-django/fr/django/view-templates-intro' },
		],
		'2 - Vues et gabarits': [
			{ text: '2.1 - Héritage de gabarit', link: 'erpg5-django/fr/django/template-inheritance' },
			{ text: '2.2 - Formulaire', link: 'erpg5-django/fr/django/forms' },
			{ text: '2.3 - Vues génériques', link: 'erpg5-django/fr/django/generic-views' },
			{ text: '2.4 - Incrustation de gabarit', link: 'erpg5-django/fr/django/template-include' },
		],
		'3 - Concepts divers': [
			{ text: '3.1 - Les tests', link: 'erpg5-django/fr/django/tests' },
			{ text: '3.2 - PostgreSQL', link: 'erpg5-django/fr/django/postgresql' },
			{ text: '3.3 - Amélioration des pages développeurs', link: 'erpg5-django/fr/django/developer-improvement' },
			{ text: '3.4 - Gestion des tâches', link: 'erpg5-django/fr/django/tasks-management' },
			{ text: '3.5 - Gestion des onglets actifs', link: 'erpg5-django/fr/django/tab-management'},
		],
		'4 - Gestion des utilisateurs': [
			{ text: "4.1 - Page d'administration", link: 'erpg5-django/fr/django/admin-page'},
			{ text: "4.2 - Gestion des utilisateurs", link: 'erpg5-django/fr/django/user-management'},
			{ text: "4.3 - Authentification", link: 'erpg5-django/fr/django/authentification'},
			{ text: "4.4 - Sécurité", link: 'erpg5-django/fr/django/security'},
		],
	},
};
