---
title: Sécurité
description: 
layout: ../../../layouts/MainLayout.astro
---

#### Limiter l'accès aux utilisateurs connectés

Nous allons empêcher l'accès aux utilisateurs non connectés aux pages d'index des développeurs et des tâches ainsi qu'à la page de détail d'un développeur.

Grâce aux mixins, c'est sans doute l'une des étapes les plus simples. Il suffit que les vues héritent du mixin `LoginRequiredMixin` pour que cela fonctionne comme souhaité.

> `developer/views.py`
> 
> ``` python
> from django.contrib.auth.mixins import LoginRequiredMixin 👈 new
> #...
> 
> class IndexView(LoginRequiredMixin, ListView):
> #...
> 
> class DevDetailVue(LoginRequiredMixin, DetailView):
> #...
> ```

> `task/views.py`
> 
> ``` python
> from django.contrib.auth.mixins import LoginRequiredMixin 👈 new
> #...
> class IndexView(LoginRequiredMixin, generic.ListView):
> ```

Remarques :

* Si l'utilisateur n'est pas connecté, alors il sera redirigé automatiquement vers la page de login.
* On place le mixin `LoginRequiredMixin` avant les autres mixins. En effet, les mixins sont chargés dans l'ordre donné. Si l'utilisateur n'est pas connecté, il est inutile de charger les autres mixins.

#### Permissions

Nous voici dans la dernière ligne droite. Nous allons ajouter le droit à certains utilisateurs de gérer les tâches.

Si vous avez prêté attention à la page admin des utilisateurs (développeurs), vous avez remarqué qu'il est possible d'ajouter des permissions prédéfinies. Nous allons créer notre propre permission et l'utiliser.

Cela se fait au niveau des modèles.

Modifiez le modèle `Task` comme ceci

> `task/models.py`
> 
> ```python
> class Task(models.Model):
>    #...
>    assignee = models.ForeignKey(Developer, related_name="tasks", on_delete=models.CASCADE, null=True)
>
>    class Meta:
>        permissions = [
>            ('task_management', 'Can create, assign and delete tasks'),
>        ]
> ```

Réalisez une migration. ⭐️ Dans quelle table trouvez vous les différentes permissions ?

Utilisons à nouveau les mixins pour ajouter cette fonctionnalité. Celui qui nous intéresse est `PermissionRequiredMixin`.

Modifiez la vue index des tâches.

> `task/views.py`
> ```python
> from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin 👈 ajout de PermissionRequiredMixin
> #...
> class IndexView(LoginRequiredMixin, PermissionRequiredMixin, generic.ListView):
>     #...
>     permission_required = 'task.task_management' 👈 new
> ```

Notez qu'il est nécessaire d'ajouter le champ `permission_required` avec la permission qui est nécessaire.

📃 Encore une fois, prêtez attention à l'ordre de vos mixins !

Créez un utilisateur (non super utilisateur). Ajoutez un mot de passe et accordez lui cette permission.
Créez un autre utilisateur (non super utilisateur). Ne lui accordez pas cette permission.

Vérifiez le bon fonctionnement de votre projet.

Il reste à empêcher d'accéder au bouton d'ajout de tâche dans le détail d'un développeur. Pour cela rien de plus simple, il suffit d'utiliser la variable de contexte `perms`

> `task/_create_task_modal.html`
> ```html
> {% load crispy_forms_tags %}
> {% if perms.task.task_management %}
> #...
> {% endif %}
> ```

🎆🎆🎆🎆 FIN  🎆🎆🎆🎆
