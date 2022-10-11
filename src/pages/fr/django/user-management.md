---
title: Gestion des utilisateur
description: 
layout: ../../../layouts/MainLayout.astro
---

Nous allons maintenant modifier le modèle développeur afin que ceux-ci soient des utilisateurs.

Si vous vous documentez par vous-même, vous risquez de tomber sur l'ancienne approche qui consistait à réaliser un lien **OneToOne** qui était appelé `modèle de profil". Dans ce cours, nous allons voir la plus simple des deux techniques récentes.

En effet, il existe deux possibilités. Soit étendre le modèle `AbstractUser`, soit étendre le modèle `AbstractBaseUser`. Nous allons plutôt choisir la première possibilité, car même si le second permet beaucoup plus de flexibilité, la première méthode est plus simple et permet un changement postérieur si les besoins changent.

Nous allons suivre ces 4 étapes : 

1. Créer un modèle "CustomUser".
1. Mettre à jour le fichier `settings.py`.
1. Adapter `UserCreationForm` et `UserChangeForm`.
1. Ajouter le nouveau modèle à `admin.py`.

> ⚠️ Avant de continuer, supprimez toute migration de votre base de données (`python manage.py migrate <app> zero`) et supprimez les fichiers migrations.

#### Configuration du modèle d'utilisateur

<div class="path">developer/models.py</div>

``` python
from django.contrib.auth.models import AbstractUser   👈new
from django.db import models

#class Developer(models.Model):                       👈 old
class Developer(AbstractUser):                        👈new
```

Nous allons maintenant ajouter un paramètre `AUTH_USER_MODEL` au bas de notre fichier de configuration afin de demander à notre projet d'utiliser notre modèle plutôt que le modèle d'utilisateur par défaut.

<div class="path">mproject/settings.py</div>

``` python
# CRISPY FORM CONFIGURATION
CRISPY_TEMPLATE_PACK = 'bootstrap4'

# AUHT CONFIGURATION                      👈new
AUTH_USER_MODEL = 'developer.Developer'   👈new
```

#### Formulaire pour le modèle d'utilisateur

On ne va pas y aller par 4 chemins, ici nous allons remplacer notre formulaire, modifier la classe dont elle hérite, et ajouter un formulaire pour
permettre la modification de notre utilisateur.

<div class="path">developer/forms.py</div>

``` python
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django import forms
from .models import Developer

class DeveloperForm(UserCreationForm):
    class Meta:
        model = get_user_model()
        fields = ('first_name', 'last_name', 'username', 'email',)

class DeveloperChangeForm(UserChangeForm):
    class Meta:
        model = get_user_model()
        fields = ('first_name', 'last_name', 'username', 'email')

```

#### Modification Admin de l'utilisateur

Nous allons maintenant modifier le fichier `developer/admin.py` afin de modifier les formulaires de création et de modification.
Pour cela, il est nécessaire de modifier les champs `add_form` et `form` hérité de la classe `UserAdmin`.

La méthode `get_user_model` permet d'importer le modèle d'utilisateur précédemment configuré dans le fichier `settings.py`.

<div class="path">developer/admin.py</div>

``` python
from django.contrib.auth import get_user_model    👈new 
from django.contrib.auth.admin import UserAdmin   👈new
from django.contrib import admin

from .forms import DeveloperForm, DeveloperChangeForm 👈new
from .models import Developer
from task.models import Task

class TaskInline(admin.TabularInline):
    model = Task
    extra = 1

#class DeveloperAdmin(admin.ModelAdmin):              👈old
class DeveloperAdmin(UserAdmin):                      👈new
    add_form = DeveloperForm                          👈new
    form = DeveloperChangeForm                        👈new
    model = get_user_model()                          👈new
    list_display = ('first_name', 'last_name', 'username', 'is_free') 👈Ajoutez 'username'
    inlines = [TaskInline]
```

#### Adaptation pour la commande createsuperuser

Enfin, un super utilisateur est un utilisateur comme les autres. Il est donc important d'ajouter le prénom et le nom d'un super utilisateur lors de sa création (c'est-à-dire lors de l'appel à `createsuperuser`).

<div class="path">developer/models.py</div>

``` python
#...
class Developer(AbstractUser):
    first_name = models.CharField("first name", max_length=200)
    last_name = models.CharField(max_length=200)

    REQUIRED_FIELDS=['first_name', 'last_name'] 👈 new

    def is_free(self):
        return self.tasks.count() == 0
#...
```

Faites la migration et testez la création d'un nouveau super utilisateur. Vous devriez avoir le nom et prénom qui fait dorénavant partie des données requises.

#### Correction du formulaire de création de développeur

Si vous essayez de créer un développeur, vous verrez que de nombreux champs se sont ajoutés au formulaire. Essayez ! ⭐️ Ceci est tout à fait normal puisqu'un développeur est un utilisateur. Les champs `username` ; `email` ; `password`... sont ainsi demandés. Nous allons donner un autre formulaire afin de créer un développeur avec les données minimales à leur gestion.

Ajoutez un formulaire simplifié lié directement au modèle développeur.

<div class="path">developer/forms.py</div>

``` python
#...
class ShortDeveloperForm(forms.ModelForm):              👈new
   class Meta:                                          👈new
       model = Developer                                👈new
       fields = ['first_name', 'last_name', 'username'] 👈new
#...
```

Et enfin, n'oubliez pas que ce formulaire est traité lors de la création d'un développeur et envoyé lorsque la vue `index` des développeurs est demandée. Modifiez la vue afin que le champ `username` soit également considéré.

<div class="path">developer/views.py</div>

``` python
#...
#from .forms import DeveloperForm                 👈old
from .forms import ShortDeveloperForm             👈new
#...
class IndexView(ListView):
    model = Developer
    template_name = "developer/index.html"
    context_object_name = 'developers'

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        #context['form'] = DeveloperForm            👈old
        context['form'] = ShortDeveloperForm        👈new

#...

def create(request):
    form = ShortDeveloperForm(request.POST)         👈 update

    if form.is_valid():
        Developer.objects.create(
            first_name=form.cleaned_data['first_name'],
            last_name=form.cleaned_data['last_name'],
            username=form.cleaned_data['username'], 👈new
        )
#...
```

Testez la création d'un développeur au sein de votre projet (sans passer par l'interface d'administration) et vérifiez la création de l'utilisateur dans l'interface d'administration. Si vous voulez, vous pouvez ajouter un mot de passe à ce nouveau développeur.

D'un point de vue utilisateur, votre projet fonctionne comme avant (exception faite du champ `username`). Mais grâce à nos ajouts, nous pouvons maintenant passer à la gestion de la connexion et des permissions.

> 📃
> Dans la vue, nous avons laissé la création d'un développeur grâce à la fonction
> `Developer.objects.create(...)`. Si vous souhaitez créer un utilisateur avec tous les champs requis, il est alors nécessaire d'utiliser la fonction `Developer.objects.create_user(...)`.