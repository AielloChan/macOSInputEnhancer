[简体中文](../README.md) | [繁體中文](README.zh-TW.md) | [English](README.en-US.md) | [日本語](README.ja-JP.md) | [한국어](README.ko-KR.md) | Français | [Español](README.es-ES.md) | [Português do Brasil](README.pt-BR.md) | [Deutsch](README.de-DE.md) | [Русский](README.ru-RU.md)

# Extension de la méthode de saisie intégrée à macOS

Importez des fichiers de dictionnaire afin de les utiliser avec la méthode de saisie intégrée à macOS.

Le projet s'appuie principalement sur la fonction de remplacement de texte intégrée à iOS et macOS pour enrichir le dictionnaire : https://support.apple.com/fr-fr/guide/iphone/iph6d01d862/ios

Fonctionnalités actuellement prises en charge :
- **Fonctionnalités**
  - [x] Récupération de tous les fichiers
  - [x] Décodage d'un fichier et extraction de toutes les expressions
  - [x] Conversion des expressions en prononciation
  - [x] Intégration de modules de méthode de saisie
  - [x] Création de paires touche-expression
  - [x] Génération de fichiers client
  - [x] Appels orientés objet
  - [x] Export d'une plage de données définie
  - [x] Injection du dictionnaire Example dans la configuration
  - [x] Fusion avec des dictionnaires existants
- **Formats d'entrée**
  - [x] Dictionnaire cellulaire Sogou (.scel)
  - [x] Texte brut
  - [x] Fichier plist de la méthode de saisie macOS
- **Conversions**
  - [x] Xiaohe Double Pinyin
- **Formats de sortie**
  - [x] Fichier plist de la méthode de saisie macOS

Les fonctionnalités de base sont terminées. Le projet permet d'importer des dictionnaires cellulaires Sogou (.scel) dans la méthode de saisie intégrée à macOS.

## Utilisation

1. Téléchargez le dictionnaire cellulaire (.scel) à importer depuis https://pinyin.sogou.com/dict/
2. Placez-le dans le dossier `resources/scel`. Le programme ignore automatiquement les fichiers dont le nom commence par `_` et ceux qui ne se terminent pas par `.scel`.
3. Installez toutes les dépendances avec `yarn` ou `npm install`.
4. Lancez la conversion et la compilation avec `yarn run build` ou `npm run build`.
5. En cas de réussite, le fichier `plist` se trouve dans le dossier `output`.
6. Ouvrez Réglages Système → Clavier → Remplacements de texte, puis faites glisser le fichier `plist` dans la liste.

## !!! Avertissement important ⚠️ !!!

Cette méthode d'importation remplace directement vos remplacements de texte existants. Effectuez d'abord une sauvegarde : sélectionnez toutes les entrées et faites-les glisser dans un dossier pour les exporter au format plist.

N'ajoutez pas trop de dictionnaires en une seule fois. Un premier essai avec 20 000 entrées a complètement bloqué l'ordinateur. Pour corriger le problème, supprimez les entrées puis redémarrez. macOS semble peu optimisé pour un grand nombre de remplacements de texte.

Pour le premier essai, il est recommandé de n'ajouter que 2 000 entrées.

## ✉️ Message du développeur

Cette application répond déjà à mes besoins, je mets donc rarement ses fonctionnalités à jour. Si vous avez une nouvelle demande, ouvrez une Issue afin que nous puissions en discuter. Je répondrai rapidement dans [l'espace de discussion](https://github.com/AielloChan/macOSInputEnhancer/issues/1).

## Pour les développeurs qui souhaitent personnaliser le projet

Le fichier d'entrée est `index.js`.

Format du fichier de configuration :
```javascript
{
  // Dossier à analyser (les sous-dossiers ne sont pas analysés)
  // Renvoie un tableau contenant le chemin absolu de chaque fichier
  inputs: ['./resources/txt'],
  // Sélectionne automatiquement le chargeur adapté au format du fichier
  // Renvoie un tableau de toutes les expressions, par exemple `["你好","今天"]`
  loaders: [loaders.TxTLoader()],
  // Traite le tableau précédent : dédoublonnage, tri, ajout, suppression, etc.
  // Renvoie un nouveau tableau
  plugins: [
    // En mode développement, utilise le module UseExample
    // Il remplace toutes les entrées précédentes par les données de test
    IS_DEV ? UseExample(EXAMPLE_DATA) : null,
    // Supprime tous les caractères non chinois des entrées
    HanziOnly(),
    // Supprime les doublons
    Uniq(),
    // Sélectionne aléatoirement le nombre d'entrées indiqué
    RandomN(2e3),
    // Ajoute et fusionne les données existantes
    AddWords(userDic),
  ],
  // Convertit les expressions en frappes selon la méthode de saisie
  // Une même expression possède des associations différentes en Pinyin, Double Pinyin et Wubi
  // Utilise ici le convertisseur Xiaohe Double Pinyin
  transformer: transformers.XiaoheTransformer(),
  // Convertit les expressions et leurs touches au format de la plateforme ciblée
  // Produit ici les expressions personnalisées de la méthode de saisie macOS
  adapter: adapters.macOSRender(),
  // Chemin du fichier de sortie
  output: './output/macOS_input_dic.plist',
  // Active ou non les journaux dans le terminal
  log: true,
}
```

L'ordre du traitement est fixe et ne peut être ni inversé ni réorganisé :

`inputs` -> `loaders` -> `plugins` -> `transformer` -> `adapter` -> `output`

- loaders : charge les différents formats de fichier. Le paramètre est le `chemin absolu d'un fichier` et le résultat un `tableau d'expressions`, par exemple `["你好","今天"]`.
- plugins : reçoit un tableau tel que `["你好","今天"]` et renvoie le même format après traitement. Pour filtrer `"你好"`, il renvoie par exemple `["今天"]`.
- transformer : convertit les expressions en tableaux tels que `[你好, nihc]`.
- adapter : convertit les données dans des formats compatibles avec différentes plateformes.
