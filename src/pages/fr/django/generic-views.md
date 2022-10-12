---
title: Vues génériques
description: 
layout: ../../../layouts/MainLayout.astro
---

En Django, il y a les vues fonctions que nous avons déjà vues, mais il y a aussi les vues génériques (vues classes). Ces dernières, plus récentes, ont pour objectif de simplifier davantage la création de vue.

De base, ces vues sont utilisées pour les cas classiques du développement Web : récupérer les données depuis la base de données suivant un paramètre contenu dans l’URL, charger un gabarit et renvoyer le gabarit interprété.

Les vues génériques permettent l’abstraction de pratiques communes, à un tel point que vous n’avez pas à écrire de code Python pour écrire une application.

Nous allons convertir notre application de gestion de projet pour qu’elle utilise le système de vues génériques. Nous pourrons ainsi supprimer une partie de notre code. Nous avons quelques pas à faire pour effectuer cette conversion. Nous allons :

* Convertir l’`URLconf`.
* Supprimer quelques anciennes vues désormais inutiles.
* Introduire de nouvelles vues basées sur les vues génériques de Django.

## DevDetailView

### Vue `DevDetailView`

Dans le fichier `developer.views.py`, créez la classe `DevDetailVue` et supprimez la
fonction `detail()`.

<div class="path"> developer/views.py`</div>

``` python
+ from django.views.generic import DetailView 
  
  #...
  
+ class DevDetailVue(DetailView): 
+     model = Developer 
+     template_name = 'developer/detail.html'
  
- def detail(request, developer_id):
-     #developer = Developer.objects.get(pk=developer_id)
-     developer = get_object_or_404(Developer, pk=developer_id)
-     return render(request, 'developer/detail.html', {'developer': developer})
```

* Nous utilisons ici la vue générique : `DetailView`. Cette vue permet l’abstraction des concepts vus pour afficher une page détaillée pour un type particulier d’objet (ici `Developer`).

* Par défaut, la vue générique `DetailView` utilise un gabarit appelé `<nom app>/<nom modèle>_detail.html`. Dans notre cas, elle utiliserait le gabarit "`developer/developer_detail.html`". L’attribut `template_name` est utilisé pour signifier à Django d’utiliser un nom de gabarit spécifique plutôt que le nom de gabarit par défaut. Dans notre cas, nous avons choisi de renommer le gabarit, mais cela n'était pas obligatoire. En revanche, cela le devient si vous devez afficher de deux manières différentes un même modèle.

* Dans les parties précédentes de ce tutoriel, le gabarit `detail.html` a été renseigné avec un contexte qui contenait la variable de contexte `developer`. Pour `DetailView`, la variable `developer` est fournie automatiquement ; comme nous utilisons un modèle nommé `Developer`, Django sait donner un nom approprié à la variable de contexte.

La vue générique `DetailView` s’attend à ce que la clé primaire capturée dans l’URL s’appelle "pk", nous allons donc changer `developer_id` en `pk` pour la vue générique.

### URL DevDetailView

Nous l'avions vu, path prend en deuxième paramètre une fonction vue. La transformation de la vue générique vers une vue fonction se fait grâce à l'appel à la méthode `as_view()`.

<div class="path"> developer.urls.py</div>

``` python
+ from .views import DevDetailVue
  
  #...
  
  urlpatterns = [
      path('', views.index, name='index'),
-     path('<int:developer_id>', views.detail, name='detail'),
+     path('<int:pk>', DevDetailVue.as_view(), name='detail'),
      path('create', views.create, name='create'),
  ]
```

> ⚠️ Pourquoi y a-t-il les parenthèses après `DevDetailVue.as_view()` et pas après `views.detail` ?
>
> Réponse :
>
> Le deuxième paramètre de `path` est une fonction qui sera appelée lorsque l'url coïncidera avec le premier paramètre. Ainsi, dans le cas d'une vue fonction, nous donnons en paramètre la fonction `detail`. Dans le cas d'une vue générique, nous donnons en paramètre le retour de la fonction `as_view()`qui est une fonction !

## IndexView

Cela va se compliquer un petit peu. En effet, nous avons un liste des développeurs un peu particulière puisqu'elle est suivie d'un formulaire de création. Nous allons procéder par étape afin de rendre l'implémentation de la classe générique aussi claire que possible.

### Vue IndexView

Commençons par créer notre classe comme si nous n'avions pas de formulaire.

<div class="path">developer/views.py</div>

```python
- from django.views.generic import DetailView
+ from django.views.generic import DetailView, ListView
  
  #...
  
