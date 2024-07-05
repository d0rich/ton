import { Cell, TupleItem } from '@ton/core';
import { StackItem } from './types';
import { parseTvmValue } from './parseTvmValue';

export function parseStackItem(s: StackItem): TupleItem {
  if (s[0] === 'num') {
      let val = s[1] as string;
      if (val.startsWith('-')) {
          return { type: 'int', value: -BigInt(val.slice(1)) };
      } else {
          return { type: 'int', value: BigInt(val) };
      }
  } else if (s[0] === 'null') {
      return { type: 'null' };
  } else if (s[0] === 'cell') {
      return { type: 'cell', cell: Cell.fromBoc(Buffer.from(s[1].bytes, 'base64'))[0] };
  } else if (s[0] === 'slice') {
      return { type: 'slice', cell: Cell.fromBoc(Buffer.from(s[1].bytes, 'base64'))[0] };
  } else if (s[0] === 'builder') {
      return { type: 'builder', cell: Cell.fromBoc(Buffer.from(s[1].bytes, 'base64'))[0] };
  } else if (s[0] === 'tuple') {
      return { type: 'tuple', items: s[1].elements.map(parseTvmValue) };
  } else if (s[0] === 'list') {
    // Empty list is a null value
    if (s[1].elements.length === 0) {
        return { type: 'null' };
    }
    // FIXME: possibly it is not used
    return { type: 'tuple', items: s[1].elements.map(parseTvmValue) };
  } else {
      throw Error('Unsupported stack item type: ' + s[0])
  }
}
