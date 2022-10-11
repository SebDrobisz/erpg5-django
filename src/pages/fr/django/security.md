---
title: Sécurité
description: 
layout: ../../../layouts/MainLayout.astro
---

Pour terminer notre site, nous allons limiter l'accès à certaines pages aux utilisateurs connectés. Enfin, certains utilisateurs auront certaines permissions pour la gestion des tâches.

## Limiter l'accès aux utilisateurs

Nous allons empêcher aux utilisateurs non connectés d'accéder aux pages

* liste des développeurs,
* détail d'un développeur et
* liste des tâches.

Grâce aux mixins, c'est sans doute l'une des étapes les plus simples. Il suffit que les vues héritent du mixin `LoginRequiredMixin` pour que cela fonctionne comme souhaité.

<div class="path">developer/views.py</div>

``` python
from django.contrib.auth.mixins import LoginRequiredMixin   👈 new

#...

class IndexView(LoginRequiredMixin, ListView):              👈 ajout de LoginRequiredMixin

#...

class DevDetailVue(LoginRequiredMixin, DetailView):         👈 ajout de LoginRequiredMixin

#...
```

<div class="path">task/views.py</div>

``` python
from django.contrib.auth.mixins import LoginRequiredMixin   👈 new

#...  

class IndexView(LoginRequiredMixin, generic.ListView):      👈 ajout de LoginRequiredMixin

#...  
```

Remarques :

* Si l'utilisateur n'est pas connecté, il sera redirigé automatiquement vers la page de login.

* On place le mixin `LoginRequiredMixin` **avant** les autres mixins. En effet, les mixins sont chargés dans l'ordre donné. Si l'utilisateur n'est pas connecté, il est inutile de charger les autres mixins.

## Permissions de gestion des tâches

Nous voici dans la toute dernière ligne droite. Nous allons ajouter le droit à certains utilisateurs de gérer les tâches.

Si vous avez prêté attention à la page admin des utilisateurs (développeurs), vous avez remarqué qu'il est possible d'ajouter des permissions prédéfinies. Nous allons créer notre propre permission et l'utiliser.

### Permission d'accès à la vue

Cela se fait au niveau des modèles.

Modifiez le modèle `Task` comme ceci

<div class="path">task/models.py`</div>

``` python
class Task(models.Model):
    #...

    def __str__(self):
        return f"{self.title} ({self.description})"

    class Meta:
       permissions = [
           ('task_management', 'Can create, assign and delete tasks'),
       ]
```

Réalisez une migration. ⭐️ Dans quelle table trouvez-vous les différentes permissions ?

À nouveau, utilisons les mixins pour ajouter cette fonctionnalité. Celui qui nous intéresse est `PermissionRequiredMixin`.

Modifiez la vue index des tâches.

<div class="path">task/views.py</div>

```python
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin    👈 ajout de PermissionRequiredMixin
#...
class IndexView(LoginRequiredMixin, PermissionRequiredMixin, generic.ListView):       👈 ajout de PermissionRequiredMixin
    #...

    permission_required = 'task.task_management'                                      👈 new

    def get_context_data(self, **kwargs):
        # ...
```

Notez qu'il est nécessaire d'ajouter le champ `permission_required` avec la permission demandée.

> 📃 Encore une fois, faites attention à l'ordre de vos mixins !

> ⚠️ Attention, il est nécessaire de faire une migration du modèle.

Créez un utilisateur (non super utilisateur). Ajoutez un mot de passe et accordez-lui cette permission.
Créez un autre utilisateur (non super utilisateur). Ne lui accordez pas cette permission.

> Vérifiez le bon fonctionnement de votre projet.

### Permission pour le modal d'ajout de tâches

Il reste à empêcher d'accéder au bouton d'ajout de tâche dans le détail d'un développeur. Pour cela rien de plus simple, il suffit d'utiliser la variable de contexte `perms`

<div class="path"> task/_create_task_modal.html`</div>

```html
{% load crispy_forms_tags %}
{% if perms.task.task_management %}

#...

{% endif %}
```

Le tutoriel est terminé, mais vous pouvez encore améliorer votre projet. Quelques pistes d'amélioration : 

* Cacher les liens vers les pages `developeurs` et `tasks` aux visiteurs non connectés.
* Cacher le lien vers la page `tasks` aux utilisateurs qui n'ont pas la permission
* Permettre la modification d'une tâche
* ...

🎆🎆🎆🎆 FIN 🎆🎆🎆🎆
