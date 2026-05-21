# Cahier des charges professionnel

# Plateforme CareerAI

## 1. Identification du projet

### 1.1 Intitule du projet

**CareerAI - Plateforme intelligente d'accompagnement a l'orientation, a la candidature et a la progression professionnelle**

### 1.2 Nature du projet

CareerAI est une application web full-stack destinee a accompagner les utilisateurs dans la construction de leur parcours professionnel. La plateforme combine des fonctionnalites classiques de gestion de profil avec des modules avances bases sur l'intelligence artificielle, notamment l'analyse de CV, l'optimisation ATS, la comparaison entre un CV et une offre d'emploi, la simulation d'entretien, la generation de roadmap carriere, l'analyse RIASEC et l'accompagnement par un mentor IA contextuel.

### 1.3 Porteur du projet

Ce projet s'inscrit dans le cadre d'un projet de fin d'etudes visant a concevoir, developper et presenter une solution numerique moderne, utile et evolutive dans le domaine de l'employabilite, de l'orientation professionnelle et du recrutement intelligent.

### 1.4 Type de solution

La solution est une application web responsive composee de deux parties principales :

- **Frontend** : interface utilisateur developpee avec React, Vite et Tailwind CSS.
- **Backend** : API REST developpee avec Laravel, connectee a une base de donnees MySQL.

L'application integre egalement des services d'intelligence artificielle via l'API Gemini afin de fournir des analyses personnalisees et des recommandations exploitables.

---

## 2. Contexte general

### 2.1 Contexte professionnel

Le marche de l'emploi est devenu fortement numerise. Les recruteurs utilisent de plus en plus d'outils automatises pour trier les candidatures, analyser les CV, detecter les competences et evaluer l'adequation entre un profil et une offre. Parmi ces outils, les systemes ATS, ou Applicant Tracking Systems, occupent une place centrale.

Ces systemes permettent aux entreprises de traiter rapidement un grand volume de candidatures, mais ils creent aussi de nouvelles difficultes pour les candidats. Un CV mal structure, peu optimise ou depourvu de mots-cles pertinents peut etre rejete avant meme d'etre lu par un recruteur humain.

En parallele, les candidats manquent souvent d'outils leur permettant de :

- comprendre leur profil professionnel ;
- identifier les metiers qui correspondent a leurs preferences ;
- construire un CV adapte au marche ;
- preparer efficacement leurs entretiens ;
- suivre leur progression ;
- organiser leurs objectifs de formation ;
- valoriser leur profil sur une page professionnelle publique.

CareerAI repond a ces besoins en centralisant plusieurs services d'accompagnement carriere dans une seule plateforme.

### 2.2 Contexte technologique

Les progres recents de l'intelligence artificielle generative permettent de produire des analyses plus personnalisees et plus rapides. Les modeles comme Gemini peuvent analyser du texte, comparer des documents, generer des recommandations et simuler des interactions de coaching.

Dans ce contexte, CareerAI exploite l'IA non pas comme un simple outil de generation de texte, mais comme un moteur d'aide a la decision pour accompagner l'utilisateur dans ses choix professionnels.

### 2.3 Problematique

La problematique principale du projet peut etre formulee ainsi :

**Comment concevoir une plateforme web intelligente, ergonomique et securisee permettant a un utilisateur de mieux comprendre son profil, d'optimiser ses candidatures, de se preparer aux entretiens et de suivre sa progression professionnelle ?**

Cette problematique implique plusieurs sous-questions :

- Comment analyser automatiquement un CV selon des criteres ATS ?
- Comment comparer le profil d'un utilisateur avec une offre d'emploi ?
- Comment rendre l'orientation professionnelle plus personnalisee ?
- Comment motiver l'utilisateur a completer son profil et utiliser la plateforme ?
- Comment presenter les resultats sous une forme claire, visuelle et professionnelle ?
- Comment garantir la securite des donnees personnelles ?

---

## 3. Objectifs du projet

### 3.1 Objectif general

L'objectif principal de CareerAI est de fournir une plateforme d'accompagnement professionnel complete, moderne et intelligente permettant a chaque utilisateur d'ameliorer sa preparation au marche de l'emploi.

La plateforme doit permettre a l'utilisateur de passer d'un profil brut a un profil professionnel structure, analyse, valorise et pret a etre presente aux recruteurs.

### 3.2 Objectifs fonctionnels

Les objectifs fonctionnels sont les suivants :

- permettre l'inscription et la connexion securisee des utilisateurs ;
- permettre la gestion du profil personnel et professionnel ;
- permettre la creation et l'exportation d'un CV ;
- analyser un CV PDF et fournir un score ATS ;
- comparer un CV avec une offre d'emploi ;
- identifier les competences presentes et manquantes ;
- generer des recommandations de formation ;
- proposer un quiz RIASEC d'orientation professionnelle ;
- generer une roadmap carriere personnalisee ;
- permettre la simulation d'entretiens ;
- sauvegarder l'historique des entretiens ;
- afficher des statistiques personnelles ;
- mettre en place un systeme de badges, points et niveaux ;
- proposer un portfolio public partageable ;
- integrer un mentor IA contextuel disponible sur toutes les pages ;
- proposer une interface responsive, premium et agreable a utiliser.

