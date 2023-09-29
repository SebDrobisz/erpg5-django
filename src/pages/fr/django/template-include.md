---
title: Inclusion d'un gabarit
description: 
layout: ../../../layouts/MainLayout.astro
---

On peut imaginer que pour une utilisation normale de l'application, l'ajout d'un développeur se fait de manière occasionnelle.

Nous allons donc vous proposer de cacher ce formulaire dans un _Modal_, mis joliment en forme et le rendre réutilisable.

## Modal

Un modal est une sorte de boîte de dialogue qui est affichée devant la page courante lorsqu'un évènement survient ou que l'utilisateur en fait la demande. Avant de le rendre réutilisable, ajoutons-le dans le gabarit `index.html`.

<div class="path">developer/index.html</div>

``` html
- <form action="{% url 'developer:create' %}" method="post"> 
-    {% csrf_token %} 
-    {{ form }} 
-    <button type="submit">Create</button>
- </form>

+ <!-- Ajout d'un bouton pour faire apparaître la boîte de dialogue -->
+ <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-dev-modal">
+     Add user
+ </button>
+
+ <!-- Ajout du modal contenant le formulaire -->
+ <div class="modal fade " id="add-dev-modal">
+     <div class="modal-dialog">
+         <div class="modal-content">
+             <div class="modal-header">
+                 <h4 class="modal-title">New developer</h4>
+                 <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
+             </div>
+             <div class="modal-body">
+                 <form action="{% url 'developer:create' %}" method="post">
+                     {% csrf_token %}
+                     {{ form }}
+                     <div>
+                         <button class="btn btn-primary" type="submit">Créer</button>
+                     </div>
+                 </form>
+             </div>
+         </div>
+     </div>
+ </div>
```

## Modal et respect du DRY

Il est fort probable que l'ajout d'un utilisateur puisse se faire à partir de plusieurs fenêtres. Et même si cela ne se produit pas dans ce projet, il reste de bonne pratique de le supposer.

Nous allons donc extraire celui-ci afin de pouvoir le réutilise plus tard, dans un autre gabarit, si besoin en est.

Dans le dossier `developer/templates`, ajoutez un nouveau gabarit `_create_dev_modal.html`. Comme discuté précédemment, le nom de notre nouveau gabarit commence par un `_`. En effet, celui-ci ne sera jamais utilisé indépendamment.

Copiez-y tout le code que vous venez d'ajouter dans le fichier `developer/index.html`.

<div class="path">developer/template/developer/_create_dev_modal_.html</div>

``` html
   <!-- Ajout d'un bouton pour faire apparaître la boîte de dialogue  -->
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-dev-modal">
        Add user
    </button>

    <!-- Ajout du modal contenant le formulaire -->
    <div class="modal fade " id="add-dev-modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">New developer</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form action="{% url 'developer:create' %}" method="post">
                        {% csrf_token %}
                        {{ form }}
                        <div>
                            <button class="btn btn-primary" type="submit">Créer</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div> 
```

Dans `developer/index.html`, remplacez tout ce code par l'inclusion du fichier `developer/_create_dev_modal.html`. L'inclusion se fait grâce à la balise `{% include '<nom du fichier>' %}`.

<div class="path">developer/index.html</div>

```html
      #...
      </ul>
      {% else %}
          <p><strong>Il n'y a aucun développeur enregistré !</strong>/p>
      {% endif %}
  
-     <!-- enlever tout le code html lié au modal -->
+     {% include 'developer/_create_dev_modal.html' %}
  {% endblock content %}
```

## Crispy

Si vous avez bien suivi le tutoriel jusqu'à maintenant, vous avez peut-être choisi d'utiliser `{{ form.as_p }}` ou une alternative pour avoir un formulaire mis en forme.

Dans Django, il est possible d'ajouter facilement des apps externes. Nous allons illustrer cela par l'ajout d'une app nommée Crispy. Elle permet de rendre un peu plus joli les formulaires.

1. Installez le module. Pour cela, saisissez la commande 
  ``` bash 
  python -m pip install crispy-bootstrap5
  ```
2. Ajoutez `crispy-forms` aux applications installées
   
   <div class="path">mproject/settings.py</div>

```python
  INSTALLED_APPS = [                 
      #...
      'django.contrib.staticfiles',
      #My apps
      'developer.apps.DeveloperConfig',
+     #Third-party app       
+     'crispy_forms',
+     "crispy_bootstrap5",
  ]
```
3. Configurez le pack à utiliser en ajoutant les variables suivantes à la fin du fichier.

<div class="path">mproject/settings.py</div>

``` python
  # ...

+ # CRISPY FORM CONFIGURATION
+ CRISPY_ALLOWED_TEMPLATE_PACKS = "bootstrap5"
+ CRISPY_TEMPLATE_PACK = 'bootstrap5'
```

4. Modifiez `{{ form }}` ou (`{{ form.as_qqc }}`) par `{{ form|crispy }}` et enfin, chargez le tag crispy dans votre template formulaire. Cela se fait grâce à la balise `{% load %}`.

<div class="path">developer/template/developer/_create_dev_modal_.html</div>
   
```html    
+ {% load crispy_forms_tags %}
  
  <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#add-dev-modal">Add user</button>
  
  #...

-                     {{ form.as_p }}
+                     {{ form|crispy }}
  
  #...
```

Votre formulaire propre et réutilisable est terminé.
