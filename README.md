# OnOut Dashboard

Documentation: https://support.onout.org/hc/1331700057

### How to deploy

1. go to `src/scripts/`
2. run `updatePlugins.sh` and wait while plugins will be updated (for now only for GNU/Linux and OSX systems. Ask support if you have different system)
3. go back and run `npm run build`
4. copy _CNAME_ from `docs/` somewhere
5. remove everything from `docs/`
6. copy everything from `build/` to `docs/`
7. move _CNAME_ back to `docs/`
8. commit