### 3.3 Objectifs techniques

Les objectifs techniques sont les suivants :

- construire une architecture claire entre frontend et backend ;
- exposer des API REST documentables et reutilisables ;
- utiliser Laravel Sanctum pour l'authentification ;
- stocker les donnees dans une base MySQL relationnelle ;
- integrer l'API Gemini pour les analyses IA ;
- extraire le texte des CV PDF avec une librairie adaptee ;
- structurer les donnees complexes en JSON lorsque cela est pertinent ;
- garantir la maintenabilite du code ;
- assurer une bonne experience utilisateur sur desktop et mobile.

### 3.4 Objectifs ergonomiques

L'interface doit donner une impression de produit professionnel et abouti. Elle doit etre :

- claire ;
- moderne ;
- responsive ;
- coherente ;
- fluide ;
- accessible ;
- lisible ;
- orientee action.

Le design doit eviter l'effet prototype et se rapprocher d'une application SaaS premium, avec des cartes bien structurees, des statistiques lisibles, des jauges, des timelines, des badges et des composants visuels soignes.

---

## 4. Perimetre du projet

### 4.1 Perimetre inclus

Le projet inclut les modules suivants :

1. Authentification et gestion de session.
2. Dashboard principal.
3. Gestion du profil utilisateur.
4. CV Builder.
5. Analyse ATS du CV.
6. Comparaison CV / offre d'emploi.
7. Quiz RIASEC.
8. Roadmap de carriere interactive.
9. Simulation d'entretien.
10. Historique des entretiens.
11. Analytics personnel.
12. Gamification.
13. Portfolio public.
14. Mentor IA contextuel.
15. Notifications.
16. Parametres utilisateur.
17. Export PDF pour certains contenus.
18. Support multilingue partiel ou complet selon les pages.
19. Mode sombre.

### 4.2 Perimetre non inclus

Les elements suivants ne font pas partie du perimetre principal de la version actuelle :

- paiement en ligne ;
- abonnement premium ;
- gestion multi-entreprises ;
- espace recruteur complet ;
- messagerie entre recruteurs et candidats ;
- verification officielle des diplomes ;
- signature electronique ;
- integration directe avec LinkedIn ;
- candidature automatique aux offres ;
- application mobile native Android ou iOS.

Ces elements peuvent cependant etre envisages dans les perspectives d'evolution.

---

## 5. Public cible

### 5.1 Utilisateurs principaux

La plateforme s'adresse principalement aux profils suivants :

- etudiants en fin de formation ;
- jeunes diplomes ;
- chercheurs d'emploi ;
- personnes en reconversion professionnelle ;
- candidats souhaitant ameliorer leur CV ;
- utilisateurs souhaitant preparer leurs entretiens ;
- professionnels souhaitant mieux valoriser leur parcours.

### 5.2 Besoins des utilisateurs

Les besoins identifies sont :

- comprendre son profil professionnel ;
- obtenir des recommandations personnalisees ;
- construire un CV clair et efficace ;
- verifier la compatibilite de son CV avec les ATS ;
- adapter son CV a une offre precise ;
- identifier les competences a developper ;
- s'entrainer aux entretiens ;
- suivre sa progression dans le temps ;
- disposer d'un portfolio public professionnel ;
- obtenir des conseils rapides via un assistant IA.

### 5.3 Contraintes utilisateurs

Les utilisateurs peuvent avoir des niveaux de competence variables en informatique. L'application doit donc rester simple a utiliser, meme pour des personnes non techniques.

Elle doit aussi etre accessible depuis :

- un ordinateur portable ;
- un ordinateur de bureau ;
- une tablette ;
- un smartphone.

---

## 6. Description generale de la solution

CareerAI se presente comme une plateforme centralisee dans laquelle l'utilisateur peut gerer tous les aspects de sa preparation professionnelle.

Apres inscription, l'utilisateur accede a un dashboard contenant un resume de son profil, ses scores, ses badges, son niveau, ses notifications recentes et des raccourcis vers les modules principaux.

L'utilisateur peut ensuite :

- creer ou enrichir son CV ;
- uploader un CV PDF pour obtenir un score ATS ;
- coller une offre d'emploi pour mesurer la compatibilite ;
- passer un quiz RIASEC ;
- consulter une roadmap personnalisee ;
- s'entrainer a un entretien ;
- consulter l'historique de ses sessions ;
- suivre ses statistiques ;
- activer son portfolio public ;
- discuter avec un mentor IA.

La logique IA est principalement assuree par Gemini. Cependant, certains modules disposent de comportements de secours afin que l'application reste exploitable meme si la cle API n'est pas configuree ou si le service IA est temporairement indisponible.

---

## 7. Specifications fonctionnelles detaillees

## 7.1 Authentification

### 7.1.1 Inscription

L'utilisateur doit pouvoir creer un compte en renseignant :

- nom ;
- adresse email ;
- mot de passe.

Le systeme doit verifier l'unicite de l'email et enregistrer le mot de passe sous forme hachee.

Apres inscription, un token d'authentification est genere afin de permettre l'acces aux routes protegees.

### 7.1.2 Connexion

