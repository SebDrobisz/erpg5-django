---
title: PostgreSQL
description: 
layout: ../../../layouts/MainLayout.astro
---

Et si nous changions le SGBD afin d'utiliser PostgreSQL ? 

## Installation

1. Installer [PostgreSQL](https://www.postgresql.org/)
2. Créer une DB (par exemple `mproject`) : `CREATE DATABASE mproject;`
3. Créer un rôle (dans `psql`): `create role <le rôle> login password '<le mdp>';`
4. Donner les droits nécessaires à ce nouveau rôle (dans `psql`) : `grant all privileges on database mproject to <le rôle>;`
5. Installer `psycopg2`: `python -m pip install django psycopg2`.
6. Configurer l'utilisation de la base de données dans `settings.py`

   <div class="path">mproject/settings.py</div>

``` python
- 'default': {
-     'ENGINE': 'django.db.backends.sqlite3',
-     'NAME': BASE_DIR / 'db.sqlite3',
- },
+ #'default': {
+ #    'ENGINE': 'django.db.backends.sqlite3',
+ #    'NAME': BASE_DIR / 'db.sqlite3',
+ #},
+ 'default': {
+     'ENGINE': 'django.db.backends.postgresql_psycopg2',
+     'NAME': 'mproject',
+     'USER': '<le rôle>',
+     'PASSWORD': '<le mdp>',
+     'HOST': 'localhost',
+     'PORT': '',
+ }
```

Pour éviter la manipulation de [schéma](https://docs.postgresql.fr/10/ddl-schemas.html), nous vous suggérons de définir
votre rôle comme propriétaire de la base de donnée `mproject`.

`alter database mproject owner to <role>;`

Et voilà, tout est fait !

Enfin, n'oubliez pas de migrer 😉. (✏️ Quelle commande allez-vous utiliser pour réaliser la migration ?)

## Migrations

Lorsque nous sommes au début du développement d'un logiciel, nous pouvons échapper aux problèmes liés aux migrations. Nous allons cependant voir le minimum afin de gérer les quelques conflits que nous pourrions rencontrer. Si la gestion des migrations vous intéresse, vous trouverez de quoi satisfaire votre curiosité [ici](https://docs.djangoproject.com/fr/4.1/topics/migrations/).

Imaginons que nous souhaitons ajouter un nouveau champ `username` à notre modèle `Developer`.

<div class="path">developer/models.py</div>

```python
  class Developer(models.Model):
      first_name = models.CharField("first name", max_length=200)
      last_name = models.CharField(max_length=200)
+     user_name = models.CharField(max_length=50)

      #...
```

Saisissez la commande `python manage.py makemigrations` qui va vérifier les changements et générer un nouveau fichier permettant la migration.

Vous devriez avoir ce message : 
```
You are trying to add a non-nullable field 'user_name' to developer without a default; we can't do that (the database needs something to populate existing rows).
Please select a fix:
 1) Provide a one-off default now (will be set on all existing rows with a null value for this column)
 2) Quit, and let me add a default in models.py
Select an option: 
```

La raison est simple. Des données sont potentiellement présentes dans la base de données et nous ne pouvons pas supposer qu'il n'y en a pas (imaginez s'il y a plusieurs instances du site). Django vous demande donc ce que vous voulez faire pour le champ `username` puisque celui-ci s'ajoute aux enregistrements présents et que celui-ci est obligatoire.

La procédure que nous allons vous soumettre est un peu radicale, mais nous sommes aux prémices du développement de notre projet. C'est donc satisfaisant comme cela !

1. Réinitialiser la base de données.
   * Si vous utilisez toujours SQLite, alors supprimez le fichier `db.sqlite3` (ou mieux, faite la configuration nécessaire à l'utilisation de PostgreSQL).
   * Si vous utilisez PostgreSQL comme demandé, nous allons plutôt défaire toutes les migrations réalisées. Lancez la commande : `$ python manage.py migrate developer zero`.

1. Supprimez les fichiers présents dans le dossier `migrations`. Ceux-ci ont généralement la forme : `0001_...`

1. Relancez la procédure complète de migration
   1. `python manage.py makemigrations`
   1. `python manage.py migrate`

Pour vous entraîner, supprimez le champ `user_name` que vous venez de créer, cela va nous gêner par la suite et cela vous permet de vous entraîner avec la procédure ! ⭐️

> 📃 Il est également possible de supprimer la base de donnée et d'en créer une nouvelle. Si vous faites cela, pensez à supprimer les fichiers de migration ! (⚠️ À ne pas faire en production.)
