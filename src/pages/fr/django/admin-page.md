---
title: Page d'administration
description: 
layout: ../../../layouts/MainLayout.astro
---

Vous voici presque à la fin de ce tutoriel. Les dernières parties permettent la gestion des utilisateurs.

## Page d'administration et super utilisateur

Vous vous êtes sûrement demandé à quoi servait les fichiers `admin.py` ? Celui-ci permet de configurer la page d'administration de notre projet. Nous aurions
pu le décrire plus tôt, mais vous auriez trop vite délaissé le `shell`.

Nous allons donc commencer par créer un super utilisateur. Saisissez la commande suivante et remplissez le formulaire.

```
$ python manage.py createsuperuser
```

Redémarrez le serveur et rendez-vous sur la page `localhost:8000/admin` ; connectez-vous et explorez un peu.

Maintenant que vous avez découvert la page d'administration, nous allons configurer les fichiers `admin.py` de l'application `developer` et `task`.

Modifiez les fichiers `admin.py` avec les codes respectifs ci-dessous.

<div class="path">developer/admin.py</div>

```python
from .models import Developer

admin.site.register(Developer)
```

<div class="path">task/admin.py</div>

```python
from .models import Task

admin.site.register(Task)
```

Retournez sur la page administration et vérifiez l'ajout de l'administration des développeurs et des tâches.

À noter ici :

* Le formulaire est généré automatiquement à partir des modèles `Developer` et `Task`.

* Les différents types de champs du modèle (`DateTimeField`, `CharField`) correspondent au composant graphique d’entrée HTML approprié. Chaque type de champ possède son propre [widget](https://docs.djangoproject.com/fr/4.1/ref/forms/widgets/) dans l’interface d’administration de Django.

La partie inférieure de la page vous propose une série d’opérations :

* Enregistrer – Enregistre les modifications et retourne à la page liste pour modification de ce type d’objet.
* Enregistrer et continuer les modifications – Enregistre les modifications et recharge la page d’administration de cet objet.
* Enregistrer et ajouter un nouveau – Enregistre les modifications et charge un nouveau formulaire vierge pour ce type d’objet.
* Supprimer – Affiche une page de confirmation de la suppression.

> Vous pouvez configurer votre projet en français. Dans le fichier `settings.py`, modifiez le champ `LANGUAGE_CODE = 'fr'`. Vous trouverez l'ensemble des langues supportées [ici](https://github.com/django/django/blob/master/django/conf/global_settings.py).

## Configuration de la page admin.

Nous n'allons pas rentrer dans les détails ici, juste vous proposer deux modifications appropriées.

La première et de rendre visible les tâches dans la vue développeur.

Modifiez le code comme ceci :

<div class="path">developer/admin.py</div>

``` python
# ...
from task.models import Task                    👈 new

class TaskInline(admin.TabularInline):          👈 new
    model = Task                                👈 new
    extra = 1                                   👈 new

class DeveloperAdmin(admin.ModelAdmin):         👈 new
    inlines = [TaskInline]                      👈 new

admin.site.register(Developer, DeveloperAdmin)  👈 update
```

Enfin, lorsque vous affichez la **liste** des développeurs ou des tâches, vous voyez ce qui a été défini dans la méthode `__str__()`. C'est bien, mais on peut faire mieux.

Modifier les fichiers afin de détailler les champs que vous souhaitez lister.

<div class="path">task/admin.py</div>

```python
from .models import Task

class TaskAdmin(admin.ModelAdmin):          👈new
    list_display = ('title', 'description') 👈new

admin.site.register(Task, TaskAdmin)        👈 update
```

et 

<div class="path">developer/admin.py</div>

``` python
class DeveloperAdmin(admin.ModelAdmin):
   list_display = ('first_name', 'last_name', 'is_free') 👈new
   inlines = [TaskInline]
```

Si vous êtes attentif, vous avez remarqué que `is_free` n'est pas un champ à proprement parlé, mais une méthode. Nous appelons cela un _attribut calculé_.

Vous pouvez également améliorer l'affichage en indiquant que le champ `is_free` est un champ booléen. On peut par la même occasion modifier le label du champ.

<div class="path">developer/models.py</div>

```python
class Developer(models.Model):
   first_name = models.CharField("first name", max_length=200)
   last_name = models.CharField(max_length=200)

   def is_free(self):
       return self.tasks.count() == 0
   
   def __str__(self):
       return f"{self.first_name} {self.last_name}"

   is_free.boolean = True             👈new
   is_free.short_description = 'Free' 👈new
```

> ⚠️ Vous n'avez pas besoin de réaliser une migration pour cette étape. En effet, le fichier modèle a été modifié, mais aucun champ n'est impacté par les changements.

Nous avons modifié le minimum de la page d'administration, mais vous pouvez configurer davantage votre page d'administration. 
En utilisant les décorateurs par exemple : 

<div class="path">task/admin.py</div>

``` python
@admin.register(Task)                       👈 new
class TaskAdmin(admin.ModelAdmin):         
    list_display = ('title', 'description')

#admin.site.register(Task, TaskAdmin)       👉 old
```

Voici un peu de lecture
* [Tutoriel admin](https://docs.djangoproject.com/fr/4.1/intro/tutorial07/) 📖
* [Doc admin](https://docs.djangoproject.com/fr/4.1/ref/contrib/admin/) 📖
* [Action admin](https://docs.djangoproject.com/fr/4.1/ref/contrib/admin/actions/) 📖