L'utilisateur doit pouvoir se connecter avec :

- email ;
- mot de passe.

Si les informations sont correctes, le systeme retourne un token d'authentification.

### 7.1.3 Deconnexion

L'utilisateur doit pouvoir se deconnecter. Le token actif est supprime et l'utilisateur est redirige vers la page de connexion.

### 7.1.4 Securite de l'authentification

L'authentification repose sur Laravel Sanctum. Les routes sensibles sont protegees par un middleware d'authentification.

---

## 7.2 Gestion du profil utilisateur

### 7.2.1 Informations personnelles

L'utilisateur peut renseigner :

- telephone ;
- adresse ;
- resume professionnel ;
- email ;
- nom.

### 7.2.2 Experiences professionnelles

L'utilisateur peut enregistrer ses experiences professionnelles avec :

- titre du poste ;
- entreprise ;
- date de debut ;
- date de fin ;
- description.

### 7.2.3 Formations

L'utilisateur peut enregistrer ses formations avec :

- diplome ;
- etablissement ;
- annee.

### 7.2.4 Competences

L'utilisateur peut renseigner ses competences techniques et transversales. Ces competences sont reutilisees par plusieurs modules :

- comparaison CV / offre ;
- mentor IA ;
- analytics ;
- portfolio public ;
- calcul de completion du profil.

---

## 7.3 Dashboard principal

### 7.3.1 Objectif

Le dashboard constitue le point d'entree principal de l'application apres connexion. Il doit fournir une vision synthetique de l'avancement de l'utilisateur.

### 7.3.2 Elements affiches

Le dashboard affiche :

- message de bienvenue personnalise ;
- niveau utilisateur ;
- nombre de points ;
- progression du profil ;
- dernier score ATS ;
- dernier score d'entretien ;
- nombre de badges debloques ;
- notifications recentes ;
- raccourcis vers les modules importants.

### 7.3.3 Design attendu

Le dashboard doit avoir une apparence premium :

- cartes statistiques ;
- sections bien separees ;
- boutons d'action visibles ;
- couleurs sobres ;
- contraste suffisant ;
- lisibilite sur tous les formats d'ecran.

---

## 7.4 Constructeur de CV

### 7.4.1 Objectif

Le CV Builder permet a l'utilisateur de construire un CV structure a partir de formulaires guides.

### 7.4.2 Etapes du CV Builder

Le processus de creation du CV est organise en plusieurs etapes :

1. Informations personnelles.
2. Formation.
3. Experience.
4. Competences.
5. Apercu et export.

### 7.4.3 Fonctionnalites

Le module permet :

- la saisie progressive des donnees ;
- l'affichage d'un apercu du CV ;
- l'export du CV en PDF ;
- la demande de feedback IA ;
- le declenchement d'un badge apres generation du CV.

### 7.4.4 Feedback IA

Le feedback IA doit evaluer :

- la qualite du resume professionnel ;
- l'utilisation de verbes d'action ;
- la presence de resultats quantifies ;
- la pertinence des competences ;
- l'optimisation ATS globale.

---

## 7.5 Analyse ATS du CV

### 7.5.1 Objectif

Le module d'analyse ATS permet a l'utilisateur d'uploader son CV en PDF afin d'obtenir un score de compatibilite avec les systemes de suivi de candidatures.

### 7.5.2 Parcours utilisateur

Le parcours attendu est le suivant :

1. L'utilisateur ouvre la page CV Intelligence.
2. Il selectionne un fichier PDF.
3. Il clique sur le bouton d'analyse.
4. Une barre de progression s'affiche.
5. Le backend extrait le texte du PDF.
6. Le texte est envoye a Gemini avec un prompt specialise.
7. Le systeme retourne un score et un rapport structure.
8. Les resultats sont affiches dans une interface visuelle.

### 7.5.3 Criteres d'analyse

L'analyse doit prendre en compte :

- mots-cles metier presents ;
- verbes d'action ;
- resultats quantifiables ;
- structure du CV ;
- longueur du document ;
- lisibilite ATS ;
- presence de sections essentielles.

### 7.5.4 Resultats attendus

Le resultat contient :

- score sur 100 ;
- liste des forces ;
- liste des faiblesses ;
- suggestions d'amelioration ;
- date de l'analyse ;
- sauvegarde en base de donnees.

### 7.5.5 Route backend

Route principale :

```text
POST /api/cv/analyze
```

### 7.5.6 Donnees sauvegardees

Table :

```text
cv_analyses
```

Champs principaux :

- id ;
- user_id ;
- original_filename ;
- cv_text ;
- score ;
- strengths ;
- weaknesses ;
- suggestions ;
- created_at ;
- updated_at.

---

## 7.6 Comparaison CV / Offre d'emploi

### 7.6.1 Objectif

Ce module permet de comparer le CV de l'utilisateur avec une offre d'emploi precise afin d'evaluer son taux de compatibilite.

### 7.6.2 Parcours utilisateur

Le parcours attendu est le suivant :

