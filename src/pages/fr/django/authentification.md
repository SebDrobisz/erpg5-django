---
title: Authentification
description: 
layout: ../../../layouts/MainLayout.astro
---

Maintenant que nous avons la capacité de créer des utilisateurs. Nous allons limiter l'accès au site aux utilisateurs connectés et limiter l'accès à certaines fonctionnalités aux utilisateurs qui en ont le droit.

Voici donc la suite du programme :

1. Nous allons ajouter une page d'accueil qui va afficher les tâches de l'utilisateur connecté et permettre à l'utilisateur de se connecter s'il ne l'est pas.
2. Nous allons empêcher l'accès aux vues d'index des applications `developer` et `task` aux utilisateurs non connecté.
3. Nous allons ajouter des permissions au niveau de la gestion des tâches afin que certains utilisateurs ne puissent voir que celles qui sont attribuées à travers la description des développeurs, mais pas au travers de la liste des tâches.

## Une app pour les gouverner toutes

Pour le moment, `localhost:8000` ne mène vers aucune vue. Autrement dit, nous n'avons pas de page d'accueil. Nous allons créer cette page d'accueil. Celle-ci va être placée dans une application.

Créez l'application `home`, sans oublier de l'installer.

Ajoutez une vue dans cette nouvelle application qui va pointer vers un gabarit qui aura pour simple rôle de dire bonjour.

<div class="path">home/views.py</div>

``` python
from django.views.generic import TemplateView

class HomeView(TemplateView):
    template_name = "home/index.html"
```

> 📃 `TemplateView` est une vue très basique qui a pour seul but d'afficher un gabarit donné.

Ajoutez le gabarit associé à cette vue

<div class="path">home/templates/home/index.html</div>

```html
{% extends "_base.html" %}

{% block content %}
<h1>Bienvenue sur mproject</h1>
{% endblock content%}
```

Incluez les URLs de cette application à celle du projet (comme vous avez fait pour les deux autres applications).

<div class="path">mproject/urls.py</div>

``` python
  urlpatterns = [
      path('admin/', admin.site.urls),
      path('developer/', include('developer.urls')),
      path('task/', include('task.urls')),
+     path('', include('home.urls')),
  ]
```

Et enfin, ajoutez le fichier de configuration d'URL dans la nouvelle application.

<div class="path">home/urls.py</div>

``` python
from django.urls import path

from .views import HomeView

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
]
```

Lancez le serveur et testez !

### Personnalisation de l'accueil

Actuellement, le message est assez impersonnel. Modifiez le gabarit afin qu'il corresponde au code ci-dessous.

<div class="path"> home/templates/home/index.html</div>

``` html
{% extends "_base.html" %}

{% block content %}
{% if user.is_authenticated %}
    <h1>Bienvenue {{ user.first_name }}</h1>
{% else %}
    <h1>Bienvenue sur mproject</h1>
{% endif %}
{% endblock content%}
```

Relancez le serveur si vous l'avez arrêté et testé à nouveau. Si vous avec le message "Bienvenue sur mproject" alors rendez-vous dans la page admin pour vous y connecter en tant que super utilisateur. Si vous avez comme message "Coucou \<votre prénom\>" alors rendez-vous sur la page admin pour vous déconnecter.

Remarquez que la variable de contexte `user` est automatiquement ajouté par Django dans tous les gabarits.

✏️ Le lien "home" ( 🏠 ) ne fonctionne pas. Corrigez-le et gérez l'effet "actif".

### Affichage des tâches de l'utilisateur

Modifiez le gabarit pour que le nom et prénom de l'utilisateur connecté soit affiché. Ajoutez également les tâches qui lui sont assignées.

<div class="path">home/template/home/index.html</div>

``` html
#...

{% if user.is_authenticated %}
<div class="p-1 m-3 bg-light">
    <h1>
        {{ user.first_name }} {{ user.last_name }}
    </h1>
</div>

<div class="container-sm">
    {% if user.tasks.all|length %}
        <ul class="list-group fluid">
        {% for task in user.tasks.all %}
            <li class="list-group-item">
                <strong>{{ task.title }}</strong>
                {{ task.description }}
            </li>
        {% endfor %}
        </ul>
    {% else %}
        <alert class="alert alert-warning">No Tasks</alert>
    {% endif %}
</div>
{% else %}
    <h1>Bienvenue sur mproject</h1>

#...
```

Ajoutez une tâche à votre utilisateur pour vérifier le bon fonctionnement. S'il y en avait déjà une, supprimez la.