+ class IndexView(ListView): 
+     model = Developer 
+     template_name = "developer/index.html"
+     context_object_name = 'developers'
```

* Nous créons une nouvelle classe qui hérite de `ListView`.

* Nous indiquons que la vue est faite pour le modèle `Developer`.

* À l'instar d'une `DetailView` un nom de gabarit est généré automatiquement. Dans le cas d'une `ListView`, le nom généré automatiquement est : `<nom_app>/<nom_modèle><suffixe_gabarit>.html`. Étant donné que le suffixe par défaut est `_list`, nous aurions pour notre modèle : `developer/developer_list.html`. Nous modifions ce nom de gabarit afin qu'il corresponde au gabarit existant (ce changement pourrait aussi se faire au niveau du gabarit).

* Nous modifions également le nom de la variable du contexte qui contient la liste des développeurs. Par défaut, celle-ci aurait pour nom : `developer_list`.

#### Ajout du formulaire à IndexView

Nous avançons, mais nous n'avons pas ajouté notre formulaire dans le contexte. Pour cela, il est nécessaire de réécrire la
méthode `get_context_data()`.

<div class="path">developer/views.py</div>

```python
  from django.views.generic import DetailView, ListView
  
  #...
  
- def index(request):
-     context = {
-         'developers': Developer.objects.all(),
-         'form': DeveloperForm
-     }
- 
-     return render(request, 'developer/index.html', context)
  
  class IndexView(ListView):
      model = Developer
      template_name = "developer/index.html"
      context_object_name = 'developers'
  
  
+     def get_context_data(self, **kwargs): 
+         context = super(IndexView, self).get_context_data(**kwargs)
+         context['form'] = DeveloperForm 
+         return context 
```

> *_Parenthèse Python 🐍_*
> En ☕️ Java, nous écririons `super.getContextData(...)` afin d'appeler la fonction de la classe mère. En python, il est nécessaire de donner la classe en premier paramètre et `self` en second paramètre.

Ainsi,

1. Nous chargeons dans la variable `context` le contexte tel qu'il était défini précédemment, c'est-à-dire contenant la variable `developers`. 
1. Ensuite, nous ajoutons une clé `form` et le formulaire à utiliser `DeveloperForm`. Nous retournons ensuite le contexte définit au sein de la variable `context`.

### URL `IndexView`

Il est maintenant temps d'associer une url à notre nouvelle classe vue. Rien de plus simple, vous avez fait quelque chose de très similaire avec `DevDetailView`.

<div class="path">developer/urls.py</div>

``` python
  #...
- from .views import DevDetailVue
+ from .views import DevDetailVue, IndexView
  
  #...

  urlpatterns = [
-     path('', views.index, name='index'),
+     path('', IndexView.as_view(), name='index'),
      path('<int:pk>', DevDetailVue.as_view(), name='detail'),    
      path('create', views.create, name='create'),
  ]
```

## Vue générique et Mixins

C'est bien gentil tout ça, mais tout cela m'a l'air bien compliqué et je ne sais pas où vous avez été cherché l'information. 😭

En réalité, tout cela est relativement simple. Surtout quand on sait où chercher l'information.

Les vues génériques sont basées sur le principe de Mixin. Wikipédia le définit assez simplement ce principe de la manière suivante

> *_Concept de Mixin_*
> "En programmation orientée objet, un mixin ou une classe mixin est une classe destinée à être composée par héritage multiple avec une autre classe pour lui apporter des fonctionnalités. C'est un cas de réutilisation d'implémentation. Chaque mixin représente un service qu'il est possible de greffer aux classes héritières. "
> [Wikipédia](https://fr.wikipedia.org/wiki/Mixin)

Maintenant que vous savez ce que c'est, il vous suffit de savoir quelle fonctionnalité est greffée à votre classe. Vous trouverez ces informations dans la documentation. Par exemple, pour DetailView vous trouverez les Mixin utilisés et donc les fonctionnalités [ici](https://docs.djangoproject.com/fr/4.1/ref/class-based-views/generic-display/).

Quelques exemples :

* Comment je sais que le gabarit par défaut pour une classe qui hérite de `ListView`est `<nom_app>/<nom_modèle><suffixe_gabarit>.html` ? Cela est ajouté grâce au [MultipleObjectTemplateResponseMixin](https://docs.djangoproject.com/fr/4.1/ref/class-based-views/mixins-multiple-object/#multipleobjecttemplateresponsemixin) dont hérite la classe `ListView`.

* Et pour `get_context_data()` ? [ContextMixin](https://docs.djangoproject.com/fr/4.1/ref/class-based-views/mixins-multiple-object/)


Nous vous recommandons également d'aller jeter un coup d'oeil de temps à autre dans le code des vues génériques. Il vous apprendra beaucoup sur leur fonctionnement. Il se trouve [ici](https://github.com/django/django/tree/master/django/views/generic).