1. L'utilisateur colle une offre d'emploi.
2. Le systeme recupere le dernier CV analyse ou reconstruit le profil depuis les donnees utilisateur.
3. Le backend envoie le CV et l'offre a Gemini.
4. Le systeme retourne un score de compatibilite.
5. L'interface affiche les competences presentes et manquantes.
6. Des recommandations de formation sont proposees.

### 7.6.3 Resultats attendus

Le resultat contient :

- score de compatibilite sur 100 ;
- competences presentes dans le CV et l'offre ;
- competences manquantes ;
- recommandations pour ameliorer le profil ;
- sauvegarde en base.

### 7.6.4 Route backend

```text
POST /api/cv/compare
```

### 7.6.5 Donnees sauvegardees

Table :

```text
cv_comparisons
```

Champs principaux :

- id ;
- user_id ;
- job_offer_text ;
- match_score ;
- matched_skills ;
- missing_skills ;
- recommendations ;
- created_at.

---

## 7.7 Quiz RIASEC

### 7.7.1 Objectif

Le quiz RIASEC permet d'identifier les tendances professionnelles de l'utilisateur selon le modele de Holland.

### 7.7.2 Dimensions RIASEC

Le modele repose sur six dimensions :

- R : Realistic ;
- I : Investigative ;
- A : Artistic ;
- S : Social ;
- E : Enterprising ;
- C : Conventional.

### 7.7.3 Fonctionnement

L'utilisateur repond a une serie de questions. Chaque reponse contribue a un score par categorie. Les resultats sont transmis a Gemini afin de generer une interpretation personnalisee.

### 7.7.4 Resultats attendus

Le systeme retourne :

- type de personnalite professionnelle ;
- scores RIASEC ;
- analyse textuelle ;
- metiers recommandes ;
- competences requises ;
- roadmap de base.

### 7.7.5 Route backend

```text
POST /api/quiz
```

### 7.7.6 Donnees sauvegardees

Table :

```text
quiz_results
```

Champs principaux :

- user_id ;
- personality_type ;
- recommended_jobs ;
- score_data.

---

## 7.8 Roadmap de carriere interactive

### 7.8.1 Objectif

La roadmap permet a l'utilisateur de transformer les resultats du quiz RIASEC en plan d'action concret.

### 7.8.2 Contenu de la roadmap

Chaque roadmap contient plusieurs etapes, par exemple :

- clarification du poste cible ;
- acquisition de competences techniques ;
- certifications recommandees ;
- formations en ligne ;
- projets pratiques ;
- preparation du portfolio ;
- strategie de candidature.

### 7.8.3 Caracteristiques

La roadmap doit etre :

- visuelle ;
- interactive ;
- organisee en timeline ;
- exportable en PDF ;
- sauvegardee en base ;
- actualisee avec un cache de 24 heures afin de limiter les appels IA.

### 7.8.4 Progression

L'utilisateur peut cocher une etape comme terminee. La progression est sauvegardee dans une table dediee.

### 7.8.5 Routes backend

```text
GET /api/roadmap
PATCH /api/roadmap/progress
```

### 7.8.6 Donnees sauvegardees

Tables :

```text
roadmaps
roadmap_progress
```

Champs principaux :

- user_id ;
- riasec_type ;
- steps ;
- step_id ;
- completed ;
- completed_at.

---

## 7.9 Simulation d'entretien

### 7.9.1 Objectif

Le simulateur d'entretien aide l'utilisateur a se preparer a un entretien pour un poste donne.

### 7.9.2 Parametres

L'utilisateur renseigne :

- le titre du poste ;
- le niveau vise : junior, senior ou lead.

### 7.9.3 Generation IA

Gemini genere une liste de questions adaptees au poste et au niveau. Chaque question est accompagnee de :

- raison de la question ;
- strategie de reponse ;
- mots-cles recommandes ;
- structure STAR.

### 7.9.4 Reponse utilisateur

L'utilisateur peut rediger sa reponse directement dans l'interface. La reponse est ensuite sauvegardee dans l'historique.

### 7.9.5 Route backend

```text
POST /api/interview/generate
```

---

## 7.10 Historique des entretiens

### 7.10.1 Objectif

Le module d'historique permet de conserver toutes les sessions d'entretien afin que l'utilisateur puisse suivre sa progression.

### 7.10.2 Fonctionnalites

Le module permet :

- d'afficher la liste des sessions passees ;
- de consulter les questions d'une session ;
- de voir les reponses donnees ;
- de lire le feedback IA ;
- de visualiser le score STAR ;
- d'afficher un graphique de progression ;
- de rejouer une session.

### 7.10.3 Routes backend

```text
GET /api/interviews
POST /api/interviews
GET /api/interviews/{id}
```

### 7.10.4 Donnees sauvegardees

Tables :

```text
interview_sessions
interview_questions
```

Champs principaux :

- session_id ;
- user_id ;
- job_title ;
- overall_score ;
- question ;
- user_answer ;
- ai_feedback ;
- star_score.

---

## 7.11 Gamification

### 7.11.1 Objectif

La gamification vise a renforcer l'engagement utilisateur en recompensant les actions importantes.

### 7.11.2 Mecanismes

Le systeme repose sur :

- points ;
- badges ;
- niveaux ;
- notifications ;
- progression du profil.

### 7.11.3 Liste des badges