> 📃 Si vous avez été attentif jusqu'à maintenant, et si vous avez bien fait tout ce qui est demandé il est légitime de se demander si seuls les super utilisateurs peuvent se connecter. En effet, un utilisateur développeur ne peut pas se connecter. Pour permettre à un utilisateur autre qu'un super utilisateur de se connecter à la page d'administration, celui-ci doit faire partie de "l'équipe" (testez en ajoutant la permission "statut équipe" dans le menu de modification d'un utilisateur). 

Dans la pratique, nous aimerions qu'un utilisateur normal puisse se connecter à notre site. C'est ce que nous allons faire dans la prochaine section.

## URLs d'authentifications

### Connexion

La première chose à faire est de définir les URLs qui vont mener aux vues d'authentification. Celles-ci sont déjà définies dans l'application `django.contrib.auth`.

<div class="path">mproject/settings.py</div>

``` python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',  👈 installée ici
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
```

Définissons les urls : 

<div class="path">mproject/urls.py</div>

``` python
  urlpatterns = [
      path('', include('home.urls')),
      path('admin/', admin.site.urls),
+     path('accounts/', include('django.contrib.auth.urls')),
      path('developer/', include('developer.urls')),
      path('task/', include('task.urls')),
```

Et ajoutez un lien pour permettre la connexion.

<div class="path">home/templates/home/index.html</div>

```html
  {% else %}
      <h1>Bienvenue sur mproject</h1>
+     <a href={% url 'login' %}>Log in</a>
  {% endif %}
```

📃 L'URL "login" fait partie des URLs inclues à l'étape précédente.

🐇 Cliquez pour vous connecter ! Et prenez le temps de lire l'erreur obtenue.

Cette erreur est simple, le gabarit qui doit permettre de se connecter n'a pas été trouvé. Django s'attend en effet à le trouver dans le répertoire `registration` et celui-ci doit s'appeler `login.html`.

Ajoutez donc le fichier suivant dans le dossier `templates` de votre projet avec l'arborescence attendue.

<div class="path">mproject/templatesregistration/login.html</div>

```html
{% extends "_base.html" %}
{% load crispy_forms_tags %}
{% block title %}GProject - login{% endblock title %}

{% block content %}
<div class="container-sm p-3 mt-2 bg-light text-primary">
<h2>Log in</h2>
<form method="post">
    {% csrf_token %}
    {{ form|crispy }}
    <button type="submit" class="btn btn-dark">Log in</button>
</form>
</div>
{% endblock content %}
```
(Ce gabarit devrait vous sembler naturel maintenant.)

Essayez à nouveau de vous connecter avec les identifiants d'un développeur créé dans votre projet (en dehors de la page admin) et pour lequel vous avez défini un mot de passe ✏️.

Une nouvelle fois, vous rencontrez une page d'erreur. Moins évidente cette fois. Pas de panique toutefois ! Après vous êtes connecté, Django cherche à rediriger vers une page de profil qui n'existe pas. Et nous n'allons pas la créer ! Plutôt que de faire cela, nous allons rediriger l'utilisateur qui s'est connecté vers la page d'accueil de notre site.

Dans le fichier `settings.py`, ajoutez cette ligne à la fin.

<div class="path">mproject/settings.py</div>

``` python
  # ...
  
  # AUHT CONFIGURATION
  AUTH_USER_MODEL = 'developer.Developer'
+ LOGIN_REDIRECT_URL = 'home'            
```

✏️ Essayez et profitez 😉

### Déconnexion

Nous allons gérer la déconnexion maintenant, rassurez-vous, le plus dur est fait. Pour cela nous devons

1. Ajouter un lien pour nous déconnecter
2. Rediriger l'utilisateur vers la page d'accueil.

<div class="path">home/templates/home/index.html</div>

``` html
  {% if user.is_authenticated %}
  <div class="p-1 m-3 bg-light">
+     <p class="float-right"><a href={% url 'logout' %}><i class="fa fa-sign-out"></i></a></p>
      <h1>
          {{ user.first_name }} {{ user.last_name }}
      </h1>
  </div>
```

Et on redirige vers notre page d'accueil en ajoutant la constante `LOGOUT_REDIRECT_URL` à notre fichier `settings.py` :

<div class="path">mproject/settings.py</div>

```python
  #... 
  
  # AUHT CONFIGURATION
  AUTH_USER_MODEL = 'developer.Developer'
  LOGIN_REDIRECT_URL = 'home'
+ LOGOUT_REDIRECT_URL = 'home'
```

La déconnexion est maintenant implémentée !
