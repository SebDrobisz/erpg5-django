---
title: Les tests
description: 
layout: ../../../layouts/MainLayout.astro
---

Avant d'aller plus loin, il est temps de procéder à la rédaction de tests.

Si vous vous posez la question de ce qu'est des tests automatisés, quelle est leur utilité ou encore quelle stratégie mettre en œuvre pour élaborer les tests. Alors commencez par lire l'introduction de [ce tutoriel](https://docs.djangoproject.com/fr/4.1/intro/tutorial05/).

## Tests du modèle

Avant de commencer les tests, nous allons ajouter un brin de matière à tester.

Dans `developer.models.py`, ajoutez une méthode qui permet de vérifier si un développeur est libre de toute tâche.

<div class="path">developer/models.py</div>

```python
class Developer(models.Model):
   first_name = models.CharField("first name", max_length=200)
   last_name = models.CharField(max_length=200)

   def is_free(self):                  👈 new
       return self.tasks.count() == 0  👈 new

   def __str__(self):
       return f"{self.first_name} {self.last_name}"
```
### `tests.py`

Un endroit conventionnel pour placer les tests d’une application est le fichier tests.py dans le répertoire de l’application. Cependant, le système de test va automatiquement trouver les tests dans tout fichier dont le nom commence par test.

Placez ce qui suit **dans une classe** `DeveloperModelTests` qui hérite de la classe `TestCase` déjà importée dans le fichier `tests.py` de l’application `developer` :

<div class="path">developer/tests.py</div>

``` python
def test_is_free_with_no_tasks(self):
    """
    is_free() returns True for developer with no
    tasks.
    """

    dev = Developer.objects.create(first_name="Sébastien", last_name="Drobisz")
    self.assertIs(dev.is_free(), True)

def test_is_free_with_one_tasks(self):
    """
    is_free() returns False for developer with at least one
    tasks.
    """

    dev = Developer.objects.create(first_name="Sébastien", last_name="Drobisz")
    dev.tasks.create(title="cours Django", description="Faire le cours sur Django")
    self.assertIs(dev.is_free(), False)
```

Nous venons ici de créer une sous-classe de `django.test.TestCase` contenant 

* une première méthode qui crée une instance `Developer` avec des données quelconques. Nous vérifions ensuite le résultat de `is_free()` qui devrait valoir `True`.
* Une seconde méthode qui crée une même instance de `Developer`. Nous lui assignons cette fois-ci la tâche d'écrire le cours sur Django. Enfin, nous vérifions le résultat de la méthode `is_free()` qui devrait cette fois-ci valoir `False`.


**Après avoir importé les modèles** `Developer` et `Task`, lancez les tests.

```
$ python manage.py test developer
```

Voici ce qui s’est passé :

* La commande `manage.py test developer` a cherché des tests dans l’application `developer` ;
* elle a trouvé une sous-classe de `django.test.TestCase` ;
* elle a créé une base de données spéciale uniquement pour les tests ⚠️;
* elle a recherché des méthodes de test, celles dont le nom commence par test ;
* dans `test_is_free_with_no_tasks`, elle a créé une instance de `Developer` ;
* et à l’aide de la méthode assertIs(), elle a pu vérifier son bon fonctionnement.

Si le test avait échoué, (vous pouvez essayer), le test nous indique alors le nom du test qui a échoué ainsi que la ligne à laquelle l'échec s'est produit.

### Fonction `setUp`

Vous pouvez initialiser certains éléments avant de réaliser les tests. Cela évite de réaliser plusieurs fois la même instanciation.

Cela se fait grâce à la méthode `setUp()`.

<div class="path">developer/tests.py</div>

``` python
def setUp(self):                                                            👈 new
    Developer.objects.create(first_name="Sébastien", last_name="Drobisz")   👈 new

#...
    #dev = Developer.objects.create(first_name="Sébastien", last_name="Drobisz") 👈 old
    dev = Developer.objects.get(first_name="Sébastien") 👈 new
    self.assertIs(dev.is_free(), True)

#...
    #dev = Developer.objects.create(first_name="Sébastien", last_name="Drobisz") 👈 old
    dev = Developer.objects.get(first_name="Sébastien") 👈 new
```

Pour plus d'informations sur la configuration des tests, vous pouvez lire [ce lien](https://docs.djangoproject.com/fr/4.1/topics/testing/overview/).

## Tests de la vue

Django fournit un _Client_ de test pour simuler l’interaction d’un utilisateur avec le code au niveau des vues. On peut l’utiliser dans `tests.py` ou même dans le shell.

### Tests de la vue dans le shell

Nous commencerons encore une fois par le shell, **où nous devons faire quelques opérations qui ne seront pas nécessaires dans `tests.py`**. La première est de configurer l’environnement de test

#### Mise en place de l’environnement de test

``` python
>>> from django.test.utils import setup_test_environment
>>> setup_test_environment()
```

`setup_test_environment()` installe un moteur de rendu de gabarit qui va nous permettre d’examiner certains attributs supplémentaires des réponses, tels que `response.context` qui n’est normalement pas disponible. Notez que cette méthode ne crée pas de base de données de test, ce qui signifie que ce qui suit va être appliqué à la base de données existante et que par conséquent, le résultat peut légèrement différer en fonction des développeurs que vous avez déjà créées.

> 📃Si vous obtenez une erreur étrange du style "Invalid HTTP_HOST header: 'testserver'. You may need to add 'testserver' to ALLOWED_HOSTS.". Alors vous avez probablement oublié la mise en place de l'environement de test

#### Import d'un client de test

Ensuite, il est nécessaire d’importer la classe Client de test ( ⚠️ plus loin dans `tests.py`, nous utiliserons la classe `django.test.TestCase` qui apporte son propre client, ce qui évitera cette étape) 

```python
>>> from django.test import Client
>>> client = Client()
```

Nous pouvons maintenant demander au client de faire certaines tâches pour nous :

``` python
>>> response = client.get('/')
Not Found: /
# Investiguons.
>>> response.status_code
404 # la page n'a pas été trouvée (https://www.rfc-editor.org/rfc/rfc2616).
from django.urls import reverse
>>> response = client.get(reverse('developer:index'))
>>> response.status_code
200
>>> response.content
#Le code Html de la page est affiché...
>>> response.context ['developers']
<QuerySet [<Developer:.....]>
```

### Tests automatiques de la vue

#### Tests de `IndexView`

<div class="path">developer/tests.py</div>

```python
class DeveloperIndexViewTests(TestCase):
    def test_no_developers(self):
        """
        If no developers exist, an appropriate message is displayed.
        """
        response = self.client.get(reverse('developer:index'))
        self.assertEquals(response.status_code, 200)
        self.assertContains(response, "Il n'y a aucun développeur enregistré !")
        self.assertQuerysetEqual(response.context['developers'], [])
```

Dans le premier test, nous vérifions que la page existe bel et bien, qu'un message indiquant l'absence de développeur est affiché et que la variable `developer` du contexte est vide.

📃 Les tests sont faits dans un ordre logique permettant de déterminer directement la source de l'erreur !

Dans le second test, nous vérifions que le prénom du développeur est bien affiché.

<div class="path">developer/tests.py</div>

```python
def test_one_developer(self):
"""
A developer is displayed on the index page.
"""
dev = Developer.objects.create(
    first_name="Jonathan",
    last_name="Lechien")
response = self.client.get(reverse('developer:index'))
self.assertEquals(response.status_code, 200)
self.assertQuerysetEqual(response.context['developers'],
    [dev])
self.assertContains(response, dev.first_name)
```

#### Tests de `DevDetailView`

Nous allons faire deux tests afin de vérifier la vue d'un développeur.

1. Un premier qui permet de vérifier que le nom et le prénom d'un développeur est bien affiché
2. Un deuxième qui permet de vérifier qu'une page 404 est proposée si le développeur recherché n'existe pas.

<div class="path">developer/tests.py</div>

```python
class DevDetailView(TestCase):
 def test_existing_developer(self):
     """
     The detail view of a developer displays the developer's text.
     """
     dev = Developer.objects.create(
         first_name="Jonathan",
         last_name="Lechien")
     url = reverse('developer:detail', args=(dev.id,))
     response = self.client.get(url)
     self.assertEquals(response.status_code, 200)
     self.assertEquals(response.context['developer'], dev)
     self.assertContains(response, dev.first_name)
     self.assertContains(response, dev.last_name)

 def test_non_existing_developer(self):
     """
     The detail view of a non existing developer should return 404 status_code response.
     """
     url = reverse('developer:detail', args=(1,))
     response = self.client.get(url)
     self.assertEquals(response.status_code, 404)
```