| Badge              |                                Condition | Points |
| ------------------ | ---------------------------------------: | -----: |
| Premiere connexion |          Creer un compte ou se connecter |     10 |
| CV cree            |     Generer ou telecharger un premier CV |     50 |
| Quiz complete      |                  Terminer le quiz RIASEC |     30 |
| Entretien simule   |   Sauvegarder une simulation d'entretien |     40 |
| Profil complet     | Renseigner les informations essentielles |    100 |
| Score ATS          |                           Analyser un CV |     20 |
| Expert             |                     Atteindre 500 points |    200 |

### 7.11.4 Niveaux

Les niveaux sont :

- Debutant ;
- Intermediaire ;
- Expert.

### 7.11.5 Routes backend

```text
GET /api/badges
POST /api/badges/check
```

### 7.11.6 Donnees sauvegardees

Tables :

```text
badges
user_badges
user_points
```

---

## 7.12 Analytics personnel

### 7.12.1 Objectif

Le module analytics permet a l'utilisateur de suivre ses performances et son evolution.

### 7.12.2 Indicateurs affiches

Le tableau de bord analytique affiche :

- evolution du score ATS ;
- evolution du score d'entretien ;
- nombre de simulations par semaine ;
- score moyen des entretiens ;
- competences les plus mentionnees ;
- progression des badges ;
- niveau utilisateur ;
- points accumules.

### 7.12.3 Filtres

L'utilisateur peut filtrer les donnees selon :

- 7 jours ;
- 30 jours ;
- 3 mois.

### 7.12.4 Export

Les statistiques peuvent etre exportees en PDF.

### 7.12.5 Route backend

```text
GET /api/analytics
```

---

## 7.13 Portfolio public

### 7.13.1 Objectif

Le portfolio public permet a l'utilisateur de partager une page professionnelle contenant les informations principales de son profil.

### 7.13.2 URL

Le portfolio est accessible via une URL de type :

```text
/portfolio/{username}
```

### 7.13.3 Sections du portfolio

Le portfolio affiche :

- nom ;
- resume professionnel ;
- competences ;
- experiences ;
- formations ;
- email de contact ;
- score ATS recent ;
- nombre de vues.

### 7.13.4 Visibilite

L'utilisateur peut activer ou desactiver la visibilite publique de son portfolio depuis les parametres ou la page portfolio.

### 7.13.5 Routes backend

```text
GET /api/portfolio
PUT /api/portfolio
GET /api/portfolio/{username}
```

### 7.13.6 Donnees sauvegardees

Table :

```text
portfolios
```

Champs :

- user_id ;
- is_public ;
- custom_url ;
- views_count ;
- created_at.

---

## 7.14 Mentor IA contextuel

### 7.14.1 Objectif

Le mentor IA est un assistant flottant disponible sur toutes les pages de l'application. Il accompagne l'utilisateur en tenant compte de son profil.

### 7.14.2 Informations contextuelles utilisees

Le prompt systeme integre notamment :

- nom de l'utilisateur ;
- profil RIASEC ;
- competences ;
- dernier score ATS ;
- resume professionnel ;
- historique recent de conversation.

### 7.14.3 Fonctionnalites

Le mentor peut :

- conseiller sur l'amelioration du CV ;
- expliquer les scores ATS ;
- aider a preparer un entretien ;
- recommander des formations ;
- guider l'utilisateur dans la plateforme ;
- proposer des actions en fonction du profil.

### 7.14.4 Interface

L'interface du mentor contient :

- bouton flottant ;
- fenetre de chat ;
- bulles de messages ;
- indicateur de saisie ;
- historique persistant ;
- design coherent avec le reste de l'application.

### 7.14.5 Routes backend

```text
GET /api/chat/history
POST /api/chat
```

---

## 7.15 Notifications

### 7.15.1 Objectif

Les notifications permettent d'informer l'utilisateur des evenements importants.

### 7.15.2 Types d'evenements

Exemples :

- badge debloque ;
- quiz complete ;
- CV analyse ;
- CV telecharge ;
- entretien sauvegarde ;
- action reussie.

### 7.15.3 Fonctionnalites

Le systeme permet :

- affichage des notifications ;
- marquage comme lu ;
- suppression ;
- centre d'activite dans la sidebar.

### 7.15.4 Routes backend

```text
GET /api/notifications
POST /api/notifications
PUT /api/notifications/{id}/read
PUT /api/notifications/read-all
DELETE /api/notifications/{id}
```

---

## 8. Specifications techniques

## 8.1 Architecture generale

L'application adopte une architecture client-serveur.

Le frontend React communique avec le backend Laravel via des requetes HTTP vers une API REST. Le backend traite les demandes, interagit avec la base de donnees, appelle les services IA externes si necessaire, puis retourne des reponses JSON.

### 8.1.1 Schema logique

```text
Utilisateur
    |
    v
Frontend React / Vite
    |
    v
API REST Laravel
    |
    +--> Base de donnees MySQL
    |
    +--> API Gemini
    |
    +--> Extraction PDF
```

## 8.2 Stack technique

### 8.2.1 Frontend

Technologies utilisees :

