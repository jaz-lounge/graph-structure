import Graph from '../Graph'
import AStar from './AStar'

const distanceFn = (from, to) => {
  // like the distance between the points
  return Math.sqrt(Math.pow(from.x - to.x, 2), Math.pow(from.y - to.y, 2))
};


describe('a* algorithm ', () => {
  const graphJson = {
    nodes: {
      '1': { edges: { '2': true, '3': true } },
      '2': { edges: { '1': true } },
      '3': { edges: { '1': true, '4': true } },
      '4': { edges: { '3': true, '5': true } },
      '5': { edges: { '3': true } },
      '6': { edges: { '3': true } }
    }
  }
  let g
  let aStar

  describe('using default cost functions', () => {
    beforeEach(() => {
      aStar = new AStar()
    })

    it('returns empty array if we are at the goal already', () => {
      g = Graph.fromJson(graphJson)
      expect(aStar.search(g, '1', '1')).toEqual([])
    })

    it('finds a path to neighboring node', () => {
      g = Graph.fromJson(graphJson)
      expect(aStar.search(g, '1', '2')).toEqual(['2'])
    })

    it('does not find if path is one way only', () => {
      g = Graph.fromJson(graphJson)
      expect(aStar.search(g, '3', '6')).toEqual(null)
    })

    it('finds edges further away', () => {
      g = Graph.fromJson(graphJson)
      expect(aStar.search(g, '1', '5')).toEqual(['3', '4', '5'])
    })

    it('choke on loops', () => {
      g = new Graph({ bidirectional: true })
      g.addNode('1')
      g.addNode('2')
      g.addNode('3')
      g.addNode('4')
      g.addNode('5')
      g.addEdge('1', '2')
      g.addEdge('2', '4')
      g.addEdge('1', '3')
      g.addEdge('3', '4')
      g.addEdge('4', '5')
      expect(aStar.search(g, '1', '5')).toEqual(['2', '4', '5'])
    })
  })

  // describe.only('using some more intesting heuristic function', () => {
  //   beforeEach(() => {
  //     aStar = new AStar({
  //       heuristicCostFn: distanceFn
  //     })
  //
  //     g = new Graph({ bidirectional: true })
  //     g.addNode('1', { x: 0, y: 0 })
  //     g.addNode('2', { x: 2, y: 0 })
  //     g.addNode('3', { x: 0, y: 2 })
  //     g.addNode('4', { x: 4, y: 4 })
  //     g.addNode('5', { x: 4, y: 0 })
  //     g.addNode('6', { x: 2, y: 2 })
  //     g.addEdge('1', '2')
  //     g.addEdge('2', '6')
  //     g.addEdge('6', '4')
  //     g.addEdge('1', '3')
  //     g.addEdge('3', '4')
  //     g.addEdge('4', '5')
  //   })
  //
  //   it('returns still the shortest route in real cost', () => {
  //     expect(aStar.search(g, '1', '5')).toEqual(['3', '4', '5'])
  //   })
  // })

  describe('when edges have value', () => {
    beforeEach(() => {
      g = new Graph({ bidirectional: true })
      g.addNode('1', { x: 0, y: 0 })
      g.addNode('2', { x: 2, y: 0 })
      g.addNode('3', { x: 0, y: 2 })
      g.addNode('4', { x: 4, y: 4 })
      g.addNode('5', { x: 4, y: 0 })
      g.addNode('6', { x: 2, y: 2 })
      g.addEdge('1', '2', 1)
      g.addEdge('2', '6', 1)
      g.addEdge('6', '4', 2)
      g.addEdge('1', '3', 3)
      g.addEdge('3', '4', 3)
      g.addEdge('4', '5', 100)
    })

    describe('and we have no own cost fn', () => {
      beforeEach(() => {
        aStar = new AStar({
          heuristicCostFn: distanceFn
        })
      })

      it('returns the longer route if it costs less', () => {
        expect(aStar.search(g, '1', '5')).toEqual(['2', '6', '4', '5'])
      })
    })

    describe('and we have a custom cost fn', () => {
      beforeEach(() => {
        aStar = new AStar({
          heuristicCostFn: distanceFn,
          costFn: (edgeValue) => 1000 - edgeValue
        })
      })

      it('returns the longer route if it costs less', () => {
        expect(aStar.search(g, '1', '5')).toEqual(['3', '4', '5'])
      })
    })
  })
})
