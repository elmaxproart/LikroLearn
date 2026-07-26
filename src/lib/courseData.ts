export interface Lesson {
  id: string; // e.g., '1-1'
  moduleId: number;
  titleFr: string;
  titleEn: string;
  duration: string;
  contentFr: string;
  contentEn: string;
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