- React ;
- Vite ;
- Tailwind CSS ;
- Lucide React ;
- Axios ;
- React Router DOM ;
- html2pdf.js ;
- i18next ;
- Framer Motion.

### 8.2.2 Backend

Technologies utilisees :

- Laravel ;
- PHP 8.2 ;
- Laravel Sanctum ;
- MySQL ;
- Eloquent ORM ;
- API HTTP Laravel ;
- Smalot PDF Parser.

### 8.2.3 Intelligence artificielle

Service utilise :

- Google Gemini API.

Modele cible :

- Gemini Flash, adapte aux reponses rapides et aux analyses textuelles.

## 8.3 Communication frontend/backend

La communication se fait via Axios. Chaque requete protegee inclut un token d'authentification dans l'en-tete :

```text
Authorization: Bearer {token}
```

Les donnees sont echangees au format JSON, sauf pour l'upload de CV qui utilise `multipart/form-data`.

## 8.4 Base de donnees

### 8.4.1 SGBD

Le systeme utilise MySQL.

### 8.4.2 Principales tables

Les tables principales sont :

- users ;
- profiles ;
- educations ;
- experiences ;
- skills ;
- quiz_results ;
- cv_analyses ;
- cv_comparisons ;
- interview_sessions ;
- interview_questions ;
- roadmaps ;
- roadmap_progress ;
- badges ;
- user_badges ;
- user_points ;
- portfolios ;
- notifications ;
- chat_messages ;
- cover_letters.

### 8.4.3 Utilisation des champs JSON

Certains champs sont stockes en JSON afin de conserver une structure flexible :

- strengths ;
- weaknesses ;
- suggestions ;
- matched_skills ;
- missing_skills ;
- recommendations ;
- recommended_jobs ;
- score_data ;
- steps.

---

## 9. Specifications de securite

## 9.1 Authentification

L'authentification est assuree par Laravel Sanctum. Les routes sensibles sont protegees par le middleware `auth:sanctum`.

## 9.2 Mots de passe

Les mots de passe ne sont jamais stockes en clair. Ils sont haches avant sauvegarde.

## 9.3 Controle d'acces

Chaque ressource associee a un utilisateur doit etre verifiee avant consultation ou modification. Par exemple, un utilisateur ne doit pas pouvoir consulter l'historique d'entretien d'un autre utilisateur.

## 9.4 Protection des donnees

Les donnees traitees peuvent contenir des informations personnelles sensibles. Il est donc necessaire de :

- limiter l'exposition des donnees ;
- verifier les droits d'acces ;
- eviter les erreurs de configuration ;
- proteger les routes API ;
- filtrer les entrees utilisateur.

## 9.5 Upload de fichiers

L'upload de CV doit respecter les contraintes suivantes :

- format PDF uniquement ;
- taille limitee ;
- validation cote backend ;
- extraction texte securisee ;
- rejet des fichiers invalides.

## 9.6 API IA

La cle API Gemini doit etre stockee dans le fichier `.env` du backend et ne doit jamais etre exposee dans le frontend.

---

## 10. Specifications UI/UX

## 10.1 Principes de design

L'interface doit etre professionnelle, moderne et orientee productivite. Elle doit reprendre les codes d'une application SaaS premium :

- navigation laterale claire ;
- cartes statistiques ;
- boutons d'action visibles ;
- jauges de progression ;
- timelines ;
- badges ;
- graphiques ;
- contrastes soignes ;
- mode sombre coherent.

## 10.2 Responsive design

L'application doit etre utilisable sur :

- mobile ;
- tablette ;
- ordinateur portable ;
- grand ecran.

La navigation mobile doit rester accessible, et les contenus doivent s'adapter sans chevauchement.

## 10.3 Accessibilite

Les exigences minimales sont :

- contraste suffisant ;
- tailles de texte lisibles ;
- labels sur les champs ;
- etats de chargement visibles ;
- messages d'erreur explicites ;
- navigation claire.

## 10.4 Experience utilisateur

L'utilisateur doit toujours comprendre :

- ou il se trouve ;
- ce qu'il peut faire ;
- quel est le resultat de son action ;
- quelle est la prochaine etape recommandee.

---

## 11. Contraintes techniques

## 11.1 Contraintes backend

- utiliser Laravel comme framework principal ;
- respecter la structure MVC ;
- exposer des routes API REST ;
- utiliser Eloquent pour l'acces aux donnees ;
- proteger les routes privees ;
- valider les donnees recues ;
- gerer les erreurs IA de maniere propre.

## 11.2 Contraintes frontend

- utiliser React ;
- utiliser des composants reutilisables ;
- maintenir une navigation fluide ;
- utiliser Tailwind CSS pour le style ;
- respecter le mode sombre ;
- conserver une interface responsive ;
- eviter les pages surchargees.

## 11.3 Contraintes IA

- limiter les appels inutiles a Gemini ;
- prevoir des fallbacks si l'API est indisponible ;
- demander des reponses JSON structurees lorsque necessaire ;
- nettoyer les reponses IA avant exploitation ;
- ne pas exposer la cle API.

## 11.4 Contraintes de performance

- limiter les donnees chargees inutilement ;
- utiliser des requetes ciblees ;
- optimiser les composants lourds ;
- surveiller la taille du bundle frontend ;
- envisager le lazy loading pour les pages lourdes.

