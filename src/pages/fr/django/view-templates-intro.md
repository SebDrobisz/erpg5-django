---
title: Vues et templates - introduction
description: Docs intro
layout: ../../../layouts/MainLayout.astro
---

Une vue est un « type » de page Web dans votre application Django qui sert généralement à une fonction précise et possède un gabarit spécifique. Par exemple, dans une application de blog, vous pouvez avoir les vues suivantes :

* La page d’accueil du blog – affiche quelques-uns des derniers billets.
* La page de « détail » d’un billet – lien permanent vers un seul billet.
* La page d’archives pour une année – affiche tous les mois contenant des billets pour une année donnée.
* La page d’archives pour un mois – affiche tous les jours contenant des billets pour un mois donné.
* La page d’archives pour un jour – affiche tous les billets pour un jour donné.
* Action de commentaire – gère l’écriture de commentaires sur un billet donné.

Dans notre application, nous possédons plusieurs vues. Parmi celles-ci :
* une page d'accueil ;
* une page qui liste les développeurs ;
* une page qui donne le détail des développeurs - c'est-à-dire le nom, prénom ainsi que toutes ses tâches ;
* une page pour l'ensemble des tâches...

Dans Django, les pages Web et les autres contenus sont générés par des vues. Chaque vue est représentée par une fonction Python. Django choisit une vue en examinant l’URL demandée (pour être précis, la partie de l’URL après le nom de domaine).

Un modèle d’URL est la forme générale d’une URL ; par exemple : `/archive/<année>/<mois>/`.

Pour passer de l’URL à la vue, Django utilise ce qu’on appelle des configurations d’URL (URLconf). Une configuration d’URL associe des motifs d’URL à des vues.

### Les gabarits (templates)

La vue que nous avons écrite jusqu'à maintenant est très sommaire, une page web ne ressemble en rien à cela.

De plus, il y a un problème : l’allure de la page est codée en dur dans la vue. Si vous voulez changer le style de la page, vous devrez modifier votre code Python. Nous allons donc utiliser le système de gabarits de Django pour séparer le style du code Python en créant un gabarit que la vue pourra utiliser.

Tout d’abord, créez un répertoire nommé `templates` dans votre répertoire `developer`. C’est là que Django recherche les gabarits.

Le paramètre `TEMPLATES` de votre projet indique comment Django va charger et produire les gabarits. Le fichier de réglages par défaut configure un moteur DjangoTemplates dont l’option `APP_DIRS` est définie à `True`. Par convention, DjangoTemplates recherche un sous-répertoire `templates` dans chaque application figurant dans `INSTALLED_APPS`. (Allez vérifier la présence de cette option dans le fichier `mproject/settings.py` ✏️)

Dans le répertoire `templates` que vous venez de créer, créez un autre répertoire nommé `developer` dans lequel vous placez un nouveau fichier `index.html`. Autrement dit, le chemin de votre gabarit doit être `developer/templates/developer/index.html`. Conformément au fonctionnement du chargeur de gabarit `app_directories` (cf. explication ci-dessus), vous pouvez désigner ce gabarit dans Django par `developer/index.html`.


> *_Gabarits : espace de nom_* 
>
> Il serait aussi possible de placer directement nos gabarits dans `developer/templates` (plutôt que dans un sous-répertoire `developer`), mais ce serait une mauvaise idée. Django choisit le premier gabarit qu’il trouve pour un nom donné et dans le cas où vous avez un gabarit de même nom dans une autre application, Django ne fera pas la différence. Il faut pouvoir indiquer à Django le bon gabarit, et la meilleure manière de faire cela est d’utiliser des espaces de noms. C’est-à-dire que nous plaçons ces gabarits dans un autre répertoire portant le nom de l’application.

Lisez et insérez ce code dans le gabarit `developer/index.html`

<div class="path">developer/templates/developer/index.html</div>

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, > initial-scale=1.0">
    <title>MProject</title>
</head>
<body>
    <h1>MProject</h1>
    <h2>Liste des développeurs</h2>

    {% if developers %}
    <ul>
        {% for dev in developers %}
        <li>{{ dev.first_name }}</li>
        {% endfor %}
    </ul>
    {% else %}
        <p><strong>Il n'y a aucun développeur enregistré !</strong></p>
    {% endif %}
</body>
</html>
```

Mettez à jour la vue afin de permettre le rendu de ce gabarit.

<div class="path">developer/views.py</div>

``` python
  from django.shortcuts import render
- from django.http import HttpResponse
  
+ from .models import Developer
  
  def index(request):
