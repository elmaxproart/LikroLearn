export interface Lesson {
  id: string; // e.g., '1-1'
  moduleId: number;
  titleFr: string;
  titleEn: string;
  duration: string;
  contentFr: string;
  contentEn: string;
  attachmentUrl?: string;
  attachmentName?: string;
  explanationFr?: string;
  explanationEn?: string;
  exercise: {
    questionFr: string;
    questionEn: string;
    lang: 'js' | 'c' | 'react' | 'java' | 'springboot' | 'php' | 'python';
    initialCode: string;
    testCases: Array<{
      input: string;
      expected: string;
    }>;
    solutionTemplate: string;
  };
}

export interface Module {
  id: number;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  author: string;
  difficultyFr: string;
  difficultyEn: string;
  imageUrl: string;
  category: 'algo' | 'front' | 'back' | 'web' | 'oop' | 'python';
  modules: Module[];
}

export const COURSES: Course[] = [
  {
    id: "algo-101",
    titleFr: "Algorithmique & Fondamentaux de Programmation (JS & C)",
    titleEn: "Algorithmics & Programming Fundamentals (JS & C)",
    descriptionFr: "Le programme de référence de Lickrotechnologie pour maîtriser la logique algorithmique, concevoir des logigrammes et implémenter en JS et C.",
    descriptionEn: "Lickrotechnologie's flagship program to master algorithmic logic, design flowcharts, and implement them in JS and C.",
    author: "Tene Bana Maxym",
    difficultyFr: "Débutant",
    difficultyEn: "Beginner",
    imageUrl: "/algo_course_cover.png",
    category: "algo",
    modules: [
      {
        id: 1,
        titleFr: "Introduction à l'Algorithmique et aux Logigrammes",
        titleEn: "Introduction to Algorithms and Flowcharts",
        descriptionFr: "Comprenez ce qu'est un algorithme, comment modéliser la logique avec du pseudocode et dessiner des logigrammes clairs.",
        descriptionEn: "Understand what an algorithm is, how to model logic with pseudocode, and draw clear flowcharts.",
        lessons: [
          {
            id: "1-1",
            moduleId: 1,
            titleFr: "Qu'est-ce qu'un algorithme et un Logigramme ?",
            titleEn: "What is an Algorithm and a Flowchart?",
            duration: "20 min",
            contentFr: `
# Introduction à l'Algorithmique
Un **algorithme** est une suite finie et ordonnée d'instructions permettant de résoudre un problème ou d'obtenir un résultat.
- **Entrées** : Données fournies.
- **Traitement** : Étapes logiques exécutées.
- **Sorties** : Résultats renvoyés.
- **Logigramme** : Schéma graphique modélisant le flux (Ovale = Début/Fin, Rectangle = Action, Losange = Condition).
            `,
            contentEn: `
# Introduction to Algorithms
An **algorithm** is a finite sequence of instructions to solve a problem.
- **Inputs**: Data provided.
- **Processing**: Logic steps executed.
- **Outputs**: Results returned.
- **Flowchart**: Graphic schema modeling flow (Oval = Start/End, Rectangle = Action, Diamond = Condition).
            `,
            attachmentUrl: "/attachments/algo_lesson_1_1.pdf",
            attachmentName: "Fiche_Synthese_Introduction_Logigrammes.pdf",
            explanationFr: "L'aire d'un rectangle est le produit de sa largeur par sa hauteur. La solution s'écrit `return largeur * hauteur;`.",
            explanationEn: "The area of a rectangle is the product of its width by its height. The solution is `return width * height;`.",
            exercise: {
              questionFr: "Écrivez une fonction `calculerAireRectangle(largeur, hauteur)` qui retourne l'aire d'un rectangle.",
              questionEn: "Write a function `calculerAireRectangle(largeur, hauteur)` that returns the area of a rectangle.",
              lang: "js",
              initialCode: "function calculerAireRectangle(largeur, hauteur) {\n  // Votre code ici\n}",
              testCases: [
                { input: "5, 10", expected: "50" },
                { input: "3, 7", expected: "21" }
              ],
              solutionTemplate: "return largeur * hauteur;"
            }
          },
          {
            id: "1-2",
            moduleId: 1,
            titleFr: "Pseudo-code et Variables",
            titleEn: "Pseudocode and Variables",
            duration: "20 min",
            contentFr: `
# Pseudo-code et Variables
Le **pseudo-code** est une description textuelle simplifiée d'un algorithme utilisant une syntaxe proche du langage humain.
- **Variable** : Boîte mémoire stockant une valeur (Entier, Réel, Chaîne, Booléen).
- **Affectation** : Action d'attribuer une valeur à une variable (ex: \`x <- 5\`).
            `,
            contentEn: `
# Pseudocode and Variables
**Pseudocode** is a simplified textual description of an algorithm using human-like syntax.
- **Variable**: A memory box storing a value (Integer, Float, String, Boolean).
- **Assignment**: Storing a value in a variable (e.g., \`x <- 5\`).
            `,
            attachmentUrl: "/attachments/algo_lesson_1_2.pdf",
            attachmentName: "Cours_PseudoCode_Variables.pdf",
            explanationFr: "Pour échanger deux variables, on utilise une variable temporaire : `let temp = a; a = b; b = temp;` et retourne `[b, a]`.",
            explanationEn: "To swap two variables, we use a temporary variable: `let temp = a; a = b; b = temp;` and return `[b, a]`.",
            exercise: {
              questionFr: "Écrivez une fonction `echangerVariables(a, b)` qui retourne les deux variables échangées sous forme de tableau `[b, a]`.",
              questionEn: "Write a function `echangerVariables(a, b)` that returns the two variables swapped as an array `[b, a]`.",
              lang: "js",
              initialCode: "function echangerVariables(a, b) {\n  // Votre code ici\n}",
              testCases: [
                { input: "5, 10", expected: "[10,5]" },
                { input: "'gauche', 'droite'", expected: '["droite","gauche"]' }
              ],
              solutionTemplate: "return [b, a];"
            }
          }
        ]
      },
      {
        id: 2,
        titleFr: "Structures Conditionnelles (Si/Sinon)",
        titleEn: "Conditional Structures (If/Else)",
        descriptionFr: "Apprenez à orienter le flux de l'algorithme selon les conditions logiques et les opérateurs booléens.",
        descriptionEn: "Learn to steer the algorithm flow using logical conditions and boolean operators.",
        lessons: [
          {
            id: "2-1",
            moduleId: 2,
            titleFr: "La structure alternative Si / Sinon",
            titleEn: "The Alternative Structure If / Else",
            duration: "25 min",
            contentFr: `
# Structures Conditionnelles (Si/Sinon)
Une structure **conditionnelle** permet d'exécuter des blocs d'instructions différents selon qu'une condition (expression booléenne) est Vraie ou Fausse.
- **Syntaxe** : \`Si (Condition) Alors [Instructions A] Sinon [Instructions B] FinSi\`.
            `,
            contentEn: `
# Conditional Structures (If/Else)
A **conditional** structure executes different blocks of instructions depending on whether a condition is True or False.
- **Syntax**: \`If (Condition) Then [Instructions A] Else [Instructions B] EndIf\`.
            `,
            attachmentUrl: "/attachments/algo_lesson_2_1.pdf",
            attachmentName: "Fiche_Structures_Conditionnelles.pdf",
            explanationFr: "Un nombre est pair si son reste de division par 2 est nul. La solution s'écrit `return n % 2 === 0;`.",
            explanationEn: "A number is even if its modulo 2 is zero. The solution is `return n % 2 === 0;`.",
            exercise: {
              questionFr: "Écrivez une fonction `estPair(n)` qui retourne `true` si le nombre fourni est pair, et `false` sinon.",
              questionEn: "Write a function `estPair(n)` that returns `true` if the number is even, and `false` otherwise.",
              lang: "js",
              initialCode: "function estPair(n) {\n  // Votre code ici\n}",
              testCases: [
                { input: "4", expected: "true" },
                { input: "7", expected: "false" }
              ],
              solutionTemplate: "return n % 2 === 0;"
            }
          },
          {
            id: "2-2",
            moduleId: 2,
            titleFr: "Opérateurs Logiques",
            titleEn: "Logical Operators",
            duration: "20 min",
            contentFr: `
# Opérateurs Logiques (ET, OU, NON)
Les opérateurs logiques permettent de combiner plusieurs conditions :
- **ET (&&)** : Vrai uniquement si TOUTES les conditions sont Vraies.
- **OU (||)** : Vrai si AU MOINS UNE condition est Vraie.
- **NON (!)** : Inverse l'état logique.
            `,
            contentEn: `
# Logical Operators (AND, OR, NOT)
Logical operators combine multiple conditions:
- **AND (&&)**: True only if ALL conditions are True.
- **OR (||)**: True if AT LEAST ONE condition is True.
- **NOT (!)**: Inverts the logical state.
            `,
            attachmentUrl: "/attachments/algo_lesson_2_2.pdf",
            attachmentName: "Cours_Operateurs_Logiques.pdf",
            explanationFr: "Pour être admis, l'âge doit être supérieur ou égal à 18 ET posséder le baccalauréat: `return age >= 18 && aLeBac;`.",
            explanationEn: "To be admitted, age must be greater or equal to 18 AND have the baccalaureate: `return age >= 18 && aLeBac;`.",
            exercise: {
              questionFr: "Écrivez une fonction `estAdmis(age, aLeBac)` qui retourne `true` si l'étudiant a au moins 18 ans et possède le bac (`aLeBac` est vrai), et `false` sinon.",
              questionEn: "Write a function `estAdmis(age, aLeBac)` that returns `true` if the student is at least 18 years old and has the baccalaureate, and `false` otherwise.",
              lang: "js",
              initialCode: "function estAdmis(age, aLeBac) {\n  // Votre code ici\n}",
              testCases: [
                { input: "19, true", expected: "true" },
                { input: "17, true", expected: "false" }
              ],
              solutionTemplate: "return age >= 18 && aLeBac;"
            }
          }
        ]
      },
      {
        id: 3,
        titleFr: "Structures Répétitives (Boucles)",
        titleEn: "Repetitive Structures (Loops)",
        descriptionFr: "Répétez des ensembles d'instructions efficacement avec des boucles conditionnelles ou bornées.",
        descriptionEn: "Repeat sets of instructions efficiently using conditional or bounded loops.",
        lessons: [
          {
            id: "3-1",
            moduleId: 3,
            titleFr: "La boucle Tant Que (While)",
            titleEn: "The While Loop",
            duration: "30 min",
            contentFr: `
# La boucle Tant Que (While)
Une boucle **Tant Que** exécute des instructions de manière répétée tant qu'une condition de boucle reste Vraie.
- **Important** : Vous devez modifier la variable de contrôle dans le corps pour éviter une boucle infinie !
            `,
            contentEn: `
# The While Loop
A **While** loop executes instructions repeatedly as long as a loop condition remains True.
- **Important**: You must modify the control variable inside the loop body to avoid infinite loops!
            `,
            attachmentUrl: "/attachments/algo_lesson_3_1.pdf",
            attachmentName: "Fiche_Boucles_Repetitions.pdf",
            explanationFr: "On initialise une somme à 0 et on additionne tous les entiers de 1 à n à l'aide d'une boucle: `let sum = 0; for(let i=1; i<=n; i++) sum += i; return sum;`.",
            explanationEn: "Initialize sum to 0 and add all integers from 1 to n using a loop: `let sum = 0; for(let i=1; i<=n; i++) sum += i; return sum;`.",
            exercise: {
              questionFr: "Écrivez une fonction `sommeEntiers(n)` qui calcule et retourne la somme de tous les entiers de 1 à n.",
              questionEn: "Write a function `sommeEntiers(n)` that calculates and returns the sum of all integers from 1 to n.",
              lang: "js",
              initialCode: "function sommeEntiers(n) {\n  // Votre code ici\n}",
              testCases: [
                { input: "5", expected: "15" },
                { input: "10", expected: "55" }
              ],
              solutionTemplate: "let sum = 0; for(let i=1; i<=n; i++) sum += i; return sum;"
            }
          },
          {
            id: "3-2",
            moduleId: 3,
            titleFr: "La boucle Bornée Pour (For)",
            titleEn: "The Bounded For Loop",
            duration: "25 min",
            contentFr: `
# La boucle Bornée Pour (For)
La boucle **Pour** est idéale lorsque le nombre de répétitions est connu à l'avance.
- **Syntaxe** : \`Pour i allant de Début à Fin Faire [Instructions] FinPour\`.
            `,
            contentEn: `
# The Bounded For Loop
The **For** loop is ideal when the number of iterations is known in advance.
- **Syntax**: \`For i from Start to End Do [Instructions] EndFor\`.
            `,
            attachmentUrl: "/attachments/algo_lesson_3_2.pdf",
            attachmentName: "Cours_Boucle_For.pdf",
            explanationFr: "La factorielle de n (n!) est le produit des entiers de 1 à n. La solution s'écrit `let fact = 1; for(let i=1; i<=n; i++) fact *= i; return fact;`.",
            explanationEn: "The factorial of n (n!) is the product of integers from 1 to n. The solution is `let fact = 1; for(let i=1; i<=n; i++) fact *= i; return fact;`.",
            exercise: {
              questionFr: "Écrivez une fonction `factorielle(n)` qui retourne la factorielle de n (n!). Par exemple, factorielle(5) = 120.",
              questionEn: "Write a function `factorielle(n)` that returns the factorial of n (n!). For example, factorielle(5) = 120.",
              lang: "js",
              initialCode: "function factorielle(n) {\n  // Votre code ici\n}",
              testCases: [
                { input: "5", expected: "120" },
                { input: "3", expected: "6" }
              ],
              solutionTemplate: "let fact = 1; for(let i=1; i<=n; i++) fact *= i; return fact;"
            }
          }
        ]
      },
      {
        id: 4,
        titleFr: "Tableaux et Algorithmes de Tri",
        titleEn: "Arrays and Sorting Algorithms",
        descriptionFr: "Stockez des ensembles de données dans des structures de tableaux et apprenez à y rechercher et trier des valeurs.",
        descriptionEn: "Store datasets inside array structures and learn to search and sort values.",
        lessons: [
          {
            id: "4-1",
            moduleId: 4,
            titleFr: "Manipulation des Tableaux",
            titleEn: "Array Manipulation",
            duration: "25 min",
            contentFr: `
# Tableaux à une dimension (Vecteurs)
Un **tableau** stocke une collection ordonnée d'éléments accessibles par leur index (de 0 à N-1).
- **Indexation** : Le premier élément est à l'index 0.
            `,
            contentEn: `
# One-Dimensional Arrays (Vectors)
An **array** stores an ordered collection of elements accessible by index (from 0 to N-1).
- **Indexing**: The first element is at index 0.
            `,
            attachmentUrl: "/attachments/algo_lesson_4_1.pdf",
            attachmentName: "Fiche_Tableaux_Vecteurs.pdf",
            explanationFr: "On calcule la somme de tous les éléments du tableau divisée par sa longueur. La solution s'écrit `let sum = arr.reduce((acc, v) => acc + v, 0); return sum / arr.length;`.",
            explanationEn: "Calculate the sum of all elements divided by array length. The solution is `let sum = arr.reduce((acc, v) => acc + v, 0); return sum / arr.length;`.",
            exercise: {
              questionFr: "Écrivez une fonction `calculerMoyenne(arr)` qui prend un tableau de nombres en paramètre et retourne leur moyenne.",
              questionEn: "Write a function `calculerMoyenne(arr)` that takes an array of numbers and returns their average.",
              lang: "js",
              initialCode: "function calculerMoyenne(arr) {\n  // Votre code ici\n}",
              testCases: [
                { input: "[10, 20, 30]", expected: "20" },
                { input: "[5, 15]", expected: "10" }
              ],
              solutionTemplate: "let sum = arr.reduce((acc, v) => acc + v, 0); return sum / arr.length;"
            }
          },
          {
            id: "4-2",
            moduleId: 4,
            titleFr: "Recherche du Maximum",
            titleEn: "Finding the Maximum",
            duration: "30 min",
            contentFr: `
# Recherche du Maximum dans un tableau
La recherche du **maximum** consiste à parcourir le tableau en conservant dans une variable la valeur la plus grande rencontrée jusqu'à présent.
            `,
            contentEn: `
# Finding the Maximum in an Array
To find the **maximum**, loop through the array while storing the highest value encountered in a variable.
            `,
            attachmentUrl: "/attachments/algo_lesson_4_2.pdf",
            attachmentName: "Fiche_Algorithmes_Recherche_Tri.pdf",
            explanationFr: "On initialise le maximum avec le premier élément du tableau, puis on compare avec chaque élément suivant: `let max = arr[0]; for(let i=1; i<arr.length; i++) if(arr[i] > max) max = arr[i]; return max;`.",
            explanationEn: "Initialize max with the first element, then compare with every subsequent element: `let max = arr[0]; for(let i=1; i<arr.length; i++) if(arr[i] > max) max = arr[i]; return max;`.",
            exercise: {
              questionFr: "Écrivez une fonction `rechercherMax(arr)` qui retourne la valeur maximale contenue dans le tableau `arr`.",
              questionEn: "Write a function `rechercherMax(arr)` that returns the maximum value inside the array `arr`.",
              lang: "js",
              initialCode: "function rechercherMax(arr) {\n  // Votre code ici\n}",
              testCases: [
                { input: "[3, 9, 2, 7]", expected: "9" },
                { input: "[-5, -1, -10]", expected: "-1" }
              ],
              solutionTemplate: "let max = arr[0]; for(let i=1; i<arr.length; i++) { if(arr[i] > max) max = arr[i]; } return max;"
            }
          }
        ]
      }
    ]
  },
  {
    id: "react-next-201",
    titleFr: "Programmation Web Front-End Avancée (React & Next.js)",
    titleEn: "Advanced Front-End Web Programming (React & Next.js)",
    descriptionFr: "Maîtrisez la création d'applications modernes réactives et performantes en utilisant React 19 et Next.js (App Router, Server Components).",
    descriptionEn: "Master building modern fast responsive web applications using React 19 and Next.js (App Router, Server Components).",
    author: "Tene Bana Maxym",
    difficultyFr: "Avancé",
    difficultyEn: "Advanced",
    imageUrl: "/nextjs_react_cover.png",
    category: "front",
    modules: [
      {
        id: 1,
        titleFr: "Composants React, Hooks et Rendu Next.js",
        titleEn: "React Components, Hooks, and Next.js Rendering",
        descriptionFr: "Comprenez la réactivité, le cycle de vie avec les hooks d'état et le rendu hybride (SSR, CSR, RSC).",
        descriptionEn: "Understand component states, lifecycle hooks, and hybrid rendering (SSR, CSR, RSC).",
        lessons: [
          {
            id: "r1-1",
            moduleId: 1,
            titleFr: "Les Hooks d'État et de Cycle de vie (useState & useEffect)",
            titleEn: "State and Lifecycle Hooks (useState & useEffect)",
            duration: "30 min",
            contentFr: `
# React Hooks : Le Cœur de la Réactivité
En React moderne, l'état local et les effets secondaires sont gérés par des **Hooks**.
- **useState** : Permet de déclarer une variable d'état dynamique.
- **useEffect** : Gère les effets (appels API, écouteurs d'événements) lors du montage ou de la mise à jour du composant.
- **RSC (React Server Components)** : Next.js introduit des composants rendus côté serveur par défaut pour de meilleures performances SEO.
            `,
            contentEn: `
# React Hooks: The Heart of Reactivity
In modern React, local state and side-effects are managed by **Hooks**.
- **useState**: Declares a dynamic state variable.
- **useEffect**: Manages side-effects (API calls, subscriptions) on component mount or update.
- **RSC (React Server Components)**: Next.js renders components server-side by default for optimal SEO.
            `,
            exercise: {
              questionFr: "Créez une fonction React simulée `CounterComponent(props)` qui retourne une chaîne JSON représentant l'état du compteur initialisé à props.initial et incrémenté de 1.",
              questionEn: "Create a simulated React function `CounterComponent(props)` that returns a JSON string representing the counter state initialized at props.initial and incremented by 1.",
              lang: "react",
              initialCode: "function CounterComponent(props) {\n  let count = props.initial;\n  // Simulez une incrémentation et retournez sous format JSON string { count: value }\n}",
              testCases: [
                { input: "{ initial: 5 }", expected: '{"count":6}' },
                { input: "{ initial: 0 }", expected: '{"count":1}' }
              ],
              solutionTemplate: "return JSON.stringify({ count: count + 1 });"
            }
          }
        ]
      }
    ]
  },
  {
    id: "springboot-202",
    titleFr: "Développement Backend avec Spring Boot & Java",
    titleEn: "Backend Development with Spring Boot & Java",
    descriptionFr: "Développez des APIs REST scalables et sécurisées en utilisant Java 21, Spring Boot, Spring Security et JPA/Hibernate.",
    descriptionEn: "Build scalable and secure REST APIs using Java 21, Spring Boot, Spring Security, and JPA/Hibernate.",
    author: "Tene Bana Maxym",
    difficultyFr: "Intermédiaire",
    difficultyEn: "Intermediate",
    imageUrl: "/springboot_cover.png",
    category: "back",
    modules: [
      {
        id: 1,
        titleFr: "Architecture MVC et Contrôleurs REST",
        titleEn: "MVC Architecture and REST Controllers",
        descriptionFr: "Découvrez les annotations Spring MVC pour mapper des endpoints HTTP et manipuler la dépendance IOC.",
        descriptionEn: "Learn Spring MVC annotations to map HTTP endpoints and handle dependency injection (IOC).",
        lessons: [
          {
            id: "sb1-1",
            moduleId: 1,
            titleFr: "Mapping de Routes HTTP avec `@RestController`",
            titleEn: "Mapping HTTP Routes with `@RestController`",
            duration: "25 min",
            contentFr: `
# Spring Boot REST Endpoints
Spring Boot utilise des annotations pour déclarer des contrôleurs web :
- **@RestController** : Indique que la classe sert des réponses REST au format JSON.
- **@GetMapping** / **@PostMapping** : Mappe les verbes HTTP GET et POST vers des fonctions.
- **@RequestParam** / **@PathVariable** : Extrait les paramètres de requête ou les segments de chemin.
            `,
            contentEn: `
# Spring Boot REST Endpoints
Spring Boot uses annotations to define web controllers:
- **@RestController**: Declares class as a JSON REST controller.
- **@GetMapping** / **@PostMapping**: Maps HTTP GET and POST requests.
- **@RequestParam** / **@PathVariable**: Extracts query parameters or path variables.
            `,
            exercise: {
              questionFr: "Écrivez une méthode Java (ou pseudo-code d'annotation Spring Boot) `mapEndpoint(path)` qui retourne le code d'annotation correspondant en combinant `@GetMapping` avec le chemin fourni.",
              questionEn: "Write a Java method (or Spring Boot annotation simulator) `mapEndpoint(path)` that returns the annotation string combining `@GetMapping` with the path.",
              lang: "springboot",
              initialCode: "function mapEndpoint(path) {\n  // Mappez le chemin en annotation Spring Boot, ex: @GetMapping(\"/path\")\n}",
              testCases: [
                { input: '"/users"', expected: '@GetMapping("/users")' },
                { input: '"/orders"', expected: '@GetMapping("/orders")' }
              ],
              solutionTemplate: 'return "@GetMapping(" + path + ")";'
            }
          }
        ]
      }
    ]
  },
  {
    id: "classic-web-102",
    titleFr: "Bases du Web Dynamique : HTML, CSS & PHP",
    titleEn: "Dynamic Web Fundamentals: HTML, CSS & PHP",
    descriptionFr: "Apprenez les origines du web : structurez avec HTML5, stylisez avec CSS3, et rendez vos pages interactives avec PHP côté serveur.",
    descriptionEn: "Learn web foundations: structure with HTML5, style with CSS3, and add server-side logic using PHP.",
    author: "Tene Bana Maxym",
    difficultyFr: "Débutant",
    difficultyEn: "Beginner",
    imageUrl: "/php_web_cover.png",
    category: "web",
    modules: [
      {
        id: 1,
        titleFr: "Structure HTML et Logique Serveur PHP",
        titleEn: "HTML Structure and PHP Server Logic",
        descriptionFr: "Construisez des formulaires HTML sécurisés et traitez les requêtes POST en PHP natif.",
        descriptionEn: "Build secure HTML forms and process POST requests in native PHP.",
        lessons: [
          {
            id: "php1-1",
            moduleId: 1,
            titleFr: "Formulaires HTML et Variables Globales `$_POST` en PHP",
            titleEn: "HTML Forms and `$_POST` Global Variables in PHP",
            duration: "20 min",
            contentFr: `
# Traitement dynamique en PHP
PHP s'exécute côté serveur pour générer du HTML dynamique.
- **$_POST** : Un tableau associatif contenant les valeurs envoyées via un formulaire HTTP POST.
- **htmlspecialchars()** : Évite les failles XSS en neutralisant les caractères HTML spéciaux.
            `,
            contentEn: `
# Server-side PHP Processing
PHP executes on the server to generate HTML output dynamically.
- **$_POST**: Associative array containing key-value parameters submitted via HTTP POST forms.
- **htmlspecialchars()**: Mitigates XSS vulnerabilities by escaping HTML tags.
            `,
            exercise: {
              questionFr: "Écrivez un script PHP simulant la lecture d'un champ POST `username` sécurisé par htmlspecialchars. La fonction `lirePostSecure(key)` simule ce comportement en retournant la valeur nettoyée.",
              questionEn: "Write a PHP simulator function `lirePostSecure(value)` that returns the HTML escaped value using a simulated htmlspecialchars check.",
              lang: "php",
              initialCode: "function lirePostSecure(value) {\n  // Échappez les caractères < et > pour simuler htmlspecialchars\n}",
              testCases: [
                { input: '"<script>"', expected: '&lt;script&gt;' },
                { input: '"admin"', expected: 'admin' }
              ],
              solutionTemplate: 'return value.replace(/</g, "&lt;").replace(/>/g, "&gt;");'
            }
          }
        ]
      }
    ]
  },
  {
    id: "java-poo-103",
    titleFr: "Programmation Orientée Objet avec Java",
    titleEn: "Object-Oriented Programming with Java",
    descriptionFr: "Assimilez les 4 piliers de la POO (Encapsulation, Héritage, Polymorphisme, Abstraction) appliqués au langage Java.",
    descriptionEn: "Master the 4 pillars of OOP (Encapsulation, Inheritance, Polymorphism, Abstraction) implemented in Java.",
    author: "Tene Bana Maxym",
    difficultyFr: "Intermédiaire",
    difficultyEn: "Intermediate",
    imageUrl: "/java_oop_cover.png",
    category: "oop",
    modules: [
      {
        id: 1,
        titleFr: "Classes, Héritage et Abstraction",
        titleEn: "Classes, Inheritance, and Abstraction",
        descriptionFr: "Déclarez des classes concrètes et abstraites en Java, et comprenez l'accès aux variables privées.",
        descriptionEn: "Declare abstract and concrete Java classes, and understand encapsulation and access modifiers.",
        lessons: [
          {
            id: "j1-1",
            moduleId: 1,
            titleFr: "Encapsulation : Getters, Setters et Niveaux d'Accès",
            titleEn: "Encapsulation: Getters, Setters, and Access Modifiers",
            duration: "25 min",
            contentFr: `
# Les Piliers de la POO en Java
La POO organise le code autour d'objets :
- **Encapsulation** : Restreindre l'accès direct aux variables d'instance en les déclarant \`private\`, et fournir des méthodes publiques d'accès (\`getters\`/\`setters\`).
- **Héritage** (\`extends\`) : Permet à une classe d'hériter des propriétés et comportements d'une classe parente.
            `,
            contentEn: `
# Java OOP Core Pillars
OOP groups logic and properties inside Objects:
- **Encapsulation**: Restricts direct field access using \`private\` modifiers, exposing access via public \`getters\`/\`setters\`.
- **Inheritance** (\`extends\`): Allows sub-classes to inherit state and behaviors from parent classes.
            `,
            exercise: {
              questionFr: "Créez une fonction Java simulée représentant un Getter classique. `genererGetter(field)` doit retourner le code d'une méthode getter publique pour un champ String (ex: pour 'name' -> 'public String getName() { return this.name; }').",
              questionEn: "Create a Java getter generator function `genererGetter(field)`. For a given field name, return the string representation of its public String getter.",
              lang: "java",
              initialCode: "function genererGetter(field) {\n  // Votre code ici\n}",
              testCases: [
                { input: '"name"', expected: 'public String getName() { return this.name; }' },
                { input: '"email"', expected: 'public String getEmail() { return this.email; }' }
              ],
              solutionTemplate: 'const capitalize = field.charAt(0).toUpperCase() + field.slice(1); return "public String get" + capitalize + "() { return this." + field + "; }";'
            }
          }
        ]
      }
    ]
  },
  {
    id: "python-104",
    titleFr: "Programmation et Scripting avec Python",
    titleEn: "Programming and Scripting with Python",
    descriptionFr: "Apprenez le langage le plus populaire pour l'analyse de données, le scripting système, et l'intelligence artificielle.",
    descriptionEn: "Learn the most popular programming language for data analysis, system scripting, and AI.",
    author: "Tene Bana Maxym",
    difficultyFr: "Débutant",
    difficultyEn: "Beginner",
    imageUrl: "/python_cover.png",
    category: "python",
    modules: [
      {
        id: 1,
        titleFr: "Bases du Langage Python et Structures de Données",
        titleEn: "Python Basics and Built-in Data Structures",
        descriptionFr: "Découvrez les listes, tuples, dictionnaires, ainsi que la syntaxe épurée basée sur l'indentation de Python.",
        descriptionEn: "Explore lists, tuples, dictionaries, and Python's clean indentation-based syntax.",
        lessons: [
          {
            id: "py1-1",
            moduleId: 1,
            titleFr: "Compréhensions de Listes et Manipulation de Collections",
            titleEn: "List Comprehensions and Collection Manipulation",
            duration: "20 min",
            contentFr: `
# Syntaxe Expressive de Python
Python se distingue par sa lisibilité :
- **List Comprehensions** : Permet de créer de nouvelles listes à partir de listes existantes en une seule ligne.
  \`\`\`python
  carres = [x**2 for x in range(5)] # [0, 1, 4, 9, 16]
  \`\`\`
- **Dictionnaires** : Tables de hachage associatives clés-valeurs.
            `,
            contentEn: `
# Pythonic Syntax
Python is designed for high readability:
- **List Comprehensions**: Construct list maps in a single line.
  \`\`\`python
  squares = [x**2 for x in range(5)] # [0, 1, 4, 9, 16]
  \`\`\`
- **Dictionaries**: Associative key-value structures.
            `,
            exercise: {
              questionFr: "Écrivez une expression de compréhension de liste simulée. La fonction `filtrePairs(max)` retourne une chaîne de liste d'entiers pairs inférieurs ou égaux à max.",
              questionEn: "Write a simulated list comprehension. The function `filtrePairs(max)` returns a string representation of even integers less than or equal to max.",
              lang: "python",
              initialCode: "function filtrePairs(max) {\n  // Mappez les entiers pairs dans un tableau JS et retournez sa représentation JSON string\n}",
              testCases: [
                { input: "6", expected: "[0,2,4,6]" },
                { input: "3", expected: "[0,2]" }
              ],
              solutionTemplate: 'const arr = []; for(let i=0; i<=max; i++) { if(i%2===0) arr.push(i); } return "[" + arr.join(",") + "]";'
            }
          }
        ]
      }
    ]
  }
];

