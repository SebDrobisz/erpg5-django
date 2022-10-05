---
title: Gestion des tâches
description:
layout: ../../../layouts/MainLayout.astro
---

Nous allons maintenant ajouter la gestion des tâches. Attention, nous allons installer les bases ensemble, vous ferez le reste seul.

### App Task

Actuellement, les tâches (`Task`) sont dans le modèle `developer`. Nous avons choisi cela afin de rentrer plus rapidement dans la matière.

⭐️ Commencez par créer et ajouter une nouvelle application `task` et ensuite, déplacez le modèle de `Task` dans cette nouvelle application.

### Ajout d'une nouvelle vue index

#### Ajout de la liste des tâches

⭐️ Inspirez-vous de ce qui a déjà été fait pour ajouter une nouvelle vue qui permet uniquement d'afficher la liste de toutes les tâches. Si un développeur est assigné à une tâche, son nom doit apparaître à côté. Sinon, il doit être indiqué qu'elle n'est pas assignée.

#### Activer le bon lien

Si vous avez prêté attention, le lien activé dans le menu de navigation reste celui des développeurs. C'est normal puisque nous ne l'avons pas changé.

Pour faire cela, nous allons utiliser un gabarit de base pour les applications, mais avant, ajoutons un bloc au gabarit de base du projet.

<div class="path">templates/_base.html</div>

``` html
    #...
    {% block content %}
    {% endblock content %}

    <script>
        {% block menu-script %}
            $("#nav-home").addClass('active')
            $("#nav-dev").removeClass('active')
            $("#nav-task").removeClass('active')
        {% endblock menu-script %}
    </script>
</body>
```

Dans ce bloc, nous ajoutons un peu de JQuery nous permettant d'activer le bon lien. Par défaut, c'est naturellement le lien home qui doit être activé.

Dans le dossier `templates/task` ajoutez maintenant un nouveau gabarit nommé `_base.html`
Celui-ci doit étendre le gabarit du projet et activer le bon lien.

<div class="path">task/templates/task/_base.html</div>

 
```html
{% extends "_base.html" %}

{% block title %}GProject - Gestion des tâches{% endblock title %}

{% block menu-script %}
    $("#nav-home").removeClass('active')
    $("#nav-dev").removeClass('active')
    $("#nav-task").addClass('active')
{% endblock menu-script %}
```

Et enfin, le gabarit `templates/task/index.html` doit hériter de ce nouveau template. Attention, puisqu'il y a
maintenant deux gabarits nommé `_base.html`, il faut bien indiquer l'application.

<div class="path">task/templates/task/index.html</div>

```html
{% extends "_base.html" %}        👈old
{% extends "task/_base.html" %}   👈new
```

Voilà, c'est terminé, mais dans ce processus, vous pourrez remarquer que le lien ne s'active plus lorsque nous cliquons sur l'onglet `developers`. C'est normal... Il faut également ajoutez un gabarit de base à cette application... Faites-le ! N'oubliez pas qu'il y a deux vues à adapter! ⭐️

### Suppression d'une tâche

Modifiez le code `templates/task/index.html` en ajoutant ces quelques lignes : 

<div class="path">task/templates/task/index.html</div>

``` html
#...
<li class="list-group-item">
   <form action="{% url 'task:delete' task.id %}" method="post">
       {% csrf_token %}
       <button class="close" type="submit"><i class="fa fa-trash"></i></button>
   </form>
#...
```

Ce bout de code permet d'ajouter une corbeille pour supprimer une tâche.

⭐️ Ajoutez le code nécessaire afin d'ajouter la fonctionnalité de suppression de tâches.

### Création d'une tâche

#### Dans la page d'index des tâches

⭐️ On vous donne un petit coup de pouce et le reste est dans vos mains.

> 🐇 Précédemment, vous avez créé un formulaire pour la création de développeur. Vous allez devoir faire la même chose ici. Le champ `assignee` pourra vous poser problème. Le voici
> ```python
> assignee = forms.ModelChoiceField(queryset=Developer.objects.all(), required=False)
> ```
> 
> Vous trouverez davantage de doc sur le `ModelChoiceField` [ici](https://docs.djangoproject.com/fr/3.1/topics/forms/modelforms/).

Si vous utilisez l'héritage de `FormModel`, ce sera encore plus facile.

#### Dans le détail d'un dévelopeur

⭐️ Ajoutez la possibilité de créer une tâche dans la vue détail d'un développeur. Lorsqu'une tâche sera créé, l'utilisateur sera redirigé vers l'index des tâches. Ce n'est pas optimal, mais nous ferons avec.
* Il serait agréable que le formulaire soit pré-rempli au niveau du développeur assigné. Lisez la documentation des formulaires (paramètre `initial`).
* Il serait aussi bien de ne pas exposer l'utilisateur à une erreur possible. Désactivez le champ pour que celui-ci ne soit pas modifiable. Attention, un champ désactivé n'est pas envoyé dans les données `POST`.