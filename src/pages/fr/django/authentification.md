---
title: Authentification
description: 
layout: ../../../layouts/MainLayout.astro
---

### Demande d'authentification

Maintenant que nous avons la capacité de créer des utilisateurs. Nous allons limiter l'accès au site aux utilisateurs connectés et limiter l'accès à certaines fonctionnalités aux utilisateurs qui en ont le droit.

Voici donc la suite du programme :

1. Nous allons ajouter une page d'accueil qui va afficher les tâches de l'utilisateur connecté et permettre à l'utilisateur de se connecter s'il ne l'est pas.
2. Nous allons empêcher l'accès aux vues d'index des applications `developer` et `task` aux utilisateurs non connecté.
3. Nous allons ajouter des permissions au niveau de la gestion des tâches afin que certains utilisateurs ne puissent voir que celles qui sont attribuées à travers la description des développeurs, mais pas au travers de la liste des tâches.

#### Une app pour les gouverner toutes

Pour le moment, `localhost:8000` ne mène vers aucune vue. C'est-à-dire que nous n'avons pas de page d'accueil. Nous allons créer cette page d'accueil. Celle-ci va être placée dans une application.

Créez l'application `home`, ajoutez celle-ci dans le fichier `settings.py`.

Ajoutez une vue dans cette nouvelle application qui va pointer vers un template qui aurra pour simple rôle de dire bonjour.

> `home/views.py`
> ``` python
> from django.views.generic import TemplateView
> 
> class HomeView(TemplateView):
>     template_name = "home/index.html"
> ```

📃 `TemplateView` est une vue très basique qui a pour seul devoir d'afficher un gabarit donné.

Ajoutez le template associé à cette vue

> `home/templates/home/index.html`
> ```html
> {% extends "_base.html" %}
> 
> {% block content %}
> <h1>Coucou vous !</h1>
> {% endblock content%}
> ```

Ajoutez les urls de cette application à celle du projet (comme vous avez fait pour les deux autres applications).

> `mproject/urls.py`
> ``` python
> urlpatterns = [
>     path('admin/', admin.site.urls),
>     path('developer/', include('developer.urls')),
>     path('task/', include('task.urls')),
>     path('', include('home.urls')), 👈 new
> ]
> ```

Et enfin, ajoutez un chemin dans le fichier `urls.py` de votre applicaton vers cette nouvelle vue.

> `home/urls.py`
> 
> ``` python
> from django.urls import path
> 
> from . import views
>
> urlpatterns = [
>     path('', views.HomeView.as_view(), name='home'),
> ]
> ```

Lancez le serveur et testez ! ⭐️

#### Personnalisation de l'accueil

Actuellement, le message est assez impersonnel. Modifiez le template afin qu'il corresponde au code ci-dessous.

> `home/templates/home/index.html`
> 
> ```html
> {% extends "_base.html" %}
> 
> {% block content %}
> {% if user.is_authenticated %}
>     <h1>Coucou {{ user.first_name }}</h1>
> {% else %}
>     <h1>Coucou toi !</h1>
> {% endif %}
> {% endblock content%}
> ```

Relancez le serveur si vous l'avez arrêté et testé à nouveau. Si vous avec le message "Coucou toi" alors rendez-vous dans la page admin pour vous y connecter. Si vous avez comme message "Coucou \<votre prénom\>" alors rendez-vous sur la page admin pour vous déconnecter.

Remarquez que la variable de context `user` est automatiquement ajouté par Django dans tout affichage de gabarit.

⭐️ Le lien "home" ( 🏠 ) ne fonctionne pas. Corrigez-le.

#### Affichage des tâches

Modifiez le template afin d'afficher les tâches, le nom et le prénom de l'utilisateur connecté.

Exemple de code
> `home/template/home/index.html`
> 
> ``` html
> #...
> {% if user.is_authenticated %}
> <div class="p-1 m-3 bg-light">
>     <h1>
>         {{ user.first_name }} {{ user.last_name }}
>     </h1>
> </div>
> 
> <div class="container-sm">
>     {% if user.tasks.all|length %}
>         <ul class="list-group fluid">
>         {% for task in user.tasks.all %}
>             <li class="list-group-item">
>                 <strong>{{ task.title }}</strong>
>                 {{ task.description }}
>             </li>
>         {% endfor %}
>         </ul>
>     {% else %}
>         <alert class="alert alert-warning">No Tasks</alert>
>     {% endif %}
> </div>
> {% else %}
>     <h1>Coucou toi !</h1>
> #...
> ```

