# GeoGuessSerge

## Concept
Serge, un collegue, voyage beaucoup. Le but du jeu est de retrouver sur une map monde ou etait Serge a une date donnee. Plus votre estimation est proche, plus vous marquez de points.

## Principe de score
- On compare votre point avec la position reelle de Serge.
- Plus la distance est faible, plus le score est eleve (0 point au-dela de 2000 km).

## Deploiement (Docker Compose + Traefik)
Ce projet est un front statique servi par Nginx.

1) Verifier les variables dans `.env`:
   - `FRONTEND_HOST=geoguessserge.victorgilliocq.com` (sans https)
   - `CI_REGISTRY_IMAGE` et `APP_VERSION` si besoin
2) Lancer:

```bash
docker compose up -d --build
```

Si le reseau `dokploy-network` n'existe pas, il faut le creer au prealable.
