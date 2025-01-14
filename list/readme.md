# CROWD Ordered Set

Ordered list of unique keys.

## Properties

- Left precedence. Key position relies on keys from left, non from right.
- Anchor to stable. Key position doesn't relies on key that moved after this.
- No interleaving. Sequence of left-to-right inserted keys will stay together after merge.
- Removed keys are remain as tombstones.

## Optimization Ways

- Tombstones can be eliminated by changing state/delta format.

## State format

```javascript
{
	"values": [ "bar", "lol", "foo", "kek" ],
	"stamps": [ +2000001, +2000002, +1000001, -3000002 ],
}
// Alice inserts "foo" at the end.
// Alice inserts "bar" before "foo".
// Bob inserts "lol" before "foo".
// Bob inserts "kek" at the end then cut it.

.items === [ "bar", "lol", "foo" ]

Size = Size( AddedAndRemovedKeys ) + 8 * Count( AddedAndRemovedKeys )
```

Items with negative stamps - tombstones.

## Delta Format

Delta is full state dump.

## Views

- `items` Array of keys.
- `has( key )`

## Mutations

- `insert( key, pos? )` Pos points to the end by default.
- `cut( key )`

