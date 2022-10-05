---
title: Héritage de gabarit
description: Docs intro
layout: ../../../layouts/MainLayout.astro
---

On vous a annoncé plus tôt que DRY est la devise de Django. Pourtant, si l'on regarde les gabarits, nous pouvons voir énormément de redondance. Nous allons améliorer cela et mettre un peu de style dans notre site.

## Gabarit du projet

La première chose que nous allons faire, est de définir un gabarit de base pour le projet.

Pour cela, nous devons d'abord modifier le fichier `settings.py`

Ajoutez le code suivant :

<div class="path">mproject/settings.py</div>

``` python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'], 👈new
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```

Ce bout de code permet d'ajouter une liste de chemins dans lequel Django peut trouver un gabarit. Le chemin que l'on définit ici est un dossier qui se nomme `templates` et qui se trouve directement à la racine du projet. Créez ce dossier et ajoutez un fichier nommé `_base.html`.


📃 Le nom de ce fichier est totalement arbitraire, toutefois, nous précédons le nom par un underscore puisque ce fichier est destiné à être étendu. La communauté de Django vous remerciera de respecter cette convention.

📃 Petit rappel, `BASE_DIR / 'templates'` désigne la concaténation d'un chemin (`BASE_DIR`) qui est défini dans le fichier `settings.py` avec `templates`.

## Gabarit de base

Dans le fichier `_base.html`, placez-y le code suivant

<div class="path">templates/_base.html</div>

``` html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>{% block title %}MProject{% endblock title %}</title>
</head>
<body>
    <h1>MProject</h1>
    <h2>Un site web de gestion de tâches</h2>

    {% block content %}
    {% endblock content %}
</body>
</html>
```

Les balises `{% block %}` permettent de définir des blocs qui peuvent être surchargés par les gabarits enfants.

📃 Notez qu'il n'est pas obligatoire de nommer le bloc fermé (`{% endblock content %`), mais nous préférons par soucis de lisibilité.

## Héritage du gabarit de base

Modifier maintenant le code du gabarit `detail.html`

<div class="path">developer/detail.html</div>

``` html
{% extends "_base.html" %}
{% block title %} Détail - {{ developer.first_name }} {{ developer.last_name }} {% endblock title %}
{% block content %}
    <p><Strong>Prénom : {{ developer.first_name }}</Strong></p>
    <p><Strong>Nom de famille : {{ developer.last_name }}</Strong></p>
{% endblock content %}
```

Ainsi que le fichier `index.html`

> `developer/index.html`
>
> ``` html
> {% extends "_base.html" %}
> 
> {% block title %} Liste des dévelopeurs {% endblock title %}
> 
> {% block content %}
>  {% if developers %}
>  <ul>
>      {% for dev in developers %}
>      {#<li>{{ dev.first_name }}</li>#}
>      <li><a href="{% url 'developer:detail' dev.id %}"> {{ dev.first_name }}</a></li>
>      {% endfor %}
>  </ul>
>  {% else %}
>      <p><strong>Il n'y a aucune dévelopeur enregistré !</strong></p>
>  {% endif %}
> {% endblock content %}
> ```

Les gabarits ont été modifiés afin que les morceaux de code soient placés correctement au sein des blocs `title` et `content` défini dans le gabarit de base. Nous avons ajouté la balise `{% extends '_base.html' %}` dans les gabarits `detail.html`et `index.html` afin qu'ils héritent du gabarit de base.

Vérifiez que votre site fonctionne toujours aussi bien qu'avant. ⭐️

Pour plus d'information sur les balises, lisez cette [page](https://docs.djangoproject.com/fr/3.1/ref/templates/builtins/).

## Un peu de style avec Bootstrap5 et Font-Awesome

Maintenant que nous avons un gabarit de base, nous allons lui ajouter un peu de style.

Dans la balise `<head>` du fichier `_base.html`, nous ajoutons les liens vers un CDN pour le CSS Bootstrap5 ainsi que vers Foot-Awesome`pour agrémenter notre projet de quelques logos.

<div class="path">templates/_base.html</div>

``` html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
```

À la fin de la balise `<body>`, le CDN "bundle" pour boostrap.

<div class="path">templates/_base.html</div>

``` html
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
</body>
```

Ajoutons un peu de forme pour l'entête du site

<div class="path">templates/_base.html</div>

```html
<div class="p-3 bg-primary">
    <h1 class="display-1">MProject</h1>
    <h2>Un site web de gestion de tâches</h2>
</div>
```

et ajoutons un menu

<div class="path">templates/_base.html</div>

``` html
<nav class="navbar navbar-expand-sm bg-primary navbar-dark border-top border-white">
    <ul class="navbar-nav">
        <li id="nav-home" class="nav-item">
            <a class="nav-link" href="#"><i class="fa fa-home"></i></a>
        </li>
        <li id="nav-dev" class="nav-item active">
            <a class="nav-link" href="{% url 'developer:index' %}">Developers</a>
        </li>
        <li id="nav-task" class="nav-item">
            <a class="nav-link" href="#">Tasks</a>
        </li>
    </ul>
</nav>
```

Nous n'avons pas ajouté de fonctionnalité, mais notre site est maintenant un peu plus habillé. Passez de la vue `detail` à la vue `index` et profiter du site mis en style.

> Question ⭐️
> 
> Quel bout de code permet de revenir à la liste des développeurs lorsque je clique sur le menu `Developers` ?
