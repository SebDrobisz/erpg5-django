---
title: Gestion des onglets actifs
description:
layout: ../../../../layouts/MainLayout.astro
---

Si vous avez prêté attention, le lien activé dans le menu de navigation reste celui des développeurs. C'est normal puisque nous ne l'avons pas changé.

Deux possibilités :

1. Par le contexte donné aux gabarits. Pour cela, il faut
   * ajouter le nom de l'onglet à activer dans le contexte des vues et
   * vérifier dans le gabarit `_base.html` quel est l'onglet qui doit être actif.
1. Accéder à l'espace nom accessible dans un gabarit grâce à 
   ```
    request.resolver_match.namespaces.0
   ```
   (⭐️ Dans `mproject/_base.html` ajoutez `<p>{{ request.resolver_match }}</p>` et vérifiez son contenu.)

## Gestion grâce au contexte

Dans cette section, nous allons implémenter grâce à la première option.

### Vues

#### Application `developer`

<div class="path">developer/views.py</div>

``` python
class IndexView(ListView): 

    # ...

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context['form'] = DeveloperForm      
        context['app'] = "developer"                               👈 new
        return context 

# ...

class DevDetailVue(DetailView):
    
    # ...

    def get_context_data(self, **kwargs):                           👈 new
        context = super(DetailView, self).get_context_data(**kwargs)👈 new
        context['app'] = "developer"                                👈 new
        return context                                              👈 new
```

#### Application `task`

<div class="path">task/views.py</div>

``` python
class IndexView(ListView):

    # ...

    def get_context_data(self, **kwargs):                           👈 new
        context = super(IndexView, self).get_context_data(**kwargs) 👈 new
        context['app'] = "task"                                     👈 new
        return context                                              👈 new
```

### Gabarit `_base`

Maintenant que le contexte a été ajouté dans chacune des vues, il est temps de vérifier quel onglet doit être actif.

<div class="path">templates/_base.html</div>

``` html
    <ul class="navbar-nav">
        <li id="nav-home" class="nav-item">
            <a class="nav-link" href="#"><i class="fa fa-home"></i></a>
        </li>
        <li id="nav-dev" class="nav-item">
            <a                                                                      👈 update
                class="nav-link {% if app == 'developer' %} active {% endif %}"     👈 update
                href="{% url 'developer:index' %}">Developers</a>                   👈 update
        </li>
        <li id="nav-task" class="nav-item">
            <a                                                                      👈 update
                class="nav-link {% if app == 'task' %} active {% endif %}"          👈 update
                href="{% url 'task:index' %}">Tasks</a>                             👈 update
        </li>
    </ul>
```

Essayez chacune de vos vues.

## Information de la requête.

Passons à la deuxième option.

<div class="path">templates/_base.html</div>

``` html
    <ul class="navbar-nav">
        <li id="nav-home" class="nav-item">
            <a class="nav-link" href="#"><i class="fa fa-home"></i></a>
        </li>
        <li id="nav-dev" class="nav-item">
            <a                                                                                                      👈 update
                class="nav-link {% if request.resolver_match.namespaces.0 == 'developers' %} active {% endif %}"    👈 update
                href="{% url 'developer:index' %}">Developers</a>                                                   👈 update
        </li>
        <li id="nav-task" class="nav-item">
            <a                                                                                                      👈 update
                class="nav-link {% if request.resolver_match.namespaces.0 == 'tasks' %} active {% endif %}"         👈 update
                href="{% url 'task:index' %}">Tasks</a>                                                             👈 update
        </li>
    </ul>
```

Essayez chacune de vos vues.