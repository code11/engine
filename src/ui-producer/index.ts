import {
  parsePatch,
  bubbleTo,
  getValue,
  numberRegExpStr,
  textRegExpStr,
  objRegExpStr,
  arrayRegExpStr,
  htmlAttrRegExpStr,
  pathOptRegExpStr,
  booleanRegExpStr
} from './fns';

const numberRegExp = new RegExp('^' + numberRegExpStr + '$', 'g');
const objRegExp = new RegExp('^' + objRegExpStr, 'g');
const arrayRegExp = new RegExp('^' + arrayRegExpStr, 'g');
const textRegExp = new RegExp('^' + textRegExpStr + '$', 'g');
const htmlAttrRegExp = new RegExp('^' + htmlAttrRegExpStr + '$', 'g');
const pathRegExp = new RegExp('^' + pathOptRegExpStr + '$', 'g');
const booleanRegExp = new RegExp('^' + booleanRegExpStr + '$', 'g');

function numberParser(x: string) {
  return parseFloat(x);
}

function handleEvent(db: any) {
  return (ev: Event) => {
    if (!ev.target) {
      return;
    }
    const el: HTMLElement | null = bubbleTo(
      '[data-patch]',
      ev.target as HTMLElement
    );
    if (!el) {
      return;
    }
    let patchOn = el.getAttribute('data-patch-on');
    if (patchOn && patchOn !== ev.type) {
      return;
    }
    if (el.hasAttribute('href')) {
      ev.preventDefault();
    }
    let str = el.getAttribute('data-patch');
    if (!str) {
      return;
    }

    let patches;
    try {
      patches = parsePatch(str);
    } catch (e) {
      console.error('Patch parse error', e, str, el, ev);
      return;
    }

    if (!patches) {
      return;
    }

    let dataType = el.getAttribute('data-type');
    patches = patches.map(x => {
      if (!x.value) {
        return x;
      }

      let match = {
        obj: x.value.match(objRegExp) !== null,
        array: x.value.match(arrayRegExp) !== null,
        htmlAttr: x.value.match(htmlAttrRegExp) !== null,
        path: x.value.match(pathRegExp) !== null,
        text: x.value.match(textRegExp) !== null,
        number: x.value.match(numberRegExp) !== null,
        boolean: x.value.match(booleanRegExp) !== null
      };

      if (match.obj || match.array) {
        try {
          x.value = JSON.parse(x.value);
        } catch (e) {
          console.error(
            'Tried to JSON.parse ',
            x.value,
            ' from the patch ',
            x,
            ' and got ',
            e
          );
        }
      } else if (match.htmlAttr) {
        let prop = x.value.replace(/^attr\./, '');
        x.value = getValue(el, prop);
        if (dataType === 'numeric') {
          x.value = numberParser(x.value);
        } else if (
          !isNaN(x.value) &&
          x.value !== '' &&
          (!dataType || dataType !== 'string')
        ) {
          x.value = parseFloat(x.value);
        }
      } else if (match.path) {
        x.value = db.get(x.value);
      } else if (match.text) {
        x.value = x.value.substr(1, x.value.length - 2);
      } else if (match.number && (!dataType || dataType !== 'string')) {
        x.value = parseFloat(x.value);
      } else if (match.boolean) {
        x.value = x.value === 'true' ? true : false;
      } else {
        console.error(
          'Patch value not recognized "' +
            x.value +
            '". It should start and end with {..}, [..], \'..\', "..", or be a number'
        );
      }

      el.setAttribute('processedPatchAt', Date.now().toString());

      return x;
    });

    if (!patches || patches.length === 0) {
      return;
    }

    db.patch(patches);
  };
}

export default (target: any, db: any, events: string[]) => {
  const listener = handleEvent(db);

  const unsubscribes = events.map(x => {
    function handleEvents(y: any) {
      listener(y);
    }
    target.addEventListener(x, handleEvents);
    return () => {
      target.removeEventListener(x, handleEvents);
    };
  });

  return () => {
    unsubscribes.forEach((x: any) => x());
  };
};
