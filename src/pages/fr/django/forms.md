---
title: Formulaire développeur
description:
layout: ../../../layouts/MainLayout.astro
---

## Ajout d'un développeur

Pour le moment, il est nécessaire d'utiliser le `shell` pour ajouter un développeur.

Nous allons ajouter au sein de la page "index" de développeur, la possibilité d'ajouter un développeur.

Ainsi, sur la page de l'index, nous aurons la liste des développeurs ainsi qu'un formulaire permettant d'en ajouter un.

### Ajout du formulaire

Ajoutez ce morceau de code dans le gabarit `index.html`

<div class="path">developer/templates/developer/index.html</div>

``` html
 #...
 {% else %}
     <p><strong>Il n'y a aucune dévelopeur enregistré !</strong>/p>
 {% endif %}

 <form action="{% url 'developer:create' %}" method="post"> 👈 new
     {% csrf_token %}                                       👈 new

     <label for="first_name">First name</label>             👈 new
     <input type="text" name="first_name" required>         👈 new
     <label for="last_name">Last name</label>               👈 new
     <input type="text" name="last_name" required>          👈 new
     <button type="submit">Create</button>                  👈 new
 </form>                                                    👈 new
{% endblock content %}
```

Un résumé rapide :

* Ce gabarit affiche maintenant un formulaire avec deux champs texte et un bouton de création. Notez que dans ce formulaire, nous avons nommé les deux entrées `first_name` et `last_name`. Ce sont les concepts de base des formulaires HTML.
* Nous avons défini `{% url 'developer:create' %}` comme attribut action du formulaire, et nous avons précisé `method="post"`. L’utilisation de `method="post"` (par opposition à `method="get"`) est très importante, puisque le fait de valider ce formulaire va entraîner des modifications de données sur le serveur. À chaque fois qu’un formulaire modifie des données sur le serveur, vous devez utiliser `method="post"`. Cela ne concerne pas uniquement Django ; c’est une bonne pratique à adopter en tant que développeur Web.
* Comme nous créons un formulaire POST (qui modifie potentiellement des données), il faut se préoccuper des attaques inter-sites. Heureusement, vous ne devez pas réfléchir trop longtemps car Django offre un moyen pratique à utiliser pour s’en protéger. En bref, tous les formulaires POST destinés à des URL internes doivent utiliser la balise de gabarit `{% csrf_token %}`.

### URL et vue pour la création de développeur

Maintenant, nous allons créer une vue Django qui récupère les données envoyées pour nous permettre de les exploiter. D'abord, nous devons ajouter un chemin vers cette nouvelle vue.

<div class="path">developer/urls.py</div>

``` python
app_name = 'developer'
urlpatterns = [
    path('', views.index, name='index'),
    path('<int:developer_id>', views.detail, name='detail'),
    path('create', views.create, name='create'),              👈 new
]
```

Ajoutez également la vue :

<div class="path">developer/views.py</div>

``` python
#...
from django.http import HttpResponseRedirect 👈 new
from django.urls import reverse 👈 new
#...
def create(request):                                          👈 new
    Developer.objects.create(                                 👈 new
        first_name=request.POST['first_name'],                👈 new
        last_name = request.POST['last_name']                 👈 new
    )                                                         👈 new
    # Toujours renvoyer une HTTPResponseRedirect après avoir géré correctement
    # les données de la requête POST. Cela empêche les données d'être postée deux
    # fois si l'utilisateur clique sur le bouton précédent.
    return HttpResponseRedirect(reverse('developer:index'))   👈 new
```

Ce code contient quelques points encore non abordés dans ce tutoriel :

* `request.POST` est un objet similaire à un dictionnaire qui vous permet d’accéder aux données envoyées par leurs clés. Dans ce cas, `request.POST['first_name']` et `request.POST['last_name']` renvoient le prénom et nom du développeur sous forme d’une chaîne de caractères. Les valeurs dans `request.POST` sont toujours des chaînes de caractères. Pensez donc à réaliser une transformation si le type de votre entrée n'est pas de nature `string`.

> Parenthèse Python 🐍
> 
> En Python vous pouvez convertir une chaîne de caractère en un entier grâce à la fonction `int()`. Par exemple : `int("42")`.

* Notez que Django dispose aussi de `request.GET` pour accéder aux données GET de la même manière – mais nous utilisons explicitement `request.POST` dans notre code, pour s’assurer que les données ne sont modifiées que par des requêtes POST.

* Après la création d'un développeur, le code renvoie une `HttpResponseRedirect` plutôt qu’une `HttpResponse` normale. `HttpResponseRedirect` prend un seul paramètre : l’URL vers laquelle l’utilisateur va être redirigé (voir le point suivant pour la manière de construire cette URL dans ce cas).