Ajoutez une tâche à votre utilisateur pour vérifier le bon fonctionnement. S'il y en avait déjà une, supprimez la.

📃 Si vous avez été attentif jusqu'à maintenant, et si vous avez bien fait tout ce qui est demandé nous nous attendons à une question équivalente à celle-ci : "Je pensais que seuls les superutilisateurs peuvent se connecter. L'utilisateur que nous avions fait précédement ne peut pas ce connecter". En effet, seuls un utilisateur ("du staff") peut se connecter à notre page admin. Mais tout utilisateur peut se connecter à notre site. Dans les fait, c'est vrai si on lui en donne l'occasion. C'est ce que nous allons faire dans la prochaine section.

#### Urls d'authentifications

##### Connection

La première chose à faire est de définir les urls qui vont mener aux vues d'authentification.

> `mproject/urls.py`
> ``` python
> 
> urlpatterns = [
>     path('', include('home.urls')),
>     path('admin/', admin.site.urls),
>     path('accounts/', include('django.contrib.auth.urls')), 👈 new
>     path('developer/', include('developer.urls')),
>     path('task/', include('task.urls')),
> ```

Et ajoutez un lien pour se connecter.

> `templates/home/index.html`
> 
> ```html
> {% else %}
>     <h1>Coucou toi !</h1>
>     <a href={% url 'login' %}>Log in</a> 👈 new
> {% endif %}
> ```

📃 L'url "login" fait partie des urls inclue à l'étape précédente.

🐇 Cliquez pour vous connecter ! Et prenez 5 minutes pour lire l'erreur obtenue.
Cette erreur est simple, le template permettant de se connecter n'a pas été trouvé. Django s'attend en effet à le trouver dans le répertoir `registration` et celui-ci doit s'appeler `login.html`.

Ajoutez donc le fichier suivant dans le dossier `templates` de votre projet avec l'arborescence attendue.

> `registration/login.html`
> 
> ```html
> {% extends "_base.html" %}
> {% load crispy_forms_tags %}
> {% block title %}GProject - login{% endblock title %}
> 
> {% block content %}
> <div class="container-sm p-3 mt-2 bg-light text-primary">
> <h2>Log in</h2>
> <form method="post">
>     {% csrf_token %}
>     {{ form|crispy }}
>     <button type="submit" class="btn btn-dark">Log in</button>
> </form>
> </div>
> {% endblock content %}
> ```
(Ce gabarit devrait vous sembler naturel maintenant.)

Essayez à nouveau de vous connecter avec les identifiants d'un développeur créé dans votre projet (en dehors de la page admin) et pour lequel vous avez défini un mot de passe ⭐️.

Une nouvelle fois, vous rencontrez une page d'erreur. Moins évidente cette fois. Pas de panique toutefois ! Après vous êtes connecté, Django cherche une page de profil qui n'existe pas. Et nous n'allons pas la créé ! Plutôt que de faire cela, nous allons rediriger l'utilisateur qui s'est connecté vers la page d'accueil de notre site.

Dans le fichier `settings.py`, ajoutez cette ligne à la fin.

`LOGIN_REDIRECT_URL = 'home'`

⭐️ Essayez et profitez 😉

##### Déconnexion

Nous allons gérer la déconnection maintenant, rassurez vous, le plus dur est fait. Pour cela nous devons

1. Ajouter un lien pour nous déconnecter
2. Rediriger l'utilisateur vers la page d'accueil.

> `templates/home/index.html`
> 
> ``` html
> {% if user.is_authenticated %}
> <div class="p-1 m-3 bg-light">
>     <p class="float-right"><a href={% url 'logout' %}><i class="fa fa-sign-out"></i></a></p> 👈 new
>     <h1>
>         {{ user.first_name }} {{ user.last_name }}
>     </h1>
> </div>
> ```

Et on redirige en ajoutant cette variable à notre fichier `settings.py` :

```python
LOGOUT_REDIRECT_URL = 'home'
```

⭐️ Testez !