# Callouts
Callouts are marked by `!` start and end tags. Here are some examples of how they might be rendered:

![Rendered danger callout the contains the title "Operator Syntax" and the text "Note that this conditional uses < , not <= , because we don't want to add another flower if the length of flower_basket is equal to twelve. Watch out for an off-by-one error!"](./callout-danger.png)

![Rendered info callout that contains the title "`for` Loops" and the text "An alternative syntax is to use for loops with a range. The for loop syntax sets up and modifies something like a counter variable!"](./callout-info.png)

These are created with the following markdown:

```md
### !callout-danger

## Operator Syntax

Note that this conditional uses `<` , _not_ `<=` , because we don't want to add another flower if the length of `flower_basket` is _equal_ to twelve. Watch out for an off-by-one error!

### !end-callout

### !callout-info

## `for` Loops

An alternative syntax is to use `for` loops with a range. The `for` loop syntax sets up and modifies something like a counter variable!

### !end-callout

```

# Callout Types
These are the known callout types:
* info
* success
* warning
* danger
* secondary
* star

We've implemented each of these except "star".