-     return HttpResponse("Hello, world. You're at the developers index.")
+     context = {
+         'developers': Developer.objects.all()
+     }
  
+     return render(request, 'developer/index.html', context)
```

Ce code charge le gabarit appelé `developer/index.html` et lui fournit un contexte. Ce contexte est un dictionnaire qui fait correspondre des objets Python (valeurs) à des noms de variables de gabarit (clés).

Chargez la page en appelant l’URL « `/developer/` » dans votre navigateur et vous devriez voir une liste à puces contenant une liste de développeurs.

![dev](/erpg5-django/django-tutorials/dev_page_01.png)

> *_Exercices ✏️_*
> 
> * Supprimez chacun des développeurs et vérifiez que le message "II n'y a aucun développeur enregistré !" soit bien affiché. 
> * Rajoutez ensuite au moins deux développeurs.
> * Modifier le gabarit pour ajouter le nom des développeurs.

## Une deuxième vue

Nous allons ajouter une deuxième vue qui va nous permettre d'afficher le détail des informations que l'on a sur les développeurs. Nous allons devoir compléter les étapes suivantes : 

1. Ajout d'une URL qui pointe vers la nouvelle vue
1. Ajout d'une vue
1. Ajout d'un nouveau gabarit.

<div class="path">developer/urls.py</div>

``` python
  urlpatterns = [
     path('', views.index, name='index'),
+    path('<int:developer_id>/', views.detail, name='detail'),
  ]
```

<div class="path">developer/view.py`</div>

``` python
  def index(request):
      context = {
          'developers': Developer.objects.all(),
      }
      return render(request, 'developer/index.html', context)
  
  
+ def detail(request, developer_id):
+     developer = Developer.objects.get(pk=developer_id)
+     return render(request, 'developer/detail.html', {'developer': developer})
```

<div class="path">developer/templates/developer/details.html</div>

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MProject</title>
</head>
<body>
    <h1>MProject</h1>
    <h2>Détail de {{ developer.first_name }}</h2>

    <p><Strong>Prénom : {{ developer.first_name }}</Strong></p>
    <p><Strong>Nom de famille : {{ developer.last_name }}</Strong></p>
</body>
</html>
```

Ouvrez votre navigateur à l’adresse « `/developer/3/` ». La méthode `detail()` sera exécutée et affichera le développeur fourni dans l’URL.

> 📃 Nous vous suggérons ici d'utiliser la valeur 3 pour l'adresse. Cette valeur devrait correspond à l'id du développeur que vous avez recréé après avoir supprimé, comme demandé, les deux développeurs "sdr" et "jlc". Si vous avez un doute, vous pouvez aller dans le `shell` et lancer la commande `[dev.id for dev in Developer.objects.all()]` après avoir importé la classe `Developer`. Cette commande va vous retourner la liste des identifiants présents dans la base de donnée. (Ce code n'a rien de magique, il s'agit de la constitution d'une liste sur base d'un parcours des développeurs disponibles dans la BDD.)

Lorsque quelqu’un demande une page de votre site Web, par exemple `/developer/3/`, Django charge le module Python `mproject.urls` parce qu’il est mentionné dans le réglage `ROOT_URLCONF`. Il trouve la variable nommée `urlpatterns` et parcourt les motifs dans l’ordre. Après avoir trouvé la correspondance `developer/`, il retire le texte correspondant (`developer/`) et passe le texte restant – `3/` – à la configuration d’URL `developer.urls` pour la suite du traitement. Dans le cas présent, c’est `<int:developer_id>/` qui correspond, ce qui aboutit à un appel à la vue `detail()` comme ceci :

``` python
detail(request=<HttpRequest object>, developer_id=3)
```

La partie `developer_id=3` vient de `<int:developer_id>`. En utilisant des chevrons, cela « capture » une partie de l’URL l’envoie en tant que paramètre nommé à la fonction de vue ; la partie `:developer_id>` de la chaîne définit le nom qui va être utilisé pour identifier le motif trouvé, et la partie `<int:` est un convertisseur qui détermine ce à quoi les motifs doivent correspondre dans cette partie du chemin d’URL.

Pour plus d'info sur la distribution d'URL, cela se passe [ici](https://docs.djangoproject.com/fr/4.1/topics/http/urls/). 📖

### Erreur 404

Si vous avez bien suivi ce cours jusqu'à maintenant, vous ne devriez pas avoir rencontré d'erreur. Si vous vous rendez sur l'adresse `localhost:8000/developer/42` vous serez redirigé vers une page d'erreur Django. En effet, à moins d'avoir créé beaucoup de développeurs, le développeur possédant l'id 42 n'existe pas.

Nous pouvons corriger cela en utilisant la fonction `get_object_or_404`.

<div class="path">developer/views.py</div>

``` python
+ from django.shortcuts import render, get_object_or_404
  from django.http import HttpResponse
  
  from .models import Developer
  
  def index(request):
      context = {
          'developers': Developer.objects.all(),
      }
  
      return render(request, 'developer/index.html', context)
  
  def detail(request, developer_id):
