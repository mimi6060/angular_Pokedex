import { Sprites, SpriteUrl } from "../models/pokemon";



export function extractSprites(sprites: Sprites | undefined): SpriteUrl[] {
  if(!sprites) return [];
  const spritesArray: SpriteUrl[] = [];

  
  // Liste des clés à vérifier avec leur label associé
  const keysWithLabels: { key: keyof Sprites; label: string }[] = [
    { key: 'front_default', label: 'Front' },
    { key: 'back_default', label: 'Back' },
    { key: 'front_shiny', label: 'Front Shiny' },
    { key: 'back_shiny', label: 'Back Shiny' },
    { key: 'front_female', label: 'Front Female' },
    { key: 'back_female', label: 'Back Female' },
    { key: 'front_shiny_female', label: 'Front Shiny Female' },
    { key: 'back_shiny_female', label: 'Back Shiny Female' },
  ];

  for (const { key, label } of keysWithLabels) {
    const url = sprites[key];
    if (typeof url === 'string' && url) {
      spritesArray.push({ label, url });
    }
  }
  return spritesArray;
}