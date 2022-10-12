---
title: Amélioration des pages développeurs
description: 
layout: ../../../layouts/MainLayout.astro
---

Prenons un peu de temps pour améliorer le rendu de nos pages web.

## Index des développeurs

Premier chantier, la page qui liste l'ensemble des développeurs.

### Cas aucun développeur

Dans le cas où il n'y a pas de développeur, vous devriez avoir le message `Il n'y a aucun dévelopeur enregistré` d'affiché sur la page.

Nous allons le mettre légèrement en forme.

<div class="path">developer/templates/developer/index.html</div>

``` python
<div class="container m-4">
    <alert class="alert alert-warning">Il n'y a aucun développeur enregistré</alert>
</div>
```

Vérifiez le résultat.

### Cas au moins 1 développeur

Maintenant ajoutez au moins 2 développeurs.

Modifiez le rendu de ceux-ci.

<div class="path">developer/templates/developer/index.html</div>

``` html
{% if developers %}
    <div class="container-sm l-3 d-flex flex-wrap border">
        {% for dev in developers %}
        <div class="card bg-primary m-2 p-1 rounded-lg" style="width:300px">
            <div class="card-title">
                {{ dev.first_name }} {{ dev.last_name }}
            </div>
            <div class="card-body">
                {{ dev.tasks.all|length }} tâche{{ dev.tasks.all|length|pluralize }}
            </div>
            <div class="card-footer">
                <a href="{% url 'developer:detail' dev.id %}" class="btn btn-outline-light">Détails</a>
            </div>
        </div>
        {% endfor %}
    </div>
{% else %}
```

Remarquez la ligne 

``` html
{{ dev.tasks.all|length }} tâche{{dev.tasks.all|length|pluralize}}
```

* `{{ dev.tasks.all|length }}` permet d'afficher le nombre de tâches.
* `tâche{{developer.tasks.all|length|pluralize}}` permet de mettre le mot tâche au pluriel si le développeur en a plusieurs (ou 0).

## Détails des développeurs

<div class="path">developer/detail.html</div>

```html
{% block content %}
    <div class="mt-4 p-5 bg-white rounded">
        <h1>{{ developer.first_name }} {{ developer.last_name }} </h1>
        <p>{{ developer.tasks.all|length }} tâche{{developer.tasks.all|length|pluralize}} assignée{{developer.tasks.all|length|pluralize}}.</p>
    </div>
{% endblock content %}
```

C'est terminé, ajoutez une tâche à un développeur afin de vérifier que le nombre de tâches assignées est bien amandé.

Profitons-en pour afficher les tâches d'un développeur dans la vue détail.

<div class="path">developer/detail.html</div>

```html
#...

<div class="container-sm">
    {% if not developer.is_free %}
        <ul class="list-group">
            {% for task in developer.tasks.all %}
            <li class="list-group-item"> 
                <strong>{{ task.title }}!</strong> {{ task.description }} 
            </li>
            {% endfor %}
        </ul>
    {% else %}
        <div class="alert alert-danger">
            Aucune tâche n'est assignée à {{ developer.first_name }}.
        </div>
    {% endif %}
</div>
{% endblock content %}
```

## Suppression des développeurs

Tout d'abord, ajoutez le code ci-dessous.

<div class="path">developer/detail.html`</div>

``` html
  <div class="mt-4 p-5 bg-white rounded">
+     <form action="{% url 'developer:delete' developer.id %}" method="POST"> 
+         {% csrf_token %} 
+         <button type="submit" class="btn btn-light btn-sm"> 
+             <i class="fa fa-trash"></i>
+         </button>
+     </form>
      <h1>{{ developer.first_name }} {{ developer.last_name }} </h1>
      <p>{{ developer.tasks.all|length }} tâche{{developer.tasks.all|length|pluralize}} assignée{{developer.tasks.all|length|pluralize}}.</p>
  </div>
```

Ce code a pour objectif d'ajouter une petite corbeille près du nom d'un développeur afin de permettre sa suppression.

> *_✏️ Exercice_*
> 
> 1. Inspirez-vous des vues existantes afin de permettre la suppression d'un développeur. Lors de la suppression, redirigez vers l'index des développeurs.
> 1. Ajoutez le chemin adéquat
> 1. Testez

> Que se passe-t-il pour les tâches qui étaient assignées ? Amendez le code afin qu'une tâche assignée à un développeur ne soit plus supprimée.
