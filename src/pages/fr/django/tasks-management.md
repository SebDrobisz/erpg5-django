---
title: Gestion des tâches
description:
layout: ../../../layouts/MainLayout.astro
---

Nous allons maintenant ajouter la gestion des tâches. Attention, nous allons installer les bases ensemble, vous ferez le reste seul.

## Création du modèle

Actuellement, les tâches (`Task`) sont dans le modèle `developer`. Nous avons choisi cela afin de rentrer plus rapidement dans la matière.

⭐️ Commencez par créer et ajouter une nouvelle application `task` et ensuite, déplacez le modèle de `Task` dans cette nouvelle application.

Pensez à :

* écrire la méthode `__str__(self)` ;
* ajouter l'application dans le fichier `settings.py` ;
* gérer la migration dans la base de donnée.

## Lister les tâches

⭐️ Inspirez-vous de ce qui a déjà été fait pour ajouter une nouvelle vue qui permet uniquement d'afficher la liste de toutes les tâches. Si un développeur est affecté à une tâche, son nom doit apparaître à côté. Sinon, il doit être indiqué qu'elle n'est pas assignée.

Pensez à :

* gérer la nouvelle URL (création d'un nouveau fichier `task/urls.py` et modification du fichier `mproject/urls.py`) ;
* utiliser une vue de type "classe" ;
* ajouter un nouveau gabarit (pensez à l'héritage de `_base`).

## Suppression d'une tâche

Pour chacune des tâches listées, ajoutez un bouton pour la supprimer.

<div class="path">task/templates/task/index.html</div>

``` html
#...
<li class="list-group-item">
    <form action="{% url 'task:delete' task.id %}" method="post">
        {% csrf_token %}
        <button class="close" type="submit"><i class="fa fa-trash"></i></button>
    </form>

    # ... 
```

Ce bout de code permet d'ajouter une corbeille pour supprimer une tâche.

⭐️ Ajoutez le code nécessaire afin d'ajouter la fonctionnalité de suppression de tâches.

## Création d'une tâche

Ajoutons la possibilité d'ajouter des tâches

1. dans la vue tâche,
1. dans la vue d'un développeur.

Après l'ajout d'une tâche, l'application redirige vers l'index des tâches.


### Dans la page d'index des tâches

⭐️ On vous donne un petit coup de pouce et le reste est dans vos mains.

> Précédemment, vous avez créé un formulaire pour la création de développeur. 
> * 🐇 En définissant un nouveau formulaire qui hérite de `forms.Form`.
>    Le champ `assignee` pourra vous poser problème. Le voici
>    ```python
>    assignee = forms.ModelChoiceField(queryset=Developer.objects.all(), required=False)
>    ```
>    Vous trouverez davantage de doc sur le `ModelChoiceField` [ici](https://docs.djangoproject.com/fr/4.1/topics/forms/modelforms/).
> * 🧙 Mais vous pouvez également utiliser l'héritage de `ModelForm` plutôt que de définir les champs du formulaire.

### Dans le détail d'un développeur

⭐️ Ajoutez la possibilité de créer une tâche dans la vue détail d'un développeur. Lorsqu'une tâche sera créée, l'utilisateur sera redirigé vers l'index des tâches. Ce n'est pas optimal, mais nous ferons avec.
* Il serait agréable que le formulaire soit prérempli au niveau du développeur assigné. Lors de l'ajout du formulaire dans le contexte de la page détail d'un développeur, ajoutez une valeur initiale pour le champ `assignee` du formulaire ([exemple](https://docs.djangoproject.com/en/4.1/ref/forms/api/#initial-form-values)).
* Il serait aussi bien de ne pas exposer l'utilisateur à une erreur possible. Désactivez le champ pour que celui-ci ne soit pas modifiable. Attention, un champ désactivé n'est pas envoyé dans les données `POST`.
   Aide : 

   * [Désactiver un champ](https://docs.djangoproject.com/en/4.1/ref/forms/fields/#disabled)
   * `<un formulaire>.fields` permet d'accéder aux champs d'un formulaire. Chaque clé représente le nom d'un champ et la valeur associé le champ lui-même (l'objet python).
   * En Python 🐍, il est possible d'ajouter des valeurs par défauts aux arguments. Exemple : `def create(request, developer_id=None):`
   * Pour qu'un champ ne soit pas obligatoire, il faut que son attribut `blank` soit mis à `True`.
   * Deux chemins (`path`) peuvent avoir le même nom, à condition d'avoir des motifs de route différents.
   * Pensez au concept DRY et à la manière dont nous avons créé le modal pour la création d'un développeur. Vous aurez besoin de `request.resolver_match.app_name` pour savoir si vous ajoutez la création d'une tâche à partir d'un développeur ou à partir de l'index des tâches.