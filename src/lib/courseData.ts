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
  weekLabel?: string;
  estimatedHours?: string;
  objectives?: string[];
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
        titleFr: "Introduction à l'algorithmique et à la pensée computationnelle",
        titleEn: "Introduction to algorithmics and computational thinking",
        descriptionFr: "Comprenez ce qu'est un algorithme, comment modéliser la logique avec du pseudocode et dessiner des logigrammes clairs.",
        descriptionEn: "Understand what an algorithm is, how to model logic with pseudocode, and draw clear flowcharts.",
        weekLabel: "Semaine 1",
        estimatedHours: "6 à 8 heures",
        objectives: [
          "Comprendre ce qu'est un algorithme et pourquoi il précède tout code",
          "Décomposer un problème en étapes logiques (analyse descendante)",
          "Lire et produire un organigramme (flowchart) et un pseudo-code normalisé",
          "Distinguer variables, constantes, types de données et opérateurs",
          "Maîtriser les structures conditionnelles et les boucles au niveau conceptuel"
        ],
        lessons: [
          {
            id: "1-1",
            moduleId: 1,
            titleFr: "Qu'est-ce qu'un algorithme ? De l'idée à la logique",
            titleEn: "What is an algorithm? From idea to logic",
            duration: "9 min",
            contentFr: `
# Introduction à l'Algorithmique
Un **algorithme** est une suite finie et ordonnée d'instructions permettant de résoudre un problème ou d'obtenir un résultat.
- **Entrées** : Données fournies.
- **Traitement** : Étapes logiques exécutées.
- **Sorties** : Résultats renvoyés.
`,
            contentEn: `
# Introduction to Algorithms
An **algorithm** is a finite sequence of instructions to solve a problem.
- **Inputs**: Data provided.
- **Processing**: Logic steps executed.
- **Outputs**: Results returned.
`,
            attachmentUrl: "/attachments/algo_lesson_1_1.pdf",
            attachmentName: "Fiche_Synthese_Introduction.pdf",
            explanationFr: "L'aire d'un rectangle est le produit de sa largeur par sa hauteur.",
            explanationEn: "The area of a rectangle is the product of its width by its height.",
            exercise: {
              questionFr: "Écrivez une fonction \`calculerAireRectangle(largeur, hauteur)\` qui retourne l'aire d'un rectangle.",
              questionEn: "Write a function \`calculerAireRectangle(largeur, hauteur)\` that returns the area of a rectangle.",
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
            titleFr: "Pseudo-code et conventions d'écriture",
            titleEn: "Pseudocode and writing conventions",
            duration: "7 min",
            contentFr: `
# Pseudo-code
Le **pseudo-code** est une description textuelle simplifiée d'un algorithme utilisant une syntaxe proche du langage humain.
`,
            contentEn: `
# Pseudocode
**Pseudocode** is a simplified textual description of an algorithm using human-like syntax.
`,
            attachmentUrl: "/attachments/algo_lesson_1_2.pdf",
            attachmentName: "Cours_PseudoCode.pdf",
            explanationFr: "Pour échanger deux variables, on utilise une variable temporaire : \`let temp = a; a = b; b = temp;\` et retourne \`[b, a]\`.",
            explanationEn: "To swap two variables, we use a temporary variable: \`let temp = a; a = b; b = temp;\` and return \`[b, a]\`.",
            exercise: {
              questionFr: "Écrivez une fonction \`echangerVariables(a, b)\` qui retourne les deux variables échangées sous forme de tableau \`[b, a]\`.",
              questionEn: "Write a function \`echangerVariables(a, b)\` that returns the two variables swapped as an array \`[b, a]\`.",
              lang: "js",
              initialCode: "function echangerVariables(a, b) {\n  // Votre code ici\n}",
              testCases: [
                { input: "5, 10", expected: "[10,5]" },
                { input: "'gauche', 'droite'", expected: '["droite","gauche"]' }
              ],
              solutionTemplate: "return [b, a];"
            }
          },
          {
            id: "1-3",
            moduleId: 1,
            titleFr: "Organigrammes : lire et dessiner un flowchart",
            titleEn: "Flowcharts: read and draw",
            duration: "8 min",
            contentFr: `
# Organigrammes
Un **Logigramme** (flowchart) est un schéma graphique modélisant le flux (Ovale = Début/Fin, Rectangle = Action, Losange = Condition).
`,
            contentEn: `
# Flowcharts
A **Flowchart** is a graphic schema modeling flow (Oval = Start/End, Rectangle = Action, Diamond = Condition).
`,
            attachmentUrl: "/attachments/algo_lesson_1_3.pdf",
            attachmentName: "Symboles_Organigrammes.pdf",
            explanationFr: "Retourner simplement le double de la valeur.",
            explanationEn: "Just return double the value.",
            exercise: {
              questionFr: "Écrivez une fonction \`doubleValeur(n)\` qui retourne le double de n.",
              questionEn: "Write a function \`doubleValeur(n)\` that returns double of n.",
              lang: "js",
              initialCode: "function doubleValeur(n) {\n  // Votre code ici\n}",
              testCases: [
                { input: "5", expected: "10" },
                { input: "-3", expected: "-6" }
              ],
              solutionTemplate: "return n * 2;"
            }
          },
          {
            id: "1-4",
            moduleId: 1,
            titleFr: "Variables, types et opérateurs",
            titleEn: "Variables, types and operators",
            duration: "10 min",
            contentFr: `
# Variables et Types
- **Variable** : Boîte mémoire stockant une valeur (Entier, Réel, Chaîne, Booléen).
- **Affectation** : Action d'attribuer une valeur.
`,
            contentEn: `
# Variables and Types
- **Variable**: A memory box storing a value (Integer, Float, String, Boolean).
- **Assignment**: Storing a value.
`,
            explanationFr: "Additionnez simplement a et b.",
            explanationEn: "Simply add a and b.",
            exercise: {
              questionFr: "Écrivez une fonction \`addition(a, b)\`.",
              questionEn: "Write a function \`addition(a, b)\`.",
              lang: "js",
              initialCode: "function addition(a, b) {\n  // Votre code ici\n}",
              testCases: [
                { input: "5, 10", expected: "15" }
              ],
              solutionTemplate: "return a + b;"
            }
          },
          {
            id: "1-5",
            moduleId: 1,
            titleFr: "Conditions (si/alors/sinon) et boucles (tant que, pour)",
            titleEn: "Conditions and loops",
            duration: "11 min",
            contentFr: `
# Conditions et Boucles
Introduction aux structures de contrôle de base pour diriger le flux du programme.
`,
            contentEn: `
# Conditions and Loops
Introduction to basic control structures to direct program flow.
`,
            explanationFr: "Utiliser if/else ou le modulo.",
            explanationEn: "Use if/else or modulo.",
            exercise: {
              questionFr: "Écrivez une fonction \`estPair(n)\`.",
              questionEn: "Write a function \`estPair(n)\`.",
              lang: "js",
              initialCode: "function estPair(n) {\n  // Votre code ici\n}",
              testCases: [
                { input: "4", expected: "true" },
                { input: "5", expected: "false" }
              ],
              solutionTemplate: "return n % 2 === 0;"
            }
          }
        ]
      },
      {
        id: 2,
        titleFr: "Fondamentaux du langage C — la machine au plus près",
        titleEn: "C Language Fundamentals",
        descriptionFr: "Installer et utiliser un environnement C, comprendre la syntaxe, la mémoire et le débogage.",
        descriptionEn: "Install and use a C environment, understand syntax, memory and debugging.",
        weekLabel: "Semaines 2-3",
        estimatedHours: "10 à 12 heures",
        objectives: [
          "Installer et utiliser un environnement C",
          "Maîtriser la syntaxe C : types, entrées/sorties",
          "Écrire des structures conditionnelles et des boucles robustes",
          "Comprendre la notion de mémoire et de portée",
          "Déboguer un programme C"
        ],
        lessons: [
          {
            id: "2-1",
            moduleId: 2,
            titleFr: "Installer son environnement (GCC)",
            titleEn: "Setup environment (GCC)",
            duration: "6 min",
            contentFr: `# GCC\nLe compilateur C standard.`,
            contentEn: `# GCC\nThe standard C compiler.`,
            exercise: {
              questionFr: "Faites une fonction qui retourne 1.",
              questionEn: "Return 1.",
              lang: "c",
              initialCode: "int getOne() {\n  \n}",
              testCases: [{ input: "", expected: "1" }],
              solutionTemplate: "return 1;"
            }
          },
          {
            id: "2-2",
            moduleId: 2,
            titleFr: "Premier programme : structure d'un fichier .c",
            titleEn: "First program",
            duration: "8 min",
            contentFr: `# Structure C\nLes inclusions et le main.`,
            contentEn: `# C Structure\nIncludes and main.`,
            exercise: {
              questionFr: "Retournez la somme de a et b.",
              questionEn: "Return sum of a and b.",
              lang: "c",
              initialCode: "int sum(int a, int b) {\n  \n}",
              testCases: [{ input: "2,3", expected: "5" }],
              solutionTemplate: "return a + b;"
            }
          },
          {
            id: "2-3",
            moduleId: 2,
            titleFr: "Types de données, printf/scanf",
            titleEn: "Data types and IO",
            duration: "10 min",
            contentFr: `# IO en C\nUtilisation de stdio.h.`,
            contentEn: `# IO in C\nUsing stdio.h.`,
            exercise: {
              questionFr: "Retourner a * b.",
              questionEn: "Return a * b.",
              lang: "c",
              initialCode: "int multiply(int a, int b) {\n  \n}",
              testCases: [{ input: "2,3", expected: "6" }],
              solutionTemplate: "return a * b;"
            }
          },
          {
            id: "2-4",
            moduleId: 2,
            titleFr: "if / else / switch en C",
            titleEn: "if / else / switch in C",
            duration: "9 min",
            contentFr: `# Conditions\nif, else, switch.`,
            contentEn: `# Conditions\nif, else, switch.`,
            exercise: {
              questionFr: "Retourner 1 si a > b, sinon 0.",
              questionEn: "Return 1 if a > b, else 0.",
              lang: "c",
              initialCode: "int isGreater(int a, int b) {\n  \n}",
              testCases: [{ input: "5,3", expected: "1" }, { input: "3,5", expected: "0" }],
              solutionTemplate: "if (a > b) return 1; else return 0;"
            }
          },
          {
            id: "2-5",
            moduleId: 2,
            titleFr: "Boucles for, while, do-while",
            titleEn: "Loops",
            duration: "10 min",
            contentFr: `# Boucles\nfor, while, do-while.`,
            contentEn: `# Loops\nfor, while, do-while.`,
            exercise: {
              questionFr: "Somme de 1 à n.",
              questionEn: "Sum 1 to n.",
              lang: "c",
              initialCode: "int sumN(int n) {\n  \n}",
              testCases: [{ input: "5", expected: "15" }],
              solutionTemplate: "int s = 0; for(int i=1; i<=n; i++) s += i; return s;"
            }
          },
          {
            id: "2-6",
            moduleId: 2,
            titleFr: "Portée des variables et gestion mémoire",
            titleEn: "Variable scope and memory",
            duration: "9 min",
            contentFr: `# Mémoire\nPile et tas.`,
            contentEn: `# Memory\nStack and heap.`,
            exercise: {
              questionFr: "Retourner n.",
              questionEn: "Return n.",
              lang: "c",
              initialCode: "int returnN(int n) {\n  \n}",
              testCases: [{ input: "5", expected: "5" }],
              solutionTemplate: "return n;"
            }
          }
        ]
      },
      {
        id: 3,
        titleFr: "Structures de données, fonctions et récursivité en C",
        titleEn: "Data structures, functions and recursion in C",
        descriptionFr: "Concevoir et utiliser des fonctions, manipuler les tableaux, comprendre les pointeurs et la récursivité.",
        descriptionEn: "Design and use functions, manipulate arrays, understand pointers and recursion.",
        weekLabel: "Semaines 4-5",
        estimatedHours: "10 à 12 heures",
        objectives: [
          "Concevoir et utiliser des fonctions",
          "Manipuler les tableaux à une et deux dimensions",
          "Comprendre les pointeurs",
          "Écrire des algorithmes récursifs",
          "Introduire le tri et la recherche"
        ],
        lessons: [
          {
            id: "3-1",
            moduleId: 3,
            titleFr: "Fonctions : déclaration, appel, portée",
            titleEn: "Functions: declaration, call, scope",
            duration: "9 min",
            contentFr: `# Fonctions\nDéfinir et appeler des fonctions.`,
            contentEn: `# Functions\nDefine and call functions.`,
            exercise: {
              questionFr: "Retournez a - b.",
              questionEn: "Return a - b.",
              lang: "c",
              initialCode: "int subtract(int a, int b) {\n  \n}",
              testCases: [{ input: "5,3", expected: "2" }],
              solutionTemplate: "return a - b;"
            }
          },
          {
            id: "3-2",
            moduleId: 3,
            titleFr: "Tableaux à une dimension",
            titleEn: "One-dimensional arrays",
            duration: "8 min",
            contentFr: `# Tableaux\nVecteurs en C.`,
            contentEn: `# Arrays\nVectors in C.`,
            exercise: {
              questionFr: "Retournez le premier élément d'un tableau (simulé par a).",
              questionEn: "Return first element.",
              lang: "c",
              initialCode: "int firstElement(int a) {\n  \n}",
              testCases: [{ input: "5", expected: "5" }],
              solutionTemplate: "return a;"
            }
          },
          {
            id: "3-3",
            moduleId: 3,
            titleFr: "Tableaux à deux dimensions (matrices)",
            titleEn: "Two-dimensional arrays (matrices)",
            duration: "9 min",
            contentFr: `# Matrices\nTableaux 2D.`,
            contentEn: `# Matrices\n2D Arrays.`,
            exercise: {
              questionFr: "Simuler retour.",
              questionEn: "Simulate return.",
              lang: "c",
              initialCode: "int sim(int a) {\n  \n}",
              testCases: [{ input: "1", expected: "1" }],
              solutionTemplate: "return a;"
            }
          },
          {
            id: "3-4",
            moduleId: 3,
            titleFr: "Introduction aux pointeurs",
            titleEn: "Introduction to pointers",
            duration: "12 min",
            contentFr: `# Pointeurs\nAdresses mémoire.`,
            contentEn: `# Pointers\nMemory addresses.`,
            exercise: {
              questionFr: "Retourner la valeur.",
              questionEn: "Return value.",
              lang: "c",
              initialCode: "int val(int a) {\n  \n}",
              testCases: [{ input: "1", expected: "1" }],
              solutionTemplate: "return a;"
            }
          },
          {
            id: "3-5",
            moduleId: 3,
            titleFr: "Récursivité : principe et pile d'appels",
            titleEn: "Recursion: principle and call stack",
            duration: "10 min",
            contentFr: `# Récursivité\nFonctions s'appelant elles-mêmes.`,
            contentEn: `# Recursion\nFunctions calling themselves.`,
            exercise: {
              questionFr: "Factorielle récursive.",
              questionEn: "Recursive factorial.",
              lang: "c",
              initialCode: "int fact(int n) {\n  \n}",
              testCases: [{ input: "5", expected: "120" }],
              solutionTemplate: "if(n<=1) return 1; return n * fact(n-1);"
            }
          },
          {
            id: "3-6",
            moduleId: 3,
            titleFr: "Algorithmes de tri et de recherche",
            titleEn: "Sorting and searching algorithms",
            duration: "11 min",
            contentFr: `# Tri\nTri à bulles, recherche.`,
            contentEn: `# Sort\nBubble sort, search.`,
            exercise: {
              questionFr: "Retourner max(a,b).",
              questionEn: "Return max(a,b).",
              lang: "c",
              initialCode: "int max(int a, int b) {\n  \n}",
              testCases: [{ input: "5,3", expected: "5" }],
              solutionTemplate: "if(a>b) return a; return b;"
            }
          }
        ]
      },
      {
        id: 4,
        titleFr: "Introduction à JavaScript et logique de programmation appliquée",
        titleEn: "Introduction to JavaScript and applied programming logic",
        descriptionFr: "Transposer les acquis vers JS, manipuler variables, objets, fonctions fléchées.",
        descriptionEn: "Transpose knowledge to JS, manipulate variables, objects, arrow functions.",
        weekLabel: "Semaines 6-7",
        estimatedHours: "10 à 12 heures",
        objectives: [
          "Transposer les acquis algorithmiques (C) vers JS",
          "Manipuler variables, types, tableaux et objets en JS",
          "Écrire fonctions, boucles et conditions idiomatiques",
          "Utiliser la console du navigateur",
          "Comparer les paradigmes C et JS"
        ],
        lessons: [
          {
            id: "4-1",
            moduleId: 4,
            titleFr: "JavaScript dans le navigateur : console et premier script",
            titleEn: "JavaScript in browser",
            duration: "7 min",
            contentFr: `# JS Console\nHello World en JS.`,
            contentEn: `# JS Console\nHello World in JS.`,
            exercise: {
              questionFr: "Retourner 'Hello'.",
              questionEn: "Return 'Hello'.",
              lang: "js",
              initialCode: "function hello() {\n  \n}",
              testCases: [{ input: "", expected: "'Hello'" }],
              solutionTemplate: "return 'Hello';"
            }
          },
          {
            id: "4-2",
            moduleId: 4,
            titleFr: "Variables (let/const), types et coercition",
            titleEn: "Variables, types and coercion",
            duration: "9 min",
            contentFr: `# let/const\nTypes en JS.`,
            contentEn: `# let/const\nJS Types.`,
            exercise: {
              questionFr: "Additionner a et b.",
              questionEn: "Add a and b.",
              lang: "js",
              initialCode: "function add(a,b) {\n  \n}",
              testCases: [{ input: "2,3", expected: "5" }],
              solutionTemplate: "return a + b;"
            }
          },
          {
            id: "4-3",
            moduleId: 4,
            titleFr: "Tableaux, objets et méthodes courantes",
            titleEn: "Arrays, objects and methods",
            duration: "10 min",
            contentFr: `# Objets\nManipulation JSON.`,
            contentEn: `# Objects\nJSON Manipulation.`,
            exercise: {
              questionFr: "Retourner longueur du tableau arr.",
              questionEn: "Return array length.",
              lang: "js",
              initialCode: "function len(arr) {\n  \n}",
              testCases: [{ input: "[1,2,3]", expected: "3" }],
              solutionTemplate: "return arr.length;"
            }
          },
          {
            id: "4-4",
            moduleId: 4,
            titleFr: "Fonctions, fonctions fléchées et portée",
            titleEn: "Arrow functions and scope",
            duration: "9 min",
            contentFr: `# Arrow functions\n() => {}`,
            contentEn: `# Arrow functions\n() => {}`,
            exercise: {
              questionFr: "Retourner a*b.",
              questionEn: "Return a*b.",
              lang: "js",
              initialCode: "function mul(a,b) {\n  \n}",
              testCases: [{ input: "2,3", expected: "6" }],
              solutionTemplate: "return a*b;"
            }
          },
          {
            id: "4-5",
            moduleId: 4,
            titleFr: "Boucles, conditions et manipulation du DOM",
            titleEn: "Loops, conditions and DOM",
            duration: "10 min",
            contentFr: `# DOM\nModifier le document.`,
            contentEn: `# DOM\nModify document.`,
            exercise: {
              questionFr: "Retourner vrai.",
              questionEn: "Return true.",
              lang: "js",
              initialCode: "function retTrue() {\n  \n}",
              testCases: [{ input: "", expected: "true" }],
              solutionTemplate: "return true;"
            }
          },
          {
            id: "4-6",
            moduleId: 4,
            titleFr: "Du pseudo-code au JS",
            titleEn: "From pseudocode to JS",
            duration: "8 min",
            contentFr: `# Révision\nAlgorithmique en JS.`,
            contentEn: `# Review\nAlgorithms in JS.`,
            exercise: {
              questionFr: "Retourner a.",
              questionEn: "Return a.",
              lang: "js",
              initialCode: "function retA(a) {\n  \n}",
              testCases: [{ input: "5", expected: "5" }],
              solutionTemplate: "return a;"
            }
          }
        ]
      },
      {
        id: 5,
        titleFr: "Projet intégrateur, évaluation finale et certification",
        titleEn: "Integrative project, final evaluation and certification",
        descriptionFr: "Concevoir un algorithme complet, l'implémenter en C et JS, et obtenir la certification.",
        descriptionEn: "Design a complete algorithm, implement in C and JS, and get certified.",
        weekLabel: "Semaine 8",
        estimatedHours: "8 à 10 heures",
        objectives: [
          "Concevoir un algorithme complet",
          "Implémenter la même solution en C et en JavaScript",
          "Produire une documentation technique claire",
          "Présenter et défendre ses choix",
          "Consolider l'ensemble des compétences"
        ],
        lessons: [
          {
            id: "5-1",
            moduleId: 5,
            titleFr: "Cahier des charges du projet final",
            titleEn: "Final project specifications",
            duration: "6 min",
            contentFr: `# Projet\nGestionnaire d'inventaire.`,
            contentEn: `# Project\nInventory manager.`,
            exercise: {
              questionFr: "Initialiser un projet vide en retournant 0.",
              questionEn: "Init empty project returning 0.",
              lang: "js",
              initialCode: "function init() {\n  \n}",
              testCases: [{ input: "", expected: "0" }],
              solutionTemplate: "return 0;"
            }
          },
          {
            id: "5-2",
            moduleId: 5,
            titleFr: "Méthodologie de conception",
            titleEn: "Design methodology",
            duration: "8 min",
            contentFr: `# Analyse\nPseudo-code du projet.`,
            contentEn: `# Analysis\nProject pseudocode.`,
            exercise: {
              questionFr: "Retourner 1.",
              questionEn: "Return 1.",
              lang: "js",
              initialCode: "function design() {\n  \n}",
              testCases: [{ input: "", expected: "1" }],
              solutionTemplate: "return 1;"
            }
          },
          {
            id: "5-3",
            moduleId: 5,
            titleFr: "Bonnes pratiques : lisibilité, complexité, tests",
            titleEn: "Best practices",
            duration: "9 min",
            contentFr: `# Best Practices\nCode clair et testé.`,
            contentEn: `# Best Practices\nClear and tested code.`,
            exercise: {
              questionFr: "Retourner 2.",
              questionEn: "Return 2.",
              lang: "js",
              initialCode: "function practice() {\n  \n}",
              testCases: [{ input: "", expected: "2" }],
              solutionTemplate: "return 2;"
            }
          },
          {
            id: "5-4",
            moduleId: 5,
            titleFr: "Revue de code collective et retours",
            titleEn: "Peer code review",
            duration: "6 min",
            contentFr: `# Peer Review\nCorrection par les pairs.`,
            contentEn: `# Peer Review\nCorrection by peers.`,
            exercise: {
              questionFr: "Retourner 3.",
              questionEn: "Return 3.",
              lang: "js",
              initialCode: "function review() {\n  \n}",
              testCases: [{ input: "", expected: "3" }],
              solutionTemplate: "return 3;"
            }
          }
        ]
      }    ]
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
