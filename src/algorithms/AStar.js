
// If can't calculate the distance to our goal, we just use the same number
// The search uses a breath first approach then
const UNIT_HEURISTIC_FN = () => Infinity
// The basif edge cost is just taking the value of the edge or 1, if that is not a number
const EDGE_COST_FN = (edgeValue) => typeof edgeValue === 'number' ? edgeValue : 1

export default class AStar {
  constructor ({ costFn = EDGE_COST_FN, heuristicCostFn = UNIT_HEURISTIC_FN } = {}) {
    this.costFn = costFn
    this.heuristicCostFn = heuristicCostFn
  }

  _chooseNextNode (openSet, fScore) {
    return openSet.reduce((result, node) => {
      if (!result) return node
      if ((fScore[node] || Infinity) < (fScore[result] || Infinity)) return node
      return result
    }, null)
  }

  search (g, from, to) {
    if (from === to) return []
    // return g.outgoingEdges(from).indexOf(to) !== -1 ? [to] : null

    // The set of nodes already evaluated
    const closedSet = []
    // The set of currently discovered nodes that are not evaluated yet.
    // Initially, only the start node is known.
    let openSet = [from]

    // For each node, which node it can most efficiently be reached from.
    // If a node can be reached from many nodes, cameFrom will eventually contain the
    // most efficient previous step.
    const cameFrom = {}

    // For each node, the cost of getting from the start node to that node.
    const gScore = {}
    // The cost of going from start to start is zero.
    gScore[from] = 0

    // For each node, the total cost of getting from the start node to the goal
    // by passing by that node. That value is partly known, partly heuristic.
    const fScore = {}

    // For the first node, that value is completely heuristic.
    fScore[from] = this.heuristicCostFn(g.getNode(from), g.getNode(to))

    while (openSet.length) {
      const current = this._chooseNextNode(openSet, fScore)

      if (current === to) return reconstructPath(cameFrom, current)

      openSet = openSet.filter(x => x !== current)
      closedSet.push(current)

      g.outgoingEdges(current).forEach(neighbor => {
        // Ignore the neighbor which is already evaluated.
        if (closedSet.indexOf(neighbor) !== -1) return;

        // Discover a new node
        if (openSet.indexOf(neighbor) === -1) openSet.push(neighbor)

        // The distance from start to a neighbor
        //the "dist_between" function may vary as per the solution requirements.
        const tentativeScore = gScore[current] + this.costFn(g.edgeValue(current, neighbor))
        // This is not a better path.
        if (tentativeScore >= (gScore[neighbor] || Infinity)) return

        // This path is the best until now. Record it!
        cameFrom[neighbor] = current
        gScore[neighbor] = tentativeScore
        fScore[neighbor] = gScore[neighbor] + this.heuristicCostFn(g.getNode(neighbor), g.getNode(to))
      })
    }
    // No path exists
    return null
  }
}

function reconstructPath(cameFrom, current) {
  let totalPath = [current]
  while(cameFrom[current]) {
    current = cameFrom[current]
    totalPath = [current, ...totalPath]
  }
  // We don't need the start item in the path
  return totalPath.slice(1)
}