* Comme le commentaire Python l’indique, vous devez systématiquement renvoyer une HttpResponseRedirect après avoir correctement traité les données POST. Ceci n’est pas valable uniquement avec Django, c’est une bonne pratique du développement Web.

* Dans cet exemple, nous utilisons la fonction `reverse()` dans le constructeur de `HttpResponseRedirect`. Cette fonction nous évite de coder en dur une URL dans une vue. On lui donne en paramètre la vue vers laquelle nous voulons rediriger ainsi que la partie variable de l’URL qui pointe vers cette vue. Dans ce cas, en utilisant l’URLconf défini précédemment, l’appel de la fonction `reverse()` va renvoyer la chaîne de caractères `developer/`. Cette URL de redirection va ensuite appeler la vue `index` pour afficher la liste des développeurs.

### Les classes formulaires

Nous allons simplifier les étapes de créations de formulaire grâce aux classes formulaires.

Dans le dossier `Developer`, ajoutez un fichier `forms.py`. Dans celui-ci ajoutez le code suivant : 

#### Créez un formulaire

<div class="path">developer/forms.py</div>

```python
from django import forms

from .models import Developer
 
class DeveloperForm(forms.Form):
    first_name = forms.CharField(label="First name", max_length=100)
    last_name = forms.CharField(max_length=100)
```

Nous définissons ainsi une nouvelle classe `DeveloperForm`. Celles-ci possède les deux mêmes champs que le modèle associé.

#### Ajoutez le formulaire au gabarit

Nous allons maintenant modifier le gabarit afin que celui-ci affiche le formulaire. Enlevez tout ce qui a trait aux champs et ajoutez `{{ form }}`.

> 📃Vous pouvez mettre le formulaire en forme de différente façon.
>
> * `{{ form.as_table }}`
> * `{{ form.as_p }}`
> * `{{ form.as_ul }}`


<div class="path">developer/index.html</div>

``` html
    <form action="{% url 'developer:create' %}" method="post">
        {% csrf_token %}

        <!--<label for="first_name">First name</label>
        <input type="text" name="first_name" required>
        <label for="last_name">Last name</label>
        <input type="text" name="last_name" required>-->
        {{ form }}                                        👈 new
        <button type="submit">Create</button>
    </form>
```

#### Envoyez le formulaire au gabarit

Le gabarit n'est évidement pas en mesure de deviner quel formulaire il doit afficher. Il est de la responsabilité de la vue d'ajouter le formulaire au contexte.

<div class="path">developer/views.py</div>

``` python
#...
from .forms import DeveloperForm                👈 new

def index(request):
    context = {
        'developers': Developer.objects.all(),
        'form': DeveloperForm,                  👈 new
    }

    return render(request, 'developer/index.html', context)
#...
```

#### Valider le formulaire

Nous allons maintenant utiliser ce formulaire afin d'obtenir les données saisies par l'utilisateur.

<div class="path"> developer/views.py`</div>

``` python
#...
def create(request):
    form = DeveloperForm(request.POST)                    👈 new

    if form.is_valid():                                   👈 new
        Developer.objects.create(                         👈 new
            first_name=form.cleaned_data['first_name'],   👈 new
            last_name=form.cleaned_data['last_name']      👈 new
        )                                                 👈 new
    # Toujours renvoyer une HTTPResponseRedirect après avoir géré correctement
    # les données de la requête POST. Cela empêche les données d'être postée deux
    # fois si l'utilisateur clique sur le bouton précédent.
    return HttpResponseRedirect(reverse('developer:index'))
#...
```

Notez que nous n'utilisons plus l'instruction `request.POST['xxx']` pour récupérer la donnée associée à un champ, mais `form.cleaned_data['first_name'], `. Cela a plusieurs impacts.

1. Il est nécessaire de demander la validité (`is_valid()` du formulaire avant d'obtenir une donnée _nettoyée_).
1. Une donnée nettoyée n'est pas nécessairement un string. Ainsi, pour un champ de type `IntegerField`, la donnée retournée sera de type entier.

#### Un formulaire DRY

Vous l'avez peut-être remarqué, mais dans le modèle, les champs avaient une longueur de 200 caractères. Dans le formulaire de 100 💩. Ce type d'incohérence apparaît lorsque nous oublions le principe DRY.

Django a prévu une meilleure manière de procéder afin de créer un formulaire sur base d'un modèle.

<div class="path"> developer/forms.py</div>

```python
from django import forms

from .models import Developer

class DeveloperForm(forms.ModelForm): 👈forms.ModelForm plutôt que forms.Form
    # first_name = forms.CharField(label="First name", max_length=100)    👈 old
    # last_name = forms.CharField(label='Last name', max_length=100)      👈 old
    class Meta:                                   👈new
        model = Developer                         👈new
        fields = ['first_name', 'last_name']      👈new
```

Et voilà, nous avons un formulaire basé sur le modèle `Developer`. Et surtout, nous respectons le principe DRY !
