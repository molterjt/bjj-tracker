import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { X } from 'lucide-react';
import { Technique, Position } from '../../state/types';
import { getColor, getRadius } from '../../constants';

interface UnifiedGraphProps {
  techniques: Technique[];
  positions: Position[];
}

type NodeType = 'technique' | 'position';
const NODE_STYLE = {
  "stroke_width": 0.75,
  "selected_stroke_width": 2,
  "stroke_color": '#fff',

}

interface GraphNode {
  id: string;
  name: string;
  type: NodeType;
  category: string;
  data: Technique | Position;
}

const UnifiedGraph: React.FC<UnifiedGraphProps> = ({ techniques, positions }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterNodeType, setFilterNodeType] = useState<'all' | 'technique' | 'position'>('all');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const width = 900;
    const height = 700;

    // Create nodes for both positions and techniques
    const positionNodes: GraphNode[] = positions.map(p => ({
      id: `pos-${p.id}`,
      name: p.name,
      type: 'position' as NodeType,
      category: p.category,
      data: p
    }));

    const techniqueNodes: GraphNode[] = techniques.map(t => ({
      id: `tech-${t.id}`,
      name: t.name,
      type: 'technique' as NodeType,
      category: t.paths[0]?.split(' > ')[0] || 'Other',
      data: t
    }));

    let allNodes = [...positionNodes, ...techniqueNodes];

    // Apply filters
    if (filterNodeType !== 'all') {
      allNodes = allNodes.filter(n => n.type === filterNodeType);
    }
    if (filterCategory !== 'all') {
      allNodes = allNodes.filter(n => n.category === filterCategory);
    }

    if (allNodes.length === 0) return;

    // Create links
    const links: { source: string; target: string; type: string }[] = [];

    // Technique to Technique relationships
    techniques.forEach(tech => {
      if (!allNodes.find(n => n.id === `tech-${tech.id}`)) return;

      tech.relatedTechniques.forEach(relId => {
        if (allNodes.find(n => n.id === `tech-${relId}`)) {
          const linkExists = links.some(
            l => (l.source === `tech-${tech.id}` && l.target === `tech-${relId}`) ||
              (l.source === `tech-${relId}` && l.target === `tech-${tech.id}`)
          );
          if (!linkExists) {
            links.push({
              source: `tech-${tech.id}`,
              target: `tech-${relId}`,
              type: 'technique-technique'
            });
          }
        }
      });

      // Technique to Position links
      if (tech.positionIds) {
        tech.positionIds.forEach(posId => {
          if (allNodes.find(n => n.id === `pos-${posId}`)) {
            links.push({
              source: `tech-${tech.id}`,
              target: `pos-${posId}`,
              type: 'technique-position'
            });
          }
        });
      }

      // From/To Position links
      if (tech.fromPosition && allNodes.find(n => n.id === `pos-${tech.fromPosition}`)) {
        links.push({
          source: `pos-${tech.fromPosition}`,
          target: `tech-${tech.id}`,
          type: 'from-position'
        });
      }
      if (tech.toPosition && allNodes.find(n => n.id === `pos-${tech.toPosition}`)) {
        links.push({
          source: `tech-${tech.id}`,
          target: `pos-${tech.toPosition}`,
          type: 'to-position'
        });
      }
    });

    // Position to Position relationships
    positions.forEach(pos => {
      if (!allNodes.find(n => n.id === `pos-${pos.id}`)) return;

      pos.relatedPositions.forEach(relId => {
        if (allNodes.find(n => n.id === `pos-${relId}`)) {
          const linkExists = links.some(
            l => (l.source === `pos-${pos.id}` && l.target === `pos-${relId}`) ||
              (l.source === `pos-${relId}` && l.target === `pos-${pos.id}`)
          );
          if (!linkExists) {
            links.push({
              source: `pos-${pos.id}`,
              target: `pos-${relId}`,
              type: 'position-position'
            });
          }
        }
      });
    });

    const categoryColors: { [key: string]: string } = {
      'Position': '#3b82f6',
      'Transition': '#10b981',
      'Submission': '#ef4444',
      'Ground': '#8b5cf6',
      'Standing': '#f59e0b'
    };

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const simulation = d3.forceSimulation(allNodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(180))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(20))
      .force('x', d3.forceX(width / 2).strength(0.02))
      .force('y', d3.forceY(height / 2).strength(0.02));
    // .force('x', d3.forceX(width / 2).strength(0.05))
    // .force('y', d3.forceY(height / 2).strength(0.05));

    // Create different link styles
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', (d: any) => {
        switch (d.type) {
          case 'from-position':
            return '#f21e0b'
          case 'to-position':
            return '#f59e0b'; // Orange for position transitions
          case 'technique-position':
            return '#8b5cf6'; // Purple for position links
          case 'position-position':
            return '#3b82f6'; // Blue for position relationships
          default:
            return '#4b5563'; // Gray for technique relationships
        }
      })
      .attr('stroke-width', (d: any) => {
        return d.type === 'from-position' || d.type === 'to-position' ? 3 : 2;
      })
      .attr('stroke-opacity', 0.6)
      .attr('stroke-dasharray', (d: any) => {
        return d.type === 'technique-position' ? '5,5' : 'none';
      });

    const node = svg.append('g')
      .selectAll('g')
      .data(allNodes)
      .enter()
      .append('g')
      .style('cursor', 'pointer')
      .on('click', function (event, d: any) {
        event.stopPropagation();
        setSelectedNode(d);
        d3.selectAll('circle').attr('stroke-width', 3);
        d3.select(this).select('circle').attr('stroke-width', 5);
      })
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Draw nodes with different shapes for positions vs techniques
    node.each(function (d: any) {
      const g = d3.select(this);

      if (d.type === 'position') {
        // Positions are squares
        g.append('rect')
          .attr('x', -22)
          .attr('y', -22)
          .attr('width', 30)
          .attr('height', 30)
          .attr('rx', 6)
          .attr('fill', categoryColors[d.category] || '#6b7280')
          .attr('stroke', '#1f2937')
          .attr('stroke-width', 3);
      } else {
        // Techniques are circles
        g.append('circle')
          .attr('r', (d: any) => getRadius(d.category)) //??
          .attr('fill', (d: any) => getColor(d.category))
          .attr('stroke', NODE_STYLE.stroke_color)
          .attr('stroke-width', NODE_STYLE.stroke_width);
      }

      // Add text label
      g.append('text')
        .text(d.name)
        .attr('x', 0)
        .attr('y', 28)
        .attr('text-anchor', 'middle')
        .attr('fill', '#e5e7eb')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .style('pointer-events', 'none');
    });

    simulation.on('tick', () => {
      allNodes.forEach((d: any) => {
        const radius = 25;
        d.x = Math.max(radius + 15, Math.min(width - radius - 15, d.x));
        d.y = Math.max(radius + 15, Math.min(height - radius - 15, d.y));
      });


      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      const radius = 25;
      d.fx = Math.max(radius + 10, Math.min(width - radius - 10, event.x));
      d.fy = Math.max(radius + 10, Math.min(height - radius - 10, event.y));
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    svg.on('click', () => {
      setSelectedNode(null);
      d3.selectAll('circle, rect').attr('stroke-width', 3);
    });

    return () => {
      simulation.stop();
    };
  }, [techniques, positions, filterCategory, filterNodeType]);

  const isTechnique = (node: GraphNode): node is GraphNode & { data: Technique } => {
    return node.type === 'technique';
  };

  const isPosition = (node: GraphNode): node is GraphNode & { data: Position } => {
    return node.type === 'position';
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px' }}>
        Technique & Position Network
      </h2>
      <div className="card">
        <p style={{ color: '#9ca3af', marginBottom: '16px' }}>
          Visualize relationships between techniques and positions.
          <strong> Squares = Positions, Circles = Techniques</strong>
        </p>

        {/* Filters */}
        <div style={{ marginBottom: '16px' }}>
          <p className="label">Show:</p>
          <div className="tag-container" style={{ marginBottom: '12px' }}>
            <button
              onClick={() => setFilterNodeType('all')}
              className={`tag ${filterNodeType === 'all' ? 'selected' : ''}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterNodeType('technique')}
              className={`tag ${filterNodeType === 'technique' ? 'selected' : ''}`}
            >
              Techniques Only
            </button>
            <button
              onClick={() => setFilterNodeType('position')}
              className={`tag ${filterNodeType === 'position' ? 'selected' : ''}`}
            >
              Positions Only
            </button>
          </div>

          <p className="label">Filter by category:</p>
          <div className="tag-container">
            <button
              onClick={() => setFilterCategory('all')}
              className={`tag ${filterCategory === 'all' ? 'selected' : ''}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterCategory('Position')}
              className={`tag ${filterCategory === 'Position' ? 'selected' : ''}`}
            >
              Position
            </button>
            <button
              onClick={() => setFilterCategory('Transition')}
              className={`tag ${filterCategory === 'Transition' ? 'selected' : ''}`}
            >
              Transition
            </button>
            <button
              onClick={() => setFilterCategory('Submission')}
              className={`tag ${filterCategory === 'Submission' ? 'selected' : ''}`}
            >
              Submission
            </button>
            <button
              onClick={() => setFilterCategory('Ground')}
              className={`tag ${filterCategory === 'Ground' ? 'selected' : ''}`}
            >
              Ground
            </button>
            <button
              onClick={() => setFilterCategory('Standing')}
              className={`tag ${filterCategory === 'Standing' ? 'selected' : ''}`}
            >
              Standing
            </button>
          </div>
        </div>

        {/* Legend */}
        <div style={{ marginBottom: '16px' }}>
          <p className="label">Node Types:</p>
          <div className="legend">
            <div className="legend-item">
              <div style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%'
              }} />
              <span>Technique (Circle)</span>
            </div>
            <div className="legend-item">
              <div style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#8b5cf6',
                borderRadius: '4px'
              }} />
              <span>Position (Square)</span>
            </div>
          </div>

          <p className="label" style={{ marginTop: '12px' }}>Connection Types:</p>
          <div className="legend">
            <div className="legend-item">
              <div style={{ width: '30px', height: '2px', backgroundColor: '#4b5563' }} />
              <span>Related techniques</span>
            </div>
            <div className="legend-item">
              <div style={{ width: '30px', height: '2px', backgroundColor: '#3b82f6' }} />
              <span>Related positions</span>
            </div>
            <div className="legend-item">
              <div style={{
                width: '30px',
                height: '2px',
                backgroundColor: '#8b5cf6',
                backgroundImage: 'repeating-linear-gradient(90deg, #8b5cf6 0, #8b5cf6 5px, transparent 5px, transparent 10px)'
              }} />
              <span>Position link</span>
            </div>
            <div className="legend-item">
              <div style={{ width: '30px', height: '3px', backgroundColor: '#f59e0b' }} />
              <span>Position flow (from/to)</span>
            </div>
          </div>
        </div>

        {techniques.length === 0 && positions.length === 0 ? (
          <div className="empty-state">
            Add techniques and positions to see the network visualization
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <svg
                ref={svgRef}
                style={{
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  backgroundColor: '#1f2937'
                }}
              />
            </div>

            {/* Details Panel */}
            {selectedNode && (
              <div className="technique-details-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#93c5fd' }}>
                      {selectedNode.name}
                    </h3>
                    <span className="badge" style={{ marginTop: '4px', display: 'inline-block' }}>
                      {selectedNode.type === 'position' ? '📍 Position' : '🥋 Technique'}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="btn-danger-icon"
                    style={{ padding: '4px' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {isTechnique(selectedNode) && (
                  <div>
                    {/* Paths */}
                    <div style={{ marginBottom: '16px' }}>
                      <p className="label">Paths:</p>
                      {selectedNode.data.paths.map((path, index) => (
                        <div key={index} style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '4px' }}>
                          {path}
                        </div>
                      ))}
                    </div>

                    {/* Description */}
                    {selectedNode.data.description && (
                      <div style={{ marginBottom: '16px' }}>
                        <p className="label">Description:</p>
                        <p style={{ fontSize: '0.875rem', color: '#d1d5db', lineHeight: '1.5' }}>
                          {selectedNode.data.description}
                        </p>
                      </div>
                    )}

                    {/* Linked Positions */}
                    {selectedNode.data.positionIds && selectedNode.data.positionIds.length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <p className="label">Linked Positions:</p>
                        <div className="tag-container">
                          {selectedNode.data.positionIds.map(posId => {
                            const pos = positions.find(p => p.id === posId);
                            return pos ? (
                              <span key={posId} className="tag-small">
                                {pos.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {/* From/To Positions */}
                    {(selectedNode.data.fromPosition || selectedNode.data.toPosition) && (
                      <div style={{ marginBottom: '16px' }}>
                        <p className="label">Position Flow:</p>
                        {selectedNode.data.fromPosition && (
                          <div style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                            From: {positions.find(p => p.id === selectedNode.data.fromPosition)?.name}
                          </div>
                        )}
                        {selectedNode.data.toPosition && (
                          <div style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                            To: {positions.find(p => p.id === selectedNode.data.toPosition)?.name}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Related Techniques */}
                    {selectedNode.data.relatedTechniques.length > 0 && (
                      <div>
                        <p className="label">Related Techniques:</p>
                        <div className="tag-container">
                          {selectedNode.data.relatedTechniques.map(relId => {
                            const relTech = techniques.find(t => t.id === relId);
                            return relTech ? (
                              <button
                                key={relId}
                                onClick={() => {
                                  const node = {
                                    id: `tech-${relId}`,
                                    name: relTech.name,
                                    type: 'technique' as NodeType,
                                    category: relTech.paths[0]?.split(' > ')[0] || 'Other',
                                    data: relTech
                                  };
                                  setSelectedNode(node);
                                }}
                                className="tag"
                                style={{ cursor: 'pointer' }}
                              >
                                {relTech.name}
                              </button>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {isPosition(selectedNode) && (
                  <div>
                    {/* Category */}
                    <div style={{ marginBottom: '16px' }}>
                      <p className="label">Category:</p>
                      <span className="badge">{selectedNode.data.category}</span>
                      {selectedNode.data.subcategory && (
                        <span className="badge" style={{ marginLeft: '8px' }}>
                          {selectedNode.data.subcategory}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {selectedNode.data.description && (
                      <div style={{ marginBottom: '16px' }}>
                        <p className="label">Description:</p>
                        <p style={{ fontSize: '0.875rem', color: '#d1d5db', lineHeight: '1.5' }}>
                          {selectedNode.data.description}
                        </p>
                      </div>
                    )}

                    {/* Linked Techniques */}
                    {(() => {
                      const linkedTechs = techniques.filter(t =>
                        t.positionIds?.includes(selectedNode.data.id) ||
                        t.fromPosition === selectedNode.data.id ||
                        t.toPosition === selectedNode.data.id
                      );
                      return linkedTechs.length > 0 && (
                        <div style={{ marginBottom: '16px' }}>
                          <p className="label">Techniques from this position:</p>
                          <div className="tag-container">
                            {linkedTechs.map(tech => (
                              <button
                                key={tech.id}
                                onClick={() => {
                                  const node = {
                                    id: `tech-${tech.id}`,
                                    name: tech.name,
                                    type: 'technique' as NodeType,
                                    category: tech.paths[0]?.split(' > ')[0] || 'Other',
                                    data: tech
                                  };
                                  setSelectedNode(node);
                                }}
                                className="tag"
                                style={{ cursor: 'pointer' }}
                              >
                                {tech.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Related Positions */}
                    {selectedNode.data.relatedPositions.length > 0 && (
                      <div>
                        <p className="label">Related Positions:</p>
                        <div className="tag-container">
                          {selectedNode.data.relatedPositions.map(relId => {
                            const relPos = positions.find(p => p.id === relId);
                            return relPos ? (
                              <button
                                key={relId}
                                onClick={() => {
                                  const node = {
                                    id: `pos-${relId}`,
                                    name: relPos.name,
                                    type: 'position' as NodeType,
                                    category: relPos.category,
                                    data: relPos
                                  };
                                  setSelectedNode(node);
                                }}
                                className="tag"
                                style={{ cursor: 'pointer' }}
                              >
                                {relPos.name}
                              </button>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedGraph;