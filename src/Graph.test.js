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

  it('default version is unidirectional', () => {
    g = new Graph()
    expect(g.toJson()).toEqual({
      bidirectional: false,
      nodes: {}
    })
  })

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

    it('nodes can have data attached', () => {
      g.addNode('1')
      g.addNode('2', { foo: 'bar' })
      g.addNode('3', 23)

      expect(g.toJson()).toEqual({
        bidirectional: true,
        nodes: {
          1: { edges: {} },
          2: { edges: {}, data: { foo: 'bar' } },
          3: { edges: {}, data: 23 }
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

    it('redefining edges changes the value (also the other way)', () => {
      g.addNode('1')
      g.addNode('2')
      g.addEdge('1', '2', 23)
      g.addEdge('2', '1', 'B')

      expect(g.toJson()).toEqual({
        bidirectional: true,
        nodes: {
          '1': { edges: { '2': 'B' } },
          '2': { edges: { '1': 'B' } }
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

      it('is false if one node does not exist', () => {
        expect(g.hasEdge('3', '404')).toEqual(false)
        expect(g.hasEdge('404', '2')).toEqual(false)
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

      it('is still true although it as an edge with a value', () => {
        g.addEdge('3', '2', 'A')
        expect(g.hasEdge('3', '2')).toEqual(true)
      })
    })

    describe('#edgeValue', () => {
      beforeEach(() => {
        g.addNode('1')
        g.addNode('2')
        g.addNode('3')
        g.addEdge('1', '2', 'A')
        g.addEdge('2', '1', 'B')
        g.addEdge('2', '3')
      })

      it('returns assigned value', () => {
        expect(g.edgeValue('1', '2')).toEqual('A')
        expect(g.edgeValue('2', '1')).toEqual('B')
      })

      it('is true when exist but no value is assigned', () => {
        expect(g.edgeValue('2', '3')).toEqual(true)
      })

      it('is null if not existent', () => {
        expect(g.edgeValue('3', '2')).toEqual(null)
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

  describe('#hasNode', () => {
    beforeEach(() => {
      g = new Graph()
      g.addNode('1', 'data')
      g.addNode('2')
      g.addNode('3')
      g.addEdge('1', '2')
    })

    it('returns true also when data exists', () => {
      expect(g.hasNode('1')).toEqual(true)
      expect(g.hasNode('2')).toEqual(true)
    })

    it('returns falls when not existent', () => {
      expect(g.hasNode('4')).toEqual(false)
    })
  })

  describe('#getNode', () => {
    beforeEach(() => {
      g = new Graph()
      g.addNode('1', 'data')
      g.addNode('2')
      g.addNode('3')
      g.addEdge('1', '2')
    })

    it('returns the data', () => {
      expect(g.getNode('1')).toEqual('data')
    })

    it('returns null otherwise', () => {
      expect(g.getNode('2')).toEqual(null)
      expect(g.getNode('3')).toEqual(null)
    })
  })

  describe('#removeNode', () => {
    beforeEach(() => {
      g = Graph.fromJson(graphJson)
    })

    it('removes the node and all attached edges', () => {
      g.removeNode('1')
      expect(g.toJson()).toEqual({
        bidirectional: true,
        nodes: {
          '2': { edges: {} },
          '3': { edges: {} }
        }
      })
    })
  })
})
