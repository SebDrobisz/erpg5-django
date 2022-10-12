---
title: Ma première vue
description: Docs intro
layout: ../../../layouts/MainLayout.astro
---

## Ma première vue Django

Avant d'écrire une vue à proprement parler, nous allons la faire au sein d'une nouvelle application intitulée **developer**.

### Création de l'application `developer`

> **Quelle est la différence entre un projet et une application ?** Une application est une application Web qui fait quelque chose – par exemple un système de blog, une base de données publique ou une petite application de sondage. Un projet est un ensemble de réglages et d’applications pour un site Web particulier. Un projet peut contenir plusieurs applications. Une application peut apparaître dans plusieurs projets.

Pour créer votre application, assurez-vous d'être dans le même répertoire que `manage.py` et saisissez la commande :

``` bash 
$ python manage.py startapp developer
```

Cela va créer un répertoire `developer`, qui est structuré de la façon suivante :

``` bash
developer/
    __init__.py
    admin.py
    apps.py
    migrations/
        __init__.py
    models.py
    tests.py
    views.py
```

### Écriture d’une première vue

Écrivons la première vue. Ouvrez le fichier `developer/views.py` et placez-y le code Python suivant :

<div class="path">developer/views.py</div>

``` python
from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello, world. You're at the developers index.")
```

> *_Parenthèse python 🐍_*
> Dans cette vue, nous découvrons plusieurs éléments python.
>
> * "`from django.http import HttpResponse`" permet d'importer la classe `HttpResponse` du _module_ `django.http`.
> * "`def index(request):`" permet de définir une fonction en python. Dans le jargon Django, nous appellerons cela _une fonction de vue_.

C’est la vue Django la plus simple possible. Pour appeler cette vue, il s’agit de l’associer à une URL, et pour cela nous avons besoin d’un _URLconf_.

Pour créer un _URLconf_ dans le répertoire `developer`, créez un fichier nommé `urls.py`. Votre répertoire d’application devrait maintenant ressembler à ceci :

``` bash
developer/
    __init__.py
    admin.py
    apps.py
    migrations/
        __init__.py
    models.py
    tests.py
    urls.py
    views.py
```

Dans le fichier `developer/urls.py`, insérez le code suivant :

<div class="path">developer/urls.py</div>

``` python
from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
]
```

> *_Parenthèse python 🐍_*
>
> 1. Nous importons la fonction `path` du module `django.url`.
> 2. Nous importons les éléments de notre répertoire `views` (c'est-à-dire notre fonction vue `index` écrite précédemment).
> 3. Nous assignons à la variable `urlpatterns` une liste de chemin (ici un seul chemin). Notez qu'en Python, il est de bonne pratique de toujours terminer par une virgule, même si la liste n'est constitué que d'un seul élément.

L’étape suivante est de faire pointer la configuration d'URL racine vers le module `developer.urls`. Dans `mproject/urls.py`, ajoutez une importation `django.urls.include` et insérez un appel à `include()` dans la liste `urlpatterns`, ce qui donnera :

<div class="path">mproject/urls.py</div>

``` python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('developer/', include('developer.urls')),
    path('admin/', admin.site.urls),
]
```

L’idée derrière `include()` est de faciliter la connexion d’URL. Comme l’application de développeur possède son propre URLconf (`developer/urls.py`), ses URL peuvent être injectées sous `/developer/`, sous `/dev/` ou `sous `/content/dev/` ou tout autre chemin racine sans que cela change quoi que ce soit au fonctionnement de l’application.

Vous avez maintenant relié une vue index dans la configuration d’URL. Vérifiez qu’elle fonctionne avec la commande suivante :

``` bash
$ python manage.py runserver
```

Ouvrez http://localhost:8000/developer/ dans votre navigateur et vous devriez voir le texte « Hello, world. You’re at the developers index. » qui a été défini dans la vue index.

### Paramètres de la fonction `path`

La fonction `path()` reçoit quatre paramètres, dont deux sont obligatoires : `route` et `view`, et deux facultatifs : `kwargs` et `name`. À ce stade, il est intéressant d’examiner le rôle de chacun de ces paramètres.

#### `route`

`route` est une chaîne contenant un motif d’URL. Lorsqu’il traite une requête, Django commence par le premier motif dans `urlpatterns` puis continue de parcourir la liste en comparant l’URL reçue avec chaque motif jusqu’à ce qu’il en trouve un qui correspond.

Les motifs ne cherchent pas dans les paramètres GET et POST, ni dans le nom de domaine. Par exemple, dans une requête vers https://www.example.com/myapp/, l’URLconf va chercher `myapp/`. Dans une requête vers https://www.example.com/myapp/?page=3, l’URLconf va aussi chercher `myapp/`.

#### `view`

Lorsque Django trouve un motif correspondant, il appelle la fonction de vue spécifiée, avec un objet `HttpRequest` comme premier paramètre et toutes les valeurs « capturées » par la route sous forme de paramètres nommés. Nous montrerons cela par un exemple un peu plus loin.

#### `kwargs`

Des paramètres nommés arbitraires peuvent être transmis dans un _dictionnaire_ vers la vue cible.

> **Parenthèse Python 🐍**
> 
> Un dictionnaire est une structure de donnée élémentaire de Python. Elle fonctionne sur le principe de clé-valeur. Nous y reviendrons !

#### `name`

Le nommage des URL permet de les référencer de manière non ambiguë depuis d’autres portions de code Django, **en particulier depuis les gabarits**. Cette fonctionnalité puissante permet d’effectuer des changements globaux dans les modèles d’URL de votre projet en ne modifiant qu’un seul fichier.