---

## 12. Regles de gestion

## 12.1 Regles liees aux badges

- Un badge ne peut etre attribue qu'une seule fois a un utilisateur.
- Les points associes a un badge sont ajoutes au total utilisateur.
- Le niveau est recalcule apres l'ajout de points.
- Une notification est creee lorsqu'un badge est debloque.

## 12.2 Regles liees au portfolio

- Un utilisateur possede au maximum un portfolio.
- L'URL personnalisee doit etre unique.
- Un portfolio prive ne doit pas etre visible publiquement.
- Le nombre de vues augmente lorsqu'un portfolio public est consulte.

## 12.3 Regles liees a l'analyse ATS

- Seuls les fichiers PDF sont acceptes.
- Le score doit etre compris entre 0 et 100.
- Les resultats doivent etre associes a l'utilisateur connecte.
- Une analyse doit etre sauvegardee apres traitement.

## 12.4 Regles liees aux entretiens

- Une session appartient a un seul utilisateur.
- Une session contient au moins une question.
- Chaque question peut contenir une reponse utilisateur et un feedback.
- Le score global est compris entre 0 et 100.

## 12.5 Regles liees a la roadmap

- Une roadmap est liee a un utilisateur.
- Une roadmap peut etre regeneree apres expiration du cache.
- La progression d'une etape est sauvegardee independamment.

---

## 13. Criteres d'acceptation

## 13.1 Authentification

Le module est accepte si :

- un utilisateur peut s'inscrire ;
- un utilisateur peut se connecter ;
- un utilisateur peut se deconnecter ;
- les routes protegees refusent les utilisateurs non connectes.

## 13.2 Dashboard

Le module est accepte si :

- les statistiques principales s'affichent ;
- les badges sont visibles ;
- les notifications recentes sont affichees ;
- les raccourcis fonctionnent.

## 13.3 Analyse ATS

Le module est accepte si :

- l'utilisateur peut uploader un PDF ;
- le backend extrait le texte ;
- un score est genere ;
- les forces, faiblesses et suggestions sont affichees ;
- le resultat est sauvegarde.

## 13.4 Comparaison CV / offre

Le module est accepte si :

- l'utilisateur peut coller une offre ;
- un score de compatibilite est retourne ;
- les competences matchees sont affichees ;
- les competences manquantes sont affichees ;
- les recommandations sont visibles.

## 13.5 Roadmap

Le module est accepte si :

- une roadmap est generee ;
- les etapes sont affichees ;
- l'utilisateur peut cocher une etape ;
- la progression est sauvegardee ;
- l'export PDF fonctionne.

## 13.6 Entretiens

Le module est accepte si :

- l'utilisateur peut generer des questions ;
- il peut repondre aux questions ;
- la session peut etre sauvegardee ;
- l'historique est consultable ;
- le bouton rejouer fonctionne.

## 13.7 Portfolio

Le module est accepte si :

- l'utilisateur peut definir une URL ;
- il peut activer ou desactiver la visibilite ;
- la page publique s'affiche si elle est active ;
- la page est inaccessible si elle est privee.

## 13.8 Mentor IA

Le module est accepte si :

- le bouton flottant est visible ;
- l'utilisateur peut envoyer un message ;
- l'IA repond en tenant compte du profil ;
- l'historique est conserve.

---

## 14. Planning previsionnel

## 14.1 Phase 1 - Analyse et conception

Objectifs :

- analyser le besoin ;
- identifier les utilisateurs cibles ;
- definir les fonctionnalites ;
- choisir la stack technique ;
- concevoir la structure de la base de donnees.

Livrables :

- cahier des charges ;
- diagrammes de base ;
- architecture globale.

## 14.2 Phase 2 - Mise en place du socle technique

Objectifs :

- initialiser le backend Laravel ;
- initialiser le frontend React ;
- configurer la base de donnees ;
- mettre en place l'authentification ;
- creer les premieres routes API.

Livrables :

- backend fonctionnel ;
- frontend fonctionnel ;
- connexion API ;
- authentification.

## 14.3 Phase 3 - Modules profil et CV

Objectifs :

- creer la gestion du profil ;
- creer le CV Builder ;
- ajouter l'export PDF ;
- integrer le feedback IA.

Livrables :

- module profil ;
- CV Builder ;
- export PDF ;
- analyse IA du contenu.

## 14.4 Phase 4 - Modules IA avances

Objectifs :

- ajouter l'analyse ATS PDF ;
- ajouter la comparaison CV / offre ;
- ajouter le quiz RIASEC ;
- generer les roadmaps.

Livrables :

- analyse ATS ;
- comparaison CV/offre ;
- quiz ;
- roadmap interactive.

## 14.5 Phase 5 - Entretien, analytics et gamification

Objectifs :

- developper le simulateur d'entretien ;
- sauvegarder l'historique ;
- ajouter les graphiques ;
- mettre en place les badges et points.

Livrables :

- simulation d'entretien ;
- historique ;
- analytics ;
- gamification.

## 14.6 Phase 6 - Portfolio et mentor IA

Objectifs :