-     developer = Developer.objects.get(pk=developer_id)
+     developer = get_object_or_404(Developer, pk=developer_id)
      return render(request, 'developer/detail.html', {'developer': developer})
```


La fonction `get_object_or_404()` prend un modèle Django comme premier paramètre et un nombre arbitraire de paramètres mots-clés, qu’il transmet à la méthode `get()` du gestionnaire du modèle. Elle lève une exception `Http404` si l’objet n’existe pas.

### Lien entre les vues

Pour passer d'une vue à l'autre, nous allons naturellement utiliser des liens `html` (`<a>`).
Revenons dans la vue `index` et plus précisément dans le gabarit et ajoutons ces liens.

<div class="path">developer/templates/developer/index.html</div>

``` html
  # ...
      {% if developers %}
      <ul>
          {% for dev in developers %}
-         <li>{{ dev.first_name }}</li>
+         {#<li>{{ dev.first_name }}</li>#} 👈 ceci est commenté !
+         <li><a href='/developer/{{ dev.id }}'>{{ dev.first_name }}</a></li>
          {% endfor %}
      </ul>
      {% else %}
          <p><strong>Il n'y a aucun développeur enregistré !</strong>/p>
      {% endif %}
  # ...
</body>
```

Vous pouvez maintenant essayer d'aller sur l'index de votre site et suivre les liens qui sont créés !

#### Configurer les chemins via `{% url %}`

Le problème de cette approche codée en dur et fortement couplée est qu’il devient fastidieux de modifier les URL dans des projets qui ont beaucoup de gabarits. Cependant, comme vous avez défini le paramètre `name` dans les fonctions `path()` du module `developer.urls`, vous pouvez supprimer la dépendance en chemins d’URL spécifiques définis dans les configurations d’URL en utilisant la balise de gabarit `{% url %}` :

<div class="path">developer/templates/developer/index.html</div>

``` python
<li><a href="{% url 'detail' dev.id %}">{{ dev.first_name }}</> a></li>
```

Le principe de ce fonctionnement est que l’URL est recherchée dans les définitions du module `developer.urls`. Ci-dessous, vous pouvez voir exactement où le nom d’URL "detail" est défini :

<div class="path">developer/urls.py</div>

``` python
path('<int:developer_id>/', views.detail, name='detail'),
```

Si vous souhaitez modifier l’URL de détail des développeurs, par exemple sur le modèle `developer/specifics/12/`, il suffit de faire la modification dans `developer/urls.py`. Il n'est pas nécessaire de modifier un nombre potentiellement grand de gabarit.

<div class="path">developer/urls.py</div>

``` python
- path('<int:developer_id>/', views.detail, > name='detail'),
+ path('specifics/<int:developer_id>/', views.detail, > name='detail'),
```

#### Espaces de noms et noms d’URL

Le projet ne contient actuellement qu'une seule application, `developer`. Plus tard, une autre application va se greffer à notre projet. Comment Django arrive-t-il à différencier les noms d’URL entre elles ? Par exemple, l’application `developer` possède une vue `detail` et il se peut tout à fait qu’une autre application du même projet en possède aussi une. Comment peut-on indiquer à Django quelle vue d’application il doit appeler pour une URL lors de l’utilisation de la balise de gabarit `{% url %}` ?

La réponse est donnée par l’ajout d’espaces de noms à votre configuration d’URL. Dans le fichier `developer/urls.py`, ajoutez une variable `app_name` pour définir l’espace de nom de l’application :

<div class="path">developer/urls.py</div>

```python
app_name = 'developer' 👈new
urlpatterns = [
    path('', views.index, name='index'),
    path('<int:developer_id>/', views.detail, name='detail'),
]
```

Modifiez maintenant les liens du gabarit `developer/index.html` pour qu’elle pointe vers la vue « detail » à l’espace de nom correspondant.

<div class="path">developer/index.html</div>

``` html
#...
{% if developers %}
<ul>
    {% for dev in developers %}
    {#<li>{{ dev.first_name }}</li>#}
    <li><a href="{% url 'developer:detail' dev.id %}">{{ dev.first_name }}</a></li> <!--👈 ajout de "developer:" -->
    {% endfor %}
</ul>
#...
```