export const CERTIFICATION_EXAM_QUESTIONS = [
  {
    id: "q1",
    questionFr: "Quel symbole de logigramme représente une décision conditionnelle ?",
    questionEn: "Which flowchart symbol represents a conditional decision?",
    optionsFr: ["Le Rectangle", "Le Parallélogramme", "Le Losange", "L'Ovale"],
    optionsEn: ["Rectangle", "Parallelogram", "Diamond", "Oval"],
    answerIndex: 2
  },
  {
    id: "q2",
    questionFr: "En C, quel type déclare un nombre décimal simple précision ?",
    questionEn: "In C, which type declares a single-precision floating point number?",
    optionsFr: ["int", "float", "char", "double"],
    optionsEn: ["int", "float", "char", "double"],
    answerIndex: 1
  },
  {
    id: "q3",
    questionFr: "Comment déclare-t-on une constante en JavaScript ?",
    questionEn: "How do you declare a constant in JavaScript?",
    optionsFr: ["let", "constant", "var", "const"],
    optionsEn: ["let", "constant", "var", "const"],
    answerIndex: 3
  },
  {
    id: "q4",
    questionFr: "Qu'affiche ce code : for(let i=0; i<3; i++) { if(i==1) continue; console.log(i); }",
    questionEn: "What does this code print: for(let i=0; i<3; i++) { if(i==1) continue; console.log(i); }",
    optionsFr: ["0 et 1", "0 et 2", "1 et 2", "0, 1 et 2"],
    optionsEn: ["0 and 1", "0 and 2", "1 and 2", "0, 1 and 2"],
    answerIndex: 1
  },
  {
    id: "q5",
    questionFr: "Quelle est la principale différence entre le C et le JS concernant le typage ?",
    questionEn: "What is the main difference between C and JS regarding typing?",
    optionsFr: [
      "Le C est à typage dynamique, le JS est à typage statique",
      "Le C est à typage statique, le JS est à typage dynamique",
      "Les deux sont à typage dynamique",
      "Les deux sont à typage statique"
    ],
    optionsEn: [
      "C is dynamically typed, JS is statically typed",
      "C is statically typed, JS is dynamically typed",
      "Both are dynamically typed",
      "Both are statically typed"
    ],
    answerIndex: 1
  }
];
