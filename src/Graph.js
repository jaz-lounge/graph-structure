import deepEqual from 'deep-equal'

export default class Graph {
  constructor({ bidirectional } = {}) {
    this.bidirectional = bidirectional || false
    // TODO: Think about Map/WeakMap
    this.nodes = {}
    this.edges = {}
  }

  addNode(nodeId, data) {
    this.nodes[nodeId] = { edges: {}, data }
  }

  addEdge(fromId, toId, data = true) {
    this.nodes[fromId].edges[toId] = data
    if (this.bidirectional) {
      this.nodes[toId].edges[fromId] = data
    }
  }

  hasNode(nodeId) {
    return !!this.nodes[nodeId]
  }

  getNode(nodeId) {
    return this.nodes[nodeId].data || null
  }

  removeNode(nodeId) {
    delete this.nodes[nodeId]

    for (var nId in this.nodes) {
      delete this.nodes[nId].edges[nodeId]
    }
  }

  isEqual(anotherGraph) {
    return deepEqual(this.toJson().nodes, anotherGraph.toJson().nodes)
  }

  hasEdge(n1, n2) {
    return !!(this.nodes[n1] && this.nodes[n1].edges[n2] !== undefined)
  }

  edgeValue(n1, n2) {
    return this.nodes[n1].edges[n2] || null
  }

  removeEdge(n1, n2) {
    delete this.nodes[n1].edges[n2]
    if (this.bidirectional) {
      delete this.nodes[n2].edges[n1]
    }
  }

  hasEdges(node) {
    return this.hasOutgoingEdges(node) || this.hasIncomingEdges(node)
  }

  outgoingEdges(node) {
    return Object.keys(this.nodes[node].edges)
  }

  hasOutgoingEdges(node) {
    return Object.keys(this.nodes[node].edges).length > 0
  }

  hasIncomingEdges(node) {
    for (var nodeId in this.nodes) {
      if (nodeId !== node) {
        if (this.nodes[nodeId].edges[node]) return true
      }
    }
    return false
  }

  toJson() {
    return {
      bidirectional: this.bidirectional,
      nodes: this.nodes
    }
  }

  static fromJson(json) {
    const g = new Graph({ bidirectional: json.bidirectional })
    // Essentially cloning the object, so we don't change initial input
    Object.keys(json.nodes).forEach(nodeId => {
      const edges = {}
      Object.keys(json.nodes[nodeId].edges).forEach(edgeId => {
        edges[edgeId] = json.nodes[nodeId].edges[edgeId]
      })
      g.nodes[nodeId] = {
        edges
      }
    })
    return g
  }
}