- creer le portfolio public ;
- ajouter les parametres de visibilite ;
- integrer le mentor IA contextuel ;
- sauvegarder l'historique de conversation.

Livrables :

- portfolio public ;
- parametres portfolio ;
- chatbot contextuel ;
- historique chat.

## 14.7 Phase 7 - Tests et finalisation

Objectifs :

- tester les routes API ;
- tester le build frontend ;
- verifier les migrations ;
- corriger les erreurs ;
- ameliorer l'interface ;
- preparer la presentation.

Livrables :

- application finalisee ;
- cahier des charges ;
- rapport technique ;
- demonstration fonctionnelle.

---

## 15. Risques et mesures de mitigation

## 15.1 Risque lie a l'API IA

### Risque

L'API Gemini peut etre indisponible, lente ou mal configuree.

### Mesures

- gerer les erreurs proprement ;
- retourner des messages explicites ;
- prevoir des resultats de secours ;
- eviter de bloquer toute l'application.

## 15.2 Risque lie a l'extraction PDF

### Risque

Certains PDF peuvent etre difficiles a parser, notamment les CV scannes sous forme d'image.

### Mesures

- limiter le format aux PDF ;
- afficher une erreur claire si le texte est vide ;
- proposer un fallback ;
- envisager une future integration OCR.

## 15.3 Risque lie aux donnees personnelles

### Risque

Les CV et profils contiennent des donnees sensibles.

### Mesures

- proteger les routes ;
- limiter l'exposition des donnees ;
- utiliser l'authentification ;
- respecter la separation des donnees par utilisateur.

## 15.4 Risque lie a la complexite fonctionnelle

### Risque

Le nombre de modules peut rendre l'application difficile a maintenir.

### Mesures

- separer les responsabilites ;
- creer des controllers dedies ;
- utiliser des composants React clairs ;
- documenter les routes et les tables.

## 15.5 Risque lie a la performance frontend

### Risque

Les bibliotheques comme html2pdf peuvent augmenter la taille du bundle.

### Mesures

- surveiller les warnings de build ;
- envisager du lazy loading ;
- separer les pages lourdes ;
- optimiser les imports.

---

## 16. Perspectives d'evolution

Plusieurs evolutions peuvent etre envisagees :

- ajout d'un espace recruteur ;
- integration LinkedIn ;
- import automatique du profil depuis un CV ;
- OCR pour les CV scannes ;
- scoring plus avance avec ponderation par metier ;
- recommandations d'offres d'emploi ;
- generation automatique de lettres de motivation ciblees ;
- systeme d'abonnement premium ;
- notifications temps reel avec WebSockets ;
- application mobile native ;
- tableau de bord administrateur ;
- evaluation orale avec enregistrement audio ;
- analyse video d'entretien ;
- partage public de roadmap ;
- certification interne de progression.

---

## 17. Conclusion

CareerAI est une plateforme complete d'accompagnement professionnel qui combine gestion de profil, intelligence artificielle, analyse de CV, preparation aux entretiens, orientation RIASEC, roadmap personnalisee, analytics, gamification et portfolio public.

Le projet repond a un besoin concret du marche : aider les candidats a mieux comprendre leur profil, optimiser leurs candidatures et se preparer efficacement aux exigences modernes du recrutement.

Grace a son architecture full-stack, son interface moderne et ses modules IA, CareerAI constitue une solution evolutive pouvant servir de base a un produit professionnel plus large dans le domaine de l'employabilite et de l'orientation carriere.

---

## 18. Annexes techniques

### 18.1 Liste synthetique des routes principales

```text
POST   /api/register
POST   /api/login
POST   /api/logout

GET    /api/profile
PUT    /api/profile

GET    /api/notifications
POST   /api/notifications
PUT    /api/notifications/{id}/read
DELETE /api/notifications/{id}

GET    /api/cv/export
POST   /api/cv/feedback
POST   /api/cv/analyze
POST   /api/cv/compare

POST   /api/quiz
GET    /api/roadmap
PATCH  /api/roadmap/progress

POST   /api/interview/generate
GET    /api/interviews
POST   /api/interviews
GET    /api/interviews/{id}

GET    /api/badges
POST   /api/badges/check

GET    /api/analytics

GET    /api/portfolio
PUT    /api/portfolio
GET    /api/portfolio/{username}

GET    /api/chat/history
POST   /api/chat
```

### 18.2 Technologies retenues

| Couche           | Technologie       |
| ---------------- | ----------------- |
| Frontend         | React, Vite       |
| Style            | Tailwind CSS      |
| Icons            | Lucide React      |
| Routing          | React Router DOM  |
| HTTP Client      | Axios             |
| Export PDF       | html2pdf.js       |
| Backend          | Laravel           |
| Langage backend  | PHP               |
| Authentification | Laravel Sanctum   |
| Base de donnees  | MySQL             |
| IA               | Google Gemini API |
| Extraction PDF   | Smalot PDF Parser |

### 18.3 Livrables attendus

- code source frontend ;
- code source backend ;
- base de donnees migree ;
- cahier des charges ;
- rapport de projet ;
- presentation ;
- demonstration fonctionnelle ;
- documentation minimale d'installation.
