---
title: Django - Introduction
description: Docs intro
layout: ../../../layouts/MainLayout.astro
---

## Objectifs et sources

Les objectifs de ces premiers laboratoires sont multiples.

* Apprendre les fondements de Python :
  * Différentes structures élémentaires ;
  * Les classes ;
  * Les modules...
* Découvrir un framework web Python qui partage de nombreuses similitudes avec la suite logiciel Odoo dont vous apprendrez à créer une application.

Ce cours est basé sur les sources suivantes : 
 * Le [tutoriel Django](https://docs.djangoproject.com/fr/3.1/intro/tutorial01/)
 * La [documentation Django](https://docs.djangoproject.com/en/3.1/)
 * [Django for professionals](https://djangoforprofessionals.com/)

## Installation

Pour procéder à l'installation, nous vous conseillons

 * d'installer `python 3.10+` ;
 * de vérifier quel alias pointe vers cette version : `python -V`  ou `python3 -V` 
 * installer `pip` qui est un gestionnaire de package pour `python` ;
 * et d'ensuite lancer l'installation de Django avec la commande `python -m pip install Django`.

> ### Mise en pratique au local 601
>
> Une version de python est installée sur chacune des machines. Il faut cependant installer pour votre utilisateur courant le module Django. Il vous suffit d'utiliser la commande d'installation suivante qui spécifie que le module doit être installé dans votre répertoire utilisateur : 
>
> ```
> $ python -m pip install Django --user
> ```

**Optionnellement**, vous pouvez jeter un oeil à [venv](https://docs.python.org/3/tutorial/venv.html) ; ou encore à [Docker](https://www.docker.com/).

## Légende

Il s'agit d'un cours avant tout, parfois vous verrez différents emoji. Ceux-ci permettent d’attirer votre attention de différentes manières.

|Emoji|Signification|
|---|---|
| 🐍 | Parenthèse Python |
| ☕️ | Lien Java |
| ⭐️ | Il s'agit d'un petit exercice |
| 🐇 | Faites ce qui est dit et admirer l'erreur |
| 👈 new | Indique l'ajout d'un morceau de code|
| ⚠️ | Source d'erreur |
| 📖 | Lecture supplémentaire optionnelle, mais vivement recommandé |
| 📃 | Note un peu plus personnelle |
| 💩 | Élément à ne pas reproduire |

## Conventions

1. Tous les chemins d'accès seront donnés relativement au répertoire racine du projet.

## Introduction

Dans ce cours, vous allez apprendre à créer un site web permettant de gérer les tâches de différents développeurs.

La première chose à faire est de créer un projet Django.

``` bash
$ django-admin startproject mproject
```

> 📃 Sur les ordinateurs de l'_esi_, utilisez la commande `python -m django startproject mproject`.

Cette commande a créé un répertoire dans votre répertoire courant. Dans ce dossier, se trouve les fichiers suivants :

``` bash
mproject/
    manage.py
    mproject/
        __init__.py
        settings.py
        urls.py
        asgi.py
        wsgi.py
```

Voici quelques explications :

* Le premier répertoire racine `mproject/` est un contenant pour votre projet. Son nom n’a pas d’importance pour Django ; vous pouvez le renommer comme vous voulez.
* **`manage.py`** : un utilitaire en ligne de commande qui vous permet d’interagir avec ce projet Django de différentes façons. Vous trouverez toutes les informations nécessaires sur `manage.py` dans django-admin et `manage.py`.
* **Le sous-répertoire `mproject/`** correspond au paquet Python effectif de votre projet. C’est le nom du paquet Python que vous devrez utiliser pour importer ce qu’il contient (par ex. : `mproject.urls`).
* **mproject/\_\_init\_\_.py** : un fichier vide qui indique à Python que ce répertoire doit être considéré comme un paquet. Si vous êtes débutant en Python, lisez les informations sur les paquets (en) dans la documentation officielle de Python.
* **mproject/settings.py** : réglages et configuration de ce projet Django. Ce cours de Django vous apprendra tout sur le fonctionnement des réglages (enfin presque tout).
* **mproject/urls.py** : les déclarations des URL de ce projet Django, une sorte de « table des matières » de votre site Django. Vous pouvez en lire plus sur les URL dans Distribution des URL.
* **mproject/asgi.py** : un point d’entrée pour les serveurs Web compatibles aSGI pour déployer votre projet. Voir [Comment déployer avec ASGI pour plus de détails](https://docs.djangoproject.com/fr/3.1/howto/deployment/asgi/).
* **mproject/wsgi.py** : un point d’entrée pour les serveurs Web compatibles WSGI pour déployer votre projet. Voir [Comment déployer avec WSGI pour plus de détails](https://docs.djangoproject.com/fr/3.1/howto/deployment/wsgi/).

#### Outils de développement

Vous êtes libre d'utiliser l'outil que vous préférez pour vos développements.  Sur les ordinateurs de l'_esi_, nous mettons PyCharm à votre disposition.

Un des intérêts de cet outil est la gestion native des environnements virtuels : [venv](https://docs.python.org/3/tutorial/venv.html).

### Serveur **de développement**

Django est fourni avec un serveur de développement qui permet de simplifier le développement avant la mise en production. Parmi ces simplifications, on peut noter que le serveur sert les fichiers statiques.

Vous pouvez le tester en lançant la commande

``` bash
$ python manage.py runserver
```

Vous devriez alors voir le message suivant :

```
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).

You have 18 unapplied migration(s). Your project may not work properly until you apply the migrations for app(s): admin, auth, contenttypes, sessions.
Run 'python manage.py migrate' to apply them.
October 02, 2022 - 10:55:24
Django version 4.1.1, using settings 'mproject.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

**Note :** Vous pouvez ignorer les avertissements liés à la migration de la base de donnée.

Maintenant que le serveur tourne, allez à l’adresse http://127.0.0.1:8000 avec votre navigateur Web. Vous verrez une page avec le message « Félicitations ! » ainsi qu’une fusée qui décolle. Ça marche !

#### Recharge automatique du serveur

Le serveur de développement recharge automatiquement le code Python lors de chaque requête si nécessaire. Vous ne devez pas redémarrer le serveur pour que les changements de code soient pris en compte. Cependant, certaines actions comme l’ajout de fichiers ne provoquent pas de redémarrage, il est donc nécessaire de redémarrer manuellement le serveur dans ces cas.
