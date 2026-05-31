function simplifyDebts(transactions) {

  const splits = [];

  // Convert JSON object into Map for easier updates
  const transactionMap = new Map(Object.entries(transactions));


  /*
    Optimization 1:
    If A owes exactly the same amount that B should receive,
    settle them directly and remove both from further processing.

    Example:
    A = -500
    B = +500

    => A pays B 500
  */
  function settleSimilarFigures() {

    const visited = new Map();

    for (const debtor of transactionMap.keys()) {

      visited.set(debtor, true);

      for (const creditor of transactionMap.keys()) {

        if (
          !visited.has(creditor) &&
          debtor !== creditor
        ) {

          if (
            transactionMap.get(creditor) ===
            -transactionMap.get(debtor)
          ) {

            if (
              transactionMap.get(creditor) >
              transactionMap.get(debtor)
            ) {

              splits.push([
                debtor,
                creditor,
                transactionMap.get(creditor),
              ]);

            } else {

              splits.push([
                creditor,
                debtor,
                transactionMap.get(debtor),
              ]);

            }

            // Mark both as settled
            transactionMap.set(debtor, 0);
            transactionMap.set(creditor, 0);
          }
        }
      }
    }
  }


  /*
    Find:

    min -> person who owes most (largest negative balance)
    max -> person who should receive most (largest positive balance)

    Example:
    {
      A : -800
      B : -200
      C : +300
      D : +700
    }

    Returns:
    [A, D]
  */
  function getMaxMinCredit() {

    let max = Number.MIN_VALUE;
    let min = Number.MAX_VALUE;

    let maxPerson;
    let minPerson;

    for (const person of transactionMap.keys()) {

      if (transactionMap.get(person) < min) {
        min = transactionMap.get(person);
        minPerson = person;
      }

      if (transactionMap.get(person) > max) {
        max = transactionMap.get(person);
        maxPerson = person;
      }
    }

    return [minPerson, maxPerson];
  }


  /*
    Greedy Settlement Algorithm

    Step:
    1. Pick biggest debtor.
    2. Pick biggest creditor.
    3. Settle as much as possible.
    4. Update balances.
    5. Repeat until all balances become zero.

    Time Complexity: O(n²)

    Produces near-minimum number of transactions.
  */
  function helper() {

    const [debtor, creditor] =
      getMaxMinCredit();

    if (
      debtor === undefined ||
      creditor === undefined
    ) {
      return;
    }

    // Amount that can be settled now
    let amount = Math.min(
      -transactionMap.get(debtor),
      transactionMap.get(creditor)
    );

    // Update balances
    transactionMap.set(
      debtor,
      transactionMap.get(debtor) + amount
    );

    transactionMap.set(
      creditor,
      transactionMap.get(creditor) - amount
    );

    amount = Math.round((amount + Number.EPSILON) * 100) / 100;

    /*
      debtor pays creditor

      [from, to, amount]
    */
    splits.push([
      debtor,
      creditor,
      amount,
    ]);

    helper();
  }


  // Direct exact-match settlements first
  settleSimilarFigures();

  // Then run greedy simplification
  helper();

  return splits;
}

module.exports = simplifyDebts;