import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { X } from 'lucide-react';
import { Technique } from '../../state/types';
import { CATEGORIES, CATEGORY, CategoryKeys, getColor, getRadius } from '../../constants';

interface ForceGraphProps {
  techniques: Technique[];
}

const NODE_STYLE = {
  "stroke_width": 0.75,
  "selected_stroke_width": 2,
  "stroke_color": '#fff',

}

const ForceGraph: React.FC<ForceGraphProps> = ({ techniques }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null);

  useEffect(() => {
    if (!svgRef.current || techniques.length === 0) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    const width = 900;
    const height = 700;

    // Filter techniques if needed
    let filteredTechniques = techniques;
    if (filterCategory !== 'all') {
      filteredTechniques = techniques.filter(t =>
        t.paths.some(p => p.startsWith(filterCategory))
      );
    }

    // Create nodes and links
    const nodes = filteredTechniques.map(t => {
      const topCategory = t.paths[0].split(' > ')[0];
      return {
        id: t.id,
        name: t.name,
        category: topCategory,
        paths: t.paths,
        technique: t
      };
    });

    const links: { source: string; target: string }[] = [];
    filteredTechniques.forEach(tech => {
      tech.relatedTechniques.forEach(relId => {
        if (filteredTechniques.find(t => t.id === relId)) {
          const linkExists = links.some(
            l => (l.source === tech.id && l.target === relId) ||
              (l.source === relId && l.target === tech.id)
          );
          if (!linkExists) {
            links.push({ source: tech.id, target: relId });
          }
        }
      });
    });

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create force simulation with boundary constraints
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));

    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#4b5563')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.86);

    // Create nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .style('cursor', 'pointer')
      .on('click', function (event, d: any) {
        event.stopPropagation();
        setSelectedTechnique(d.technique);
        // Highlight selected node
        d3.select(this).select('circle').attr('stroke-width', NODE_STYLE.selected_stroke_width);
      })
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add circles to nodes
    node.append('circle')
      .attr('r', (d: any) => getRadius(d.category))
      .attr('fill', (d: any) => getColor(d.category))
      .attr('stroke', NODE_STYLE.stroke_color)
      .attr('stroke-width', NODE_STYLE.stroke_width);

    // Add labels to nodes
    node.append('text')
      .text((d: any) => d.name)
      .attr('x', 0)
      .attr('y', 35)
      .attr('text-anchor', 'middle')
      .attr('fill', '#e5e7eb')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .style('pointer-events', 'none');

    // Update positions on each tick with boundary constraints
    simulation.on('tick', () => {
      // Constrain nodes to stay within bounds
      nodes.forEach((d: any) => {
        const radius = 25;
        d.x = Math.max(radius + 10, Math.min(width - radius - 10, d.x));
        d.y = Math.max(radius + 10, Math.min(height - radius - 10, d.y));
      });

      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions with boundary constraints
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

    // Click on svg background to deselect
    svg.on('click', () => {
      setSelectedTechnique(null);
      d3.selectAll('circle').attr('stroke-width', NODE_STYLE.stroke_width);
    });

    return () => {
      simulation.stop();
    };
  }, [techniques, filterCategory]);

  const getTopCategory = (path: string): string => {
    return path.split(' > ')[0];
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px' }}>
        Technique Network
      </h2>
      <div className="card">
        <p style={{ color: '#9ca3af', marginBottom: '16px' }}>
          Interactive force-directed graph showing technique relationships. Click nodes for details, drag to explore!
        </p>

        {/* Filter */}
        <div style={{ marginBottom: '16px' }}>
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
          </div>
        </div>

        {/* Legend */}
        <div className="legend">
          {Object.entries(CATEGORIES).map(([category, style]) => (
            <div key={category} className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: style.color }}
              />
              <span>{category}</span>
            </div>
          ))}
        </div>

        {techniques.length === 0 ? (
          <div className="empty-state">
            Add some techniques to see the network visualization
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '20px' }}>
            {/* Graph */}
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
            {selectedTechnique && (
              <div className="technique-details-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#93c5fd' }}>
                    {selectedTechnique.name}
                  </h3>
                  <button
                    onClick={() => setSelectedTechnique(null)}
                    className="btn-danger-icon"
                    style={{ padding: '4px' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Paths */}
                <div style={{ marginBottom: '16px' }}>
                  <p className="label">Paths:</p>
                  {selectedTechnique.paths.map((path, index) => (
                    <div key={index} className="technique-path">
                      <span className={`category-badge ${getTopCategory(path).toLowerCase()}`}>
                        {getTopCategory(path)}
                      </span>
                      <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                        {path.split(' > ').slice(1).join(' › ')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Description */}
                {selectedTechnique.description && (
                  <div style={{ marginBottom: '16px' }}>
                    <p className="label">Description:</p>
                    <p style={{ fontSize: '0.875rem', color: '#d1d5db', lineHeight: '1.5' }}>
                      {selectedTechnique.description}
                    </p>
                  </div>
                )}

                {/* Related Techniques */}
                {selectedTechnique.relatedTechniques.length > 0 && (
                  <div>
                    <p className="label">Related Techniques:</p>
                    <div className="tag-container">
                      {selectedTechnique.relatedTechniques.map(relId => {
                        const relTech = techniques.find(t => t.id === relId);
                        return relTech ? (
                          <button
                            key={relId}
                            onClick={() => setSelectedTechnique(relTech)}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ForceGraph;