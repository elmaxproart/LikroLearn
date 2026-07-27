const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/lib/courseData.ts');
let content = fs.readFileSync(filePath, 'utf8');

const startIndex = content.indexOf('    modules: [\n      {\n        id: 1,\n        titleFr: "Introduction à l\'Algorithmique et aux Logigrammes",');
const endIndex = content.indexOf('    ]\n  },\n  {\n    id: "react-next-201",');

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find markers", {startIndex, endIndex});
    process.exit(1);
}

const newModules = `    modules: [
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
            contentFr: \`
# Introduction à l'Algorithmique
Un **algorithme** est une suite finie et ordonnée d'instructions permettant de résoudre un problème ou d'obtenir un résultat.
- **Entrées** : Données fournies.
- **Traitement** : Étapes logiques exécutées.
- **Sorties** : Résultats renvoyés.
\`,
            contentEn: \`
# Introduction to Algorithms
An **algorithm** is a finite sequence of instructions to solve a problem.
- **Inputs**: Data provided.
- **Processing**: Logic steps executed.
- **Outputs**: Results returned.
\`,
            attachmentUrl: "/attachments/algo_lesson_1_1.pdf",
            attachmentName: "Fiche_Synthese_Introduction.pdf",
            explanationFr: "L'aire d'un rectangle est le produit de sa largeur par sa hauteur.",
            explanationEn: "The area of a rectangle is the product of its width by its height.",
            exercise: {
              questionFr: "Écrivez une fonction \\\`calculerAireRectangle(largeur, hauteur)\\\` qui retourne l'aire d'un rectangle.",
              questionEn: "Write a function \\\`calculerAireRectangle(largeur, hauteur)\\\` that returns the area of a rectangle.",
              lang: "js",
              initialCode: "function calculerAireRectangle(largeur, hauteur) {\\n  // Votre code ici\\n}",
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
            contentFr: \`
# Pseudo-code
Le **pseudo-code** est une description textuelle simplifiée d'un algorithme utilisant une syntaxe proche du langage humain.
\`,
            contentEn: \`
# Pseudocode
**Pseudocode** is a simplified textual description of an algorithm using human-like syntax.
\`,
            attachmentUrl: "/attachments/algo_lesson_1_2.pdf",
            attachmentName: "Cours_PseudoCode.pdf",
            explanationFr: "Pour échanger deux variables, on utilise une variable temporaire : \\\`let temp = a; a = b; b = temp;\\\` et retourne \\\`[b, a]\\\`.",
            explanationEn: "To swap two variables, we use a temporary variable: \\\`let temp = a; a = b; b = temp;\\\` and return \\\`[b, a]\\\`.",
            exercise: {
              questionFr: "Écrivez une fonction \\\`echangerVariables(a, b)\\\` qui retourne les deux variables échangées sous forme de tableau \\\`[b, a]\\\`.",
              questionEn: "Write a function \\\`echangerVariables(a, b)\\\` that returns the two variables swapped as an array \\\`[b, a]\\\`.",
              lang: "js",
              initialCode: "function echangerVariables(a, b) {\\n  // Votre code ici\\n}",
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
            contentFr: \`
# Organigrammes
Un **Logigramme** (flowchart) est un schéma graphique modélisant le flux (Ovale = Début/Fin, Rectangle = Action, Losange = Condition).
\`,
            contentEn: \`
# Flowcharts
A **Flowchart** is a graphic schema modeling flow (Oval = Start/End, Rectangle = Action, Diamond = Condition).
\`,
            attachmentUrl: "/attachments/algo_lesson_1_3.pdf",
            attachmentName: "Symboles_Organigrammes.pdf",
            explanationFr: "Retourner simplement le double de la valeur.",
            explanationEn: "Just return double the value.",
            exercise: {
              questionFr: "Écrivez une fonction \\\`doubleValeur(n)\\\` qui retourne le double de n.",
              questionEn: "Write a function \\\`doubleValeur(n)\\\` that returns double of n.",
              lang: "js",
              initialCode: "function doubleValeur(n) {\\n  // Votre code ici\\n}",
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
            contentFr: \`
# Variables et Types
- **Variable** : Boîte mémoire stockant une valeur (Entier, Réel, Chaîne, Booléen).
- **Affectation** : Action d'attribuer une valeur.
\`,
            contentEn: \`
# Variables and Types
- **Variable**: A memory box storing a value (Integer, Float, String, Boolean).
- **Assignment**: Storing a value.
\`,
            explanationFr: "Additionnez simplement a et b.",
            explanationEn: "Simply add a and b.",
            exercise: {
              questionFr: "Écrivez une fonction \\\`addition(a, b)\\\`.",
              questionEn: "Write a function \\\`addition(a, b)\\\`.",
              lang: "js",
              initialCode: "function addition(a, b) {\\n  // Votre code ici\\n}",
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
            contentFr: \`
# Conditions et Boucles
Introduction aux structures de contrôle de base pour diriger le flux du programme.
\`,
            contentEn: \`
# Conditions and Loops
Introduction to basic control structures to direct program flow.
\`,
            explanationFr: "Utiliser if/else ou le modulo.",
            explanationEn: "Use if/else or modulo.",
            exercise: {
              questionFr: "Écrivez une fonction \\\`estPair(n)\\\`.",
              questionEn: "Write a function \\\`estPair(n)\\\`.",
              lang: "js",
              initialCode: "function estPair(n) {\\n  // Votre code ici\\n}",
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
            contentFr: \`# GCC\\nLe compilateur C standard.\`,
            contentEn: \`# GCC\\nThe standard C compiler.\`,
            exercise: {
              questionFr: "Faites une fonction qui retourne 1.",
              questionEn: "Return 1.",
              lang: "c",
              initialCode: "int getOne() {\\n  \\n}",
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
            contentFr: \`# Structure C\\nLes inclusions et le main.\`,
            contentEn: \`# C Structure\\nIncludes and main.\`,
            exercise: {
              questionFr: "Retournez la somme de a et b.",
              questionEn: "Return sum of a and b.",
              lang: "c",
              initialCode: "int sum(int a, int b) {\\n  \\n}",
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
            contentFr: \`# IO en C\\nUtilisation de stdio.h.\`,
            contentEn: \`# IO in C\\nUsing stdio.h.\`,
            exercise: {
              questionFr: "Retourner a * b.",
              questionEn: "Return a * b.",
              lang: "c",
              initialCode: "int multiply(int a, int b) {\\n  \\n}",
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
            contentFr: \`# Conditions\\nif, else, switch.\`,
            contentEn: \`# Conditions\\nif, else, switch.\`,
            exercise: {
              questionFr: "Retourner 1 si a > b, sinon 0.",
              questionEn: "Return 1 if a > b, else 0.",
              lang: "c",
              initialCode: "int isGreater(int a, int b) {\\n  \\n}",
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
            contentFr: \`# Boucles\\nfor, while, do-while.\`,
            contentEn: \`# Loops\\nfor, while, do-while.\`,
            exercise: {
              questionFr: "Somme de 1 à n.",
              questionEn: "Sum 1 to n.",
              lang: "c",
              initialCode: "int sumN(int n) {\\n  \\n}",
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
            contentFr: \`# Mémoire\\nPile et tas.\`,
            contentEn: \`# Memory\\nStack and heap.\`,
            exercise: {
              questionFr: "Retourner n.",
              questionEn: "Return n.",
              lang: "c",
              initialCode: "int returnN(int n) {\\n  \\n}",
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
            contentFr: \`# Fonctions\\nDéfinir et appeler des fonctions.\`,
            contentEn: \`# Functions\\nDefine and call functions.\`,
            exercise: {
              questionFr: "Retournez a - b.",
              questionEn: "Return a - b.",
              lang: "c",
              initialCode: "int subtract(int a, int b) {\\n  \\n}",
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
            contentFr: \`# Tableaux\\nVecteurs en C.\`,
            contentEn: \`# Arrays\\nVectors in C.\`,
            exercise: {
              questionFr: "Retournez le premier élément d'un tableau (simulé par a).",
              questionEn: "Return first element.",
              lang: "c",
              initialCode: "int firstElement(int a) {\\n  \\n}",
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
            contentFr: \`# Matrices\\nTableaux 2D.\`,
            contentEn: \`# Matrices\\n2D Arrays.\`,
            exercise: {
              questionFr: "Simuler retour.",
              questionEn: "Simulate return.",
              lang: "c",
              initialCode: "int sim(int a) {\\n  \\n}",
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
            contentFr: \`# Pointeurs\\nAdresses mémoire.\`,
            contentEn: \`# Pointers\\nMemory addresses.\`,
            exercise: {
              questionFr: "Retourner la valeur.",
              questionEn: "Return value.",
              lang: "c",
              initialCode: "int val(int a) {\\n  \\n}",
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
            contentFr: \`# Récursivité\\nFonctions s'appelant elles-mêmes.\`,
            contentEn: \`# Recursion\\nFunctions calling themselves.\`,
            exercise: {
              questionFr: "Factorielle récursive.",
              questionEn: "Recursive factorial.",
              lang: "c",
              initialCode: "int fact(int n) {\\n  \\n}",
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
            contentFr: \`# Tri\\nTri à bulles, recherche.\`,
            contentEn: \`# Sort\\nBubble sort, search.\`,
            exercise: {
              questionFr: "Retourner max(a,b).",
              questionEn: "Return max(a,b).",
              lang: "c",
              initialCode: "int max(int a, int b) {\\n  \\n}",
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
            contentFr: \`# JS Console\\nHello World en JS.\`,
            contentEn: \`# JS Console\\nHello World in JS.\`,
            exercise: {
              questionFr: "Retourner 'Hello'.",
              questionEn: "Return 'Hello'.",
              lang: "js",
              initialCode: "function hello() {\\n  \\n}",
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
            contentFr: \`# let/const\\nTypes en JS.\`,
            contentEn: \`# let/const\\nJS Types.\`,
            exercise: {
              questionFr: "Additionner a et b.",
              questionEn: "Add a and b.",
              lang: "js",
              initialCode: "function add(a,b) {\\n  \\n}",
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
            contentFr: \`# Objets\\nManipulation JSON.\`,
            contentEn: \`# Objects\\nJSON Manipulation.\`,
            exercise: {
              questionFr: "Retourner longueur du tableau arr.",
              questionEn: "Return array length.",
              lang: "js",
              initialCode: "function len(arr) {\\n  \\n}",
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
            contentFr: \`# Arrow functions\\n() => {}\`,
            contentEn: \`# Arrow functions\\n() => {}\`,
            exercise: {
              questionFr: "Retourner a*b.",
              questionEn: "Return a*b.",
              lang: "js",
              initialCode: "function mul(a,b) {\\n  \\n}",
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
            contentFr: \`# DOM\\nModifier le document.\`,
            contentEn: \`# DOM\\nModify document.\`,
            exercise: {
              questionFr: "Retourner vrai.",
              questionEn: "Return true.",
              lang: "js",
              initialCode: "function retTrue() {\\n  \\n}",
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
            contentFr: \`# Révision\\nAlgorithmique en JS.\`,
            contentEn: \`# Review\\nAlgorithms in JS.\`,
            exercise: {
              questionFr: "Retourner a.",
              questionEn: "Return a.",
              lang: "js",
              initialCode: "function retA(a) {\\n  \\n}",
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
            contentFr: \`# Projet\\nGestionnaire d'inventaire.\`,
            contentEn: \`# Project\\nInventory manager.\`,
            exercise: {
              questionFr: "Initialiser un projet vide en retournant 0.",
              questionEn: "Init empty project returning 0.",
              lang: "js",
              initialCode: "function init() {\\n  \\n}",
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
            contentFr: \`# Analyse\\nPseudo-code du projet.\`,
            contentEn: \`# Analysis\\nProject pseudocode.\`,
            exercise: {
              questionFr: "Retourner 1.",
              questionEn: "Return 1.",
              lang: "js",
              initialCode: "function design() {\\n  \\n}",
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
            contentFr: \`# Best Practices\\nCode clair et testé.\`,
            contentEn: \`# Best Practices\\nClear and tested code.\`,
            exercise: {
              questionFr: "Retourner 2.",
              questionEn: "Return 2.",
              lang: "js",
              initialCode: "function practice() {\\n  \\n}",
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
            contentFr: \`# Peer Review\\nCorrection par les pairs.\`,
            contentEn: \`# Peer Review\\nCorrection by peers.\`,
            exercise: {
              questionFr: "Retourner 3.",
              questionEn: "Return 3.",
              lang: "js",
              initialCode: "function review() {\\n  \\n}",
              testCases: [{ input: "", expected: "3" }],
              solutionTemplate: "return 3;"
            }
          }
        ]
      }`;

const newContent = content.substring(0, startIndex) + newModules + content.substring(endIndex);

fs.writeFileSync(filePath, newContent);
console.log('Successfully replaced algo-101 course modules.');
