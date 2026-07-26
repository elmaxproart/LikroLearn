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
    lang: 'js' | 'c';
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

Un **algorithme** est une suite finie et ordonnée d'instructions ou d'opérations permettant de résoudre un problème ou d'obtenir un résultat. C'est la recette de cuisine de l'informatique !

## Les Trois Piliers d'un Algorithme
1. **Les Entrées (Inputs)** : Les données fournies à l'algorithme.
2. **Le Traitement (Processing)** : La logique et les étapes exécutées.
3. **Les Sorties (Outputs)** : Le résultat renvoyé.

## Modélisation Graphique : Le Logigramme (Flowchart)
Un logigramme est une représentation graphique d'un algorithme à l'aide de symboles standardisés :
- **Ovale (Début/Fin)** : Représente le point de départ ou d'arrêt.
- **Parallélogramme (Entrée/Sortie)** : Lecture de données ou affichage de résultats.
- **Rectangle (Instruction/Traitement)** : Opérations arithmétiques, affectation de variables.
- **Losange (Décision)** : Une condition (Vrai/Faux) qui sépare le flux en deux branches.

### Exemple de Logigramme pour faire du thé :
\`\`\`
  [Début] -> [Faire bouillir l'eau] -> {L'eau est-elle chaude ?}
                                            |
                                      Oui -> | -> [Mettre le sachet] -> [Fin]
                                      Non -> (Attendre) -> boucler
\`\`\`

## Intégration en JavaScript et en C

### JavaScript
En JS, un algorithme de base s'écrit de manière très fluide et dynamique :
\`\`\`javascript
function faireDuThe(eauChaude) {
    if (eauChaude) {
        console.log("Mettre le sachet de thé.");
        return "Prêt";
    } else {
        console.log("Attendre que l'eau chauffe...");
        return "En attente";
    }
}
\`\`\`

### Langage C
En C, le code est compilé et nécessite une structure stricte avec typage statique :
\`\`\`c
#include <stdio.h>
#include <stdbool.h>

const char* faireDuThe(bool eauChaude) {
    if (eauChaude) {
        printf("Mettre le sachet de the.\\n");
        return "Pret";
    } else {
        printf("Attendre...\\n");
        return "En attente";
    }
}
\`\`\`
            `,
            contentEn: `
# Introduction to Algorithms

An **algorithm** is a finite and ordered sequence of instructions or operations to solve a problem or obtain a result. It's the recipe book of computer science!

## The Three Pillars of an Algorithm
1. **Inputs** : Data provided to the algorithm.
2. **Processing** : The logic and execution steps.
3. **Outputs** : The returned result.

## Graphical Representation: The Flowchart
A flowchart is a graphic representation of an algorithm using standardized symbols:
- **Oval (Start/End)** : Represents the start or stop.
- **Parallelogram (Input/Output)** : Reading data or displaying results.
- **Rectangle (Process)** : Arithmetic operations, variable assignment.
- **Diamond (Decision)** : A condition (True/False) that splits the flow into two branches.

### Example Flowchart for making tea:
\`\`\`
  [Start] -> [Boil water] -> {Is water hot?}
                                 |
                           Yes -> | -> [Put tea bag] -> [End]
                           No  -> (Wait) -> loop back
\`\`\`

## Integration in JavaScript and C

### JavaScript
In JS, a basic algorithm is written dynamically and fluidly:
\`\`\`javascript
function makeTea(hotWater) {
    if (hotWater) {
        console.log("Put tea bag.");
        return "Ready";
    } else {
        console.log("Waiting for water to boil...");
        return "Waiting";
    }
}
\`\`\`

### C Language
In C, the code is compiled and requires a strict structure with static typing:
\`\`\`c
#include <stdio.h>
#include <stdbool.h>

const char* makeTea(bool hotWater) {
    if (hotWater) {
        printf("Put tea bag.\\n");
        return "Ready";
    } else {
        printf("Waiting...\\n");
        return "Waiting";
    }
}
\`\`\`
            `,
            exercise: {
              questionFr: "Écrivez une fonction en JavaScript `calculerAireRectangle(largeur, hauteur)` qui retourne l'aire d'un rectangle.",
              questionEn: "Write a function in JavaScript `calculerAireRectangle(largeur, hauteur)` that returns the area of a rectangle.",
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
      },
      {
        id: 2,
        titleFr: "Variables, Types de Données et Opérateurs",
        titleEn: "Variables, Data Types, and Operators",
        descriptionFr: "Découvrez comment stocker des informations en mémoire, les types de données fondamentaux et comment les manipuler en C et JS.",
        descriptionEn: "Learn how to store information in memory, basic data types, and how to manipulate them in C and JS.",
        lessons: [
          {
            id: "2-1",
            moduleId: 2,
            titleFr: "Variables et types en JS et C",
            titleEn: "Variables and types in JS & C",
            duration: "25 min",
            contentFr: `
# Variables et Mémoire

Une **variable** est un espace de stockage nommé en mémoire vive (RAM).

## Typage Dynamique (JavaScript) vs Typage Statique (C)

### En JavaScript
- Vous n'avez pas besoin de spécifier le type de la variable.
- Les variables se déclarent avec \`let\`, \`const\`, ou \`var\`.
- Types de base : \`number\`, \`string\`, \`boolean\`, \`object\`, \`undefined\`.
\`\`\`javascript
let age = 25; // number
let nom = "Maxym"; // string
let estAdmin = true; // boolean
\`\`\`

### En Langage C
- Vous devez impérativement déclarer le type de la variable.
- Types de base : \`int\`, \`float\`, \`double\`, \`char\`, \`void\`.
\`\`\`c
int age = 25;
float taille = 1.75;
char initiale = 'M';
\`\`\`
            `,
            contentEn: `
# Variables and Memory

A **variable** is a named storage location in RAM.

## Dynamic Typing (JavaScript) vs Static Typing (C)

### In JavaScript
- No need to specify the variable type.
- Declared using \`let\`, \`const\`, or \`var\`.
- Basic types: \`number\`, \`string\`, \`boolean\`, \`object\`, \`undefined\`.
\`\`\`javascript
let age = 25; // number
let name = "Maxym"; // string
let isAdmin = true; // boolean
\`\`\`

### In C Language
- You MUST declare the variable type.
- Basic types: \`int\`, \`float\`, \`double\`, \`char\`, \`void\`.
\`\`\`c
int age = 25;
float height = 1.75;
char initial = 'M';
\`\`\`
            `,
            exercise: {
              questionFr: "Écrivez une fonction en JavaScript `estPair(nombre)` qui retourne `true` si le nombre est pair, et `false` sinon.",
              questionEn: "Write a function in JavaScript `estPair(nombre)` that returns `true` if the number is even, and `false` otherwise.",
              lang: "js",
              initialCode: "function estPair(nombre) {\n  // Votre code ici\n}",
              testCases: [
                { input: "4", expected: "true" },
                { input: "7", expected: "false" }
              ],
              solutionTemplate: "return nombre % 2 === 0;"
            }
          }
        ]
      },
      {
        id: 3,
        titleFr: "Structures de Contrôle et Boucles",
        titleEn: "Control Structures and Loops",
        descriptionFr: "Dirigez l'exécution de vos programmes avec les conditions (if/else) et les boucles (for/while).",
        descriptionEn: "Control the execution flow of your programs with conditions (if/else) and loops (for/while).",
        lessons: [
          {
            id: "3-1",
            moduleId: 3,
            titleFr: "Conditions et Boucles",
            titleEn: "Conditions and Loops",
            duration: "30 min",
            contentFr: `
# Structures Conditionnelles et Boucles

Les structures de contrôle permettent de rompre l'exécution séquentielle (ligne par ligne) d'un programme.

## 1. Les Conditions (if, else if, else)
Elles testent des expressions booléennes.

## 2. Les Boucles (while, for)
Répètent un bloc d'instructions tant qu'une condition reste vraie.

### Exemple de boucle FOR :
- **JS** :
\`\`\`javascript
for (let i = 0; i < 5; i++) {
    console.log(i);
}
\`\`\`
- **C** :
\`\`\`c
for (int i = 0; i < 5; i++) {
    printf("%d\\n", i);
}
\`\`\`
            `,
            contentEn: `
# Conditionals and Loops

Control structures interrupt the sequential execution of a program based on conditions.

## 1. Conditions (if, else if, else)
They test boolean expressions.

## 2. Loops (while, for)
Repeat a block of instructions as long as a condition is true.

### Loop Example (FOR):
- **JS**:
\`\`\`javascript
for (let i = 0; i < 5; i++) {
    console.log(i);
}
\`\`\`
- **C**:
\`\`\`c
for (int i = 0; i < 5; i++) {
    printf("%d\\n", i);
}
\`\`\`
            `,
            exercise: {
              questionFr: "Créez une fonction `sommeJusqua(n)` qui retourne la somme de tous les entiers de 1 à n inclus.",
              questionEn: "Create a function `sommeJusqua(n)` that returns the sum of all integers from 1 to n inclusive.",
              lang: "js",
              initialCode: "function sommeJusqua(n) {\n  // Votre code ici\n}",
              testCases: [
                { input: "5", expected: "15" },
                { input: "10", expected: "55" }
              ],
              solutionTemplate: "let s = 0; for(let i=1;i<=n;i++) s+=i; return s;"
            }
          }
        ]
      },
      {
        id: 4,
        titleFr: "Fonctions, Tableaux et Mémoire",
        titleEn: "Functions, Arrays, and Memory",
        descriptionFr: "Modularisez votre logique avec les fonctions, gérez des listes d'éléments et comprenez la gestion de la mémoire.",
        descriptionEn: "Modularize your logic using functions, manage lists, and understand memory management.",
        lessons: [
          {
            id: "4-1",
            moduleId: 4,
            titleFr: "Fonctions et Tableaux",
            titleEn: "Functions and Arrays",
            duration: "30 min",
            contentFr: `
# Fonctions et Tableaux

## 1. Fonctions
Permettent de réutiliser un bloc de code logique.

## 2. Tableaux
Structures de données linéaires stockant des collections d'éléments.

### Différence clé JS / C :
En JS, les tableaux sont des objets dynamiques de taille variable :
\`\`\`javascript
let tab = [1, 2, 3];
tab.push(4); // OK
\`\`\`
En C, les tableaux ont une taille fixe allouée en mémoire :
\`\`\`c
int tab[3] = {1, 2, 3};
// Impossible d'ajouter un 4ème élément dynamiquement sans allocation dynamique (malloc)
\`\`\`
            `,
            contentEn: `
# Functions and Arrays

## 1. Functions
Allow reusability of blocks of code.

## 2. Arrays
Linear data structures storing lists of items.

### Key Difference JS / C:
In JS, arrays are dynamic objects:
\`\`\`javascript
let tab = [1, 2, 3];
tab.push(4); // OK
\`\`\`
In C, arrays have a fixed size allocated in memory:
\`\`\`c
int tab[3] = {1, 2, 3};
// Cannot expand size without manual dynamic allocation (malloc/realloc)
\`\`\`
            `,
            exercise: {
              questionFr: "Écrivez une fonction `trouverMaximum(arr)` qui prend un tableau de nombres et retourne le plus grand nombre.",
              questionEn: "Write a function `trouverMaximum(arr)` that takes an array of numbers and returns the largest number.",
              lang: "js",
              initialCode: "function trouverMaximum(arr) {\n  // Votre code ici\n}",
              testCases: [
                { input: "[1, 5, 3, 9, 2]", expected: "9" },
                { input: "[-1, -5, -3]", expected: "-1" }
              ],
              solutionTemplate: "return Math.max(...arr);"
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
