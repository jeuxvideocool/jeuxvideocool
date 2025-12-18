# Contribuer  
  
- Utiliser pnpm et TypeScript.
- Pas de dépendances réseau dynamiques côté build sans nécessité.
- Garder les couleurs/thèmes dans `configs/themes/*.json`.
- Ne jamais éditer le hub ou le routing pour ajouter un jeu : suivre le contrat JSON.

## Tests rapides
- `pnpm dev` pour vérifier le hub.
- `pnpm build` pour valider le MPA et les entrées générées depuis `games.registry.json`.

## Ajouter un nouveau jeu
1. `pnpm new:game <id>` (ou copie manuelle du template).
2. Compléter `configs/games/<id>.config.json` (xpRules, uiText, difficultyParams, input).
3. Ajouter le jeu dans `configs/games.registry.json`.
4. Optionnel : thème dédié dans `configs/themes/`.
5. Implémenter la logique du jeu dans `apps/games/<id>/src/` (les paramètres doivent venir du JSON).

## Events / progression
- Émettre des events via `packages/core/events` (`gameId` requis) :
  - `SESSION_START`, `SESSION_WIN`, `SESSION_FAIL`
  - Events métiers : `ITEM_COLLECTED`, `ENEMY_KILLED`, `POWERUP_COLLECTED`, etc.
- Le moteur progression (`packages/progression`) consomme ces events pour l'XP et les achievements.
