# i18n Support
Out of the box, ol-kit ships with English strings but makes it easy to override strings or add other langauges. Localization of numbers, dates etc. is something we would like to add in the future; you can follow the progress [here](https://github.com/MonsantoCo/ol-kit/issues/17).

### Override strings
To override the default strings, extend the base translation files (see `src/locales`) and override only the appropriate keys.

```javascript
import en from '@bayer/ol-kit/core/locales/en.js'

// spread the english strings & override one of the keys
const translations = { ...en, '_ol_kit.BingMaps.title': 'My Custom BingMaps Title' }

// pass the new translations into any ol-kit components you use
<BingMaps translations={translations} ... />
```

### Add a new language
If you want to add support for a new language we don't support, simply create a translation object with matching keys and then pass this into the components you use.

```javascript
// create a translation object for a new language
const fr = {
  '_ol_kit.BlankWhite.title': 'Blanc Blanc'
  ...
}

// pass the new translations into any ol-kit components you use
<BingMaps translations={fr} ... />
```

### Help us
We love when others help! Consider creating a PR to add support for a language so the entire community can benefit!
