import Graph from './Graph'

describe('Graph', () => {
  const graphJson = {
    bidirectional: true,
    nodes: {
      '1': { edges: { '2': true, '3': true } },
      '2': { edges: { '1': true } },
      '3': { edges: { '1': true } }
    }
  }
  let g

  describe('a bidirectional Graph', () => {
    beforeEach(() => {
      g = new Graph({ bidirectional: true })
    })

    it('can add some nodes', () => {
      g.addNode('1')
      g.addNode('2')

      expect(g.toJson()).toEqual({
        bidirectional: true,
        nodes: {
          1: { edges: {} },
          2: { edges: {} }
        }
      })
    })

    it('adds edges both ways', () => {
      g.addNode('1')
      g.addNode('2')
      g.addNode('3')
      g.addEdge('1', '2')
      g.addEdge('1', '3')

      expect(g.toJson()).toEqual({
        bidirectional: true,
        nodes: {
          '1': { edges: { '2': true, '3': true } },
          '2': { edges: { '1': true } },
          '3': { edges: { '1': true } }
        }
      })
    })

    it('adds edges with values', () => {
      g.addNode('1')
      g.addNode('2')
      g.addNode('3')
      g.addEdge('1', '2', 23)
      g.addEdge('1', '3', 'B')

      expect(g.toJson()).toEqual({
        bidirectional: true,
        nodes: {
          '1': { edges: { '2': 23, '3': 'B' } },
          '2': { edges: { '1': 23 } },
          '3': { edges: { '1': 'B' } }
        }
      })
    })

    it('can be created from json data', () => {
      g = Graph.fromJson(graphJson)
      expect(g.toJson()).toEqual(graphJson)
    })

    describe('#hasEdge', () => {
      beforeEach(() => {
        g = Graph.fromJson(graphJson)
      })

      it('is true when either way exists', () => {
        expect(g.hasEdge('1', '2')).toEqual(true)
        expect(g.hasEdge('2', '1')).toEqual(true)
      })

      it('is false if link does not exist', () => {
        expect(g.hasEdge('3', '2')).toEqual(false)
      })
    })

    describe('#removeEdge', () => {
      beforeEach(() => {
        g = Graph.fromJson(graphJson)
      })

      it('removes an existing Edge', () => {
        expect(g.hasEdge('1', '2')).toEqual(true)
        g.removeEdge('1', '2')
        expect(g.hasEdge('1', '2')).toEqual(false)
      })

      it('removes an existing Edge and its counter part', () => {
        expect(g.hasEdge('2', '1')).toEqual(true)
        g.removeEdge('1', '2')
        expect(g.hasEdge('2', '1')).toEqual(false)
      })
    })
  })

  describe('a unidirectional Graph', () => {
    beforeEach(() => {
      g = new Graph({ bidirectional: false })
    })

    it('can add some nodes', () => {
      g.addNode('1')
      g.addNode('2')

      expect(g.toJson()).toEqual({
        bidirectional: false,
        nodes: {
          1: { edges: {} },
          2: { edges: {} }
        }
      })
    })

    it('adds edges one way only', () => {
      g.addNode('1')
      g.addNode('2')
      g.addNode('3')
      g.addEdge('1', '2')
      g.addEdge('3', '1')

      expect(g.toJson()).toEqual({
        bidirectional: false,
        nodes: {
          '1': { edges: { '2': true } },
          '2': { edges: {} },
          '3': { edges: { '1': true } }
        }
      })
    })

    describe('#hasEdge', () => {
      beforeEach(() => {
        g.addNode('1')
        g.addNode('2')
        g.addNode('3')
        g.addEdge('1', '2')
      })

      it('is true only in one way', () => {
        expect(g.hasEdge('1', '2')).toEqual(true)
        expect(g.hasEdge('2', '1')).toEqual(false)
      })

      it('is false if link does not exist', () => {
        expect(g.hasEdge('3', '2')).toEqual(false)
      })
    })

    describe('#removeEdge', () => {
      beforeEach(() => {
        g.addNode('1')
        g.addNode('2')
        g.addNode('3')
        g.addEdge('1', '2')
        g.addEdge('2', '1')
      })

      it('removes an existing Edge', () => {
        expect(g.hasEdge('1', '2')).toEqual(true)
        g.removeEdge('1', '2')
        expect(g.hasEdge('1', '2')).toEqual(false)
      })

      it('does not remove an existing Edge and its counter part', () => {
        expect(g.hasEdge('2', '1')).toEqual(true)
        g.removeEdge('1', '2')
        expect(g.hasEdge('2', '1')).toEqual(true)
      })
    })
  })

  describe('#isEqual', () => {
    let g2
    let g3
    beforeEach(() => {
      g = Graph.fromJson(graphJson)
      g2 = Graph.fromJson(graphJson)
      g3 = Graph.fromJson({
        ...graphJson,
        bidirectional: false
      })
    })

    it('is equal if nodes and edges are the same', () => {
      expect(g.isEqual(g2)).toEqual(true)
      expect(g2.isEqual(g)).toEqual(true)
    })

    it('is not equal if there are some nodes more', () => {
      g2.addNode('3')
      expect(g.isEqual(g2)).toEqual(false)
      expect(g2.isEqual(g)).toEqual(false)
    })

    it('is not equal if there are some edges more', () => {
      g2.addEdge('3', '2')
      expect(g.isEqual(g2)).toEqual(false)
      expect(g2.isEqual(g)).toEqual(false)
    })

    it('does not care about options', () => {
      expect(g.isEqual(g3)).toEqual(true)
      expect(g3.isEqual(g)).toEqual(true)
    })
  })


  describe('#hasEdges', () => {
    beforeEach(() => {
      g = new Graph({ bidirectional: false })
      g.addNode('1')
      g.addNode('2')
      g.addNode('3')
      g.addEdge('1', '2')
    })

    it('is true when either way exists', () => {
      expect(g.hasEdges('1')).toEqual(true)
      expect(g.hasEdges('2')).toEqual(true)
    })

    it('is false otherwise', () => {
      expect(g.hasEdges('3')).toEqual(false)
    })
  })

  describe('#hasOutgoingEdges', () => {
    beforeEach(() => {
      g = new Graph({ bidirectional: false })
      g.addNode('1')
      g.addNode('2')
      g.addNode('3')
      g.addEdge('1', '2')
    })

    it('is true when edge is outgoing', () => {
      expect(g.hasOutgoingEdges('1')).toEqual(true)
      expect(g.hasOutgoingEdges('2')).toEqual(false)
    })

    it('is false otherwise', () => {
      expect(g.hasOutgoingEdges('3')).toEqual(false)
    })
  })

  describe('#hasIncomingEdges', () => {
    beforeEach(() => {
      g = new Graph({ bidirectional: false })
      g.addNode('1')
      g.addNode('2')
      g.addNode('3')
      g.addEdge('1', '2')
    })

    it('is true when edge is outgoing', () => {
      expect(g.hasIncomingEdges('1')).toEqual(false)
      expect(g.hasIncomingEdges('2')).toEqual(true)
    })

    it('is false otherwise', () => {
      expect(g.hasIncomingEdges('3')).toEqual(false)
    })
  })

  // describe('#removeNode', () => {
  //   beforeEach(() => {
  //     g = Graph.fromJson(graphJson)
  //   })
  //
  //   it('is equal if nodes and edges are the same', () => {
  //     expect(g.isEqual(g2)).toEqual(true)
  //     expect(g2.isEqual(g)).toEqual(true)
  //   })
  //
  //   it('is not equal if there are some nodes more', () => {
  //     g2.addNode('3')
  //     expect(g.isEqual(g2)).toEqual(false)
  //     expect(g2.isEqual(g)).toEqual(false)
  //   })
  //
  //   it('is not equal if there are some edges more', () => {
  //     g2.addEdge('3', '2')
  //     expect(g.isEqual(g2)).toEqual(false)
  //     expect(g2.isEqual(g)).toEqual(false)
  //   })
  //
  //   it('does not care about options', () => {
  //     expect(g.isEqual(g3)).toEqual(true)
  //     expect(g3.isEqual(g)).toEqual(true)
  //   })
  // })
})